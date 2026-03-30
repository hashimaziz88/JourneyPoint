using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JourneyPoint.Application.Services.EngagementService.Dto;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Hires;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.EngagementService
{
    /// <summary>
    /// Provides tenant-safe engagement query, scoring, and intervention helper workflows.
    /// </summary>
    public partial class EngagementAppService
    {
        private const string CompletedColumnKey = "completed";
        private const string CompletedColumnTitle = "Completed";
        private const int SnapshotHistoryTakeCount = 12;
        private const int ResolvedFlagsTakeCount = 12;

        private async Task<HireIntelligenceDetailDto> BuildHireIntelligenceAsync(Hire hire, User currentUser)
        {
            var intelligence = await ComputeCurrentIntelligenceAsync(hire);
            var recentSnapshots = intelligence.Snapshot == null
                ? new List<EngagementSnapshotDto>()
                : new List<EngagementSnapshotDto> { MapToSnapshotDto(intelligence.Snapshot) };

            if (hire.Journey != null)
            {
                var previousSnapshots = await _engagementSnapshotRepository.GetAll()
                    .AsNoTracking()
                    .Where(snapshot =>
                        snapshot.TenantId == hire.TenantId &&
                        snapshot.HireId == hire.Id)
                    .OrderByDescending(snapshot => snapshot.ComputedAt)
                    .Take(SnapshotHistoryTakeCount - recentSnapshots.Count)
                    .ToListAsync();

                recentSnapshots.AddRange(previousSnapshots.Select(MapToSnapshotDto));
            }

            var resolvedFlags = await _atRiskFlagRepository.GetAll()
                .AsNoTracking()
                .Where(flag =>
                    flag.TenantId == hire.TenantId &&
                    flag.HireId == hire.Id &&
                    flag.Status == AtRiskFlagStatus.Resolved)
                .OrderByDescending(flag => flag.ResolvedAt ?? flag.RaisedAt)
                .Take(ResolvedFlagsTakeCount)
                .ToListAsync();

            if (intelligence.ResolvedFlag != null &&
                resolvedFlags.All(flag => flag.Id != intelligence.ResolvedFlag.Id))
            {
                resolvedFlags.Insert(0, intelligence.ResolvedFlag);
            }

            var userDisplayNames = await GetUserDisplayNamesAsync(
                hire.TenantId,
                hire.ManagerUserId,
                intelligence.ActiveFlag?.AcknowledgedByUserId,
                intelligence.ActiveFlag?.ResolvedByUserId,
                intelligence.ResolvedFlag?.AcknowledgedByUserId,
                intelligence.ResolvedFlag?.ResolvedByUserId,
                currentUser.Id);

            return new HireIntelligenceDetailDto
            {
                HireId = hire.Id,
                JourneyId = hire.Journey?.Id,
                OnboardingPlanId = hire.OnboardingPlanId,
                OnboardingPlanName = hire.OnboardingPlan.Name,
                ManagerUserId = hire.ManagerUserId,
                ManagerDisplayName = GetUserDisplayName(userDisplayNames, hire.ManagerUserId),
                FullName = hire.FullName,
                EmailAddress = hire.EmailAddress,
                RoleTitle = hire.RoleTitle,
                Department = hire.Department,
                StartDate = hire.StartDate,
                HireStatus = hire.Status,
                JourneyStatus = hire.Journey?.Status,
                CurrentStageTitle = intelligence.CurrentStageTitle,
                CurrentSnapshot = intelligence.Snapshot == null ? null : MapToSnapshotDto(intelligence.Snapshot),
                SnapshotHistory = recentSnapshots.Take(SnapshotHistoryTakeCount).ToList(),
                ActiveFlag = intelligence.ActiveFlag == null ? null : MapToFlagDto(intelligence.ActiveFlag, userDisplayNames),
                ResolvedFlags = resolvedFlags
                    .Take(ResolvedFlagsTakeCount)
                    .Select(flag => MapToFlagDto(flag, userDisplayNames))
                    .ToList()
            };
        }

        private async Task<ComputedEngagementContext> ComputeCurrentIntelligenceAsync(Hire hire)
        {
            if (hire.Journey == null || hire.Journey.Status == JourneyStatus.Draft)
            {
                return new ComputedEngagementContext(null, null, null, CompletedColumnTitle);
            }

            var journey = hire.Journey;
            var scoreInput = BuildScoreInput(hire, journey);
            var scoreResult = _engagementScoreService.Calculate(scoreInput);
            var snapshot = _engagementManager.CreateSnapshot(hire.TenantId, hire, journey, scoreInput, scoreResult);
            await _engagementSnapshotRepository.InsertAsync(snapshot);

            var unresolvedFlag = await GetUnresolvedFlagAsync(hire.Id, hire.TenantId);
            var (activeFlag, resolvedFlag) = await SyncAtRiskFlagAsync(hire, journey, scoreResult, unresolvedFlag);
            var stage = GetCurrentStage(journey);

            return new ComputedEngagementContext(snapshot, activeFlag, resolvedFlag, stage.Title);
        }

        private async Task<(AtRiskFlag ActiveFlag, AtRiskFlag ResolvedFlag)> SyncAtRiskFlagAsync(
            Hire hire,
            Journey journey,
            EngagementScoreResult result,
            AtRiskFlag unresolvedFlag)
        {
            if (result.Classification == EngagementClassification.AtRisk)
            {
                if (unresolvedFlag != null)
                {
                    return (unresolvedFlag, null);
                }

                var newFlag = _engagementManager.RaiseAtRiskFlag(
                    hire.TenantId,
                    hire,
                    journey,
                    result.Classification,
                    result.ComputedAt);

                await _atRiskFlagRepository.InsertAsync(newFlag);
                return (newFlag, null);
            }

            if (result.Classification == EngagementClassification.Healthy && unresolvedFlag != null)
            {
                _engagementManager.AutoResolveFlag(unresolvedFlag);
                return (null, unresolvedFlag);
            }

            return (unresolvedFlag, null);
        }

        private async Task<AtRiskFlag> GetUnresolvedFlagAsync(Guid hireId, int tenantId)
        {
            return await _atRiskFlagRepository.GetAll()
                .SingleOrDefaultAsync(flag =>
                    flag.TenantId == tenantId &&
                    flag.HireId == hireId &&
                    flag.Status != AtRiskFlagStatus.Resolved);
        }

        private static EngagementScoreInput BuildScoreInput(Hire hire, Journey journey)
        {
            var orderedTasks = journey.Tasks
                .OrderBy(task => task.ModuleOrderIndex)
                .ThenBy(task => task.TaskOrderIndex)
                .ToList();

            var completedTaskCount = orderedTasks.Count(task => task.Status == JourneyTaskStatus.Completed);
            var overdueTaskCount = orderedTasks.Count(IsOverdue);
            var lastActivityAt = GetLatestActivityAt(hire, journey, orderedTasks);

            return new EngagementScoreInput
            {
                TotalTaskCount = orderedTasks.Count,
                CompletedTaskCount = completedTaskCount,
                OverdueTaskCount = overdueTaskCount,
                DaysSinceLastActivity = Math.Max(0, (DateTime.UtcNow.Date - lastActivityAt.Date).Days),
                ComputedAt = DateTime.UtcNow
            };
        }

        private async Task<IReadOnlyDictionary<long, string>> GetUserDisplayNamesAsync(int tenantId, params long?[] userIds)
        {
            var normalizedUserIds = userIds
                .Where(userId => userId.HasValue)
                .Select(userId => userId!.Value)
                .Distinct()
                .ToList();

            if (normalizedUserIds.Count == 0)
            {
                return new Dictionary<long, string>();
            }

            var users = await _userManager.Users
                .AsNoTracking()
                .Where(user => user.TenantId == tenantId && normalizedUserIds.Contains(user.Id))
                .Select(user => new
                {
                    user.Id,
                    DisplayName = string.IsNullOrWhiteSpace(user.FullName)
                        ? user.UserName
                        : user.FullName
                })
                .ToListAsync();

            return users.ToDictionary(user => user.Id, user => user.DisplayName);
        }

        private static string GetUserDisplayName(IReadOnlyDictionary<long, string> userDisplayNames, long? userId)
        {
            if (!userId.HasValue)
            {
                return null;
            }

            return userDisplayNames.TryGetValue(userId.Value, out var displayName)
                ? displayName
                : null;
        }

        private static DateTime GetLatestActivityAt(Hire hire, Journey journey, IReadOnlyCollection<JourneyTask> tasks)
        {
            var activityTimestamps = tasks
                .SelectMany(task => new[] { task.AcknowledgedAt, task.CompletedAt })
                .Where(timestamp => timestamp.HasValue)
                .Select(timestamp => timestamp!.Value)
                .ToList();

            activityTimestamps.AddRange(new[]
            {
                journey.ActivatedAt,
                journey.CompletedAt,
                hire.ActivatedAt,
                hire.CompletedAt,
                hire.StartDate
            }.Where(timestamp => timestamp.HasValue).Select(timestamp => timestamp!.Value));

            return activityTimestamps.Count == 0
                ? DateTime.UtcNow
                : activityTimestamps.Max();
        }

        private static bool IsOverdue(JourneyTask task)
        {
            return task.Status == JourneyTaskStatus.Pending && task.DueOn.Date < DateTime.UtcNow.Date;
        }

        private static (string Key, string Title, int OrderIndex) GetCurrentStage(Journey journey)
        {
            if (journey.Status == JourneyStatus.Completed || journey.Tasks.All(task => task.Status == JourneyTaskStatus.Completed))
            {
                return (CompletedColumnKey, CompletedColumnTitle, int.MaxValue);
            }

            var pendingTask = journey.Tasks
                .Where(task => task.Status == JourneyTaskStatus.Pending)
                .OrderBy(task => task.ModuleOrderIndex)
                .ThenBy(task => task.TaskOrderIndex)
                .First();

            return ($"module-{pendingTask.ModuleOrderIndex}", pendingTask.ModuleTitle, pendingTask.ModuleOrderIndex);
        }

        private sealed record ComputedEngagementContext(
            EngagementSnapshot Snapshot,
            AtRiskFlag ActiveFlag,
            AtRiskFlag ResolvedFlag,
            string CurrentStageTitle);
    }
}
