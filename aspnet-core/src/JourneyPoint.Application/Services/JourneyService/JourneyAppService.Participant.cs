using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Entities;
using JourneyPoint.Application.Services.JourneyService.Dto;
using JourneyPoint.Authorization;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.JourneyService
{
    /// <summary>
    /// Provides participant-safe journey reads and task actions for enrolees.
    /// </summary>
    public partial class JourneyAppService
    {
        /// <summary>
        /// Returns the active journey dashboard for the signed-in enrolee.
        /// </summary>
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Enrolee)]
        public async Task<EnroleeJourneyDashboardDto> GetMyJourneyAsync()
        {
            var hire = await GetHireForCurrentEnroleeAsync(GetRequiredTenantId(), GetRequiredUserId());
            return hire == null || hire.Journey == null
                ? null
                : MapToEnroleeDashboardDto(hire.Journey);
        }

        /// <summary>
        /// Returns one detailed participant task view for the signed-in enrolee.
        /// </summary>
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Enrolee)]
        public async Task<EnroleeJourneyTaskDetailDto> GetMyTaskAsync(Guid journeyTaskId)
        {
            var journeyTask = await GetEnroleeJourneyTaskAsync(
                journeyTaskId,
                GetRequiredTenantId(),
                GetRequiredUserId());

            return MapToEnroleeTaskDetailDto(journeyTask);
        }

        /// <summary>
        /// Records acknowledgement for one participant task when required.
        /// </summary>
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Enrolee)]
        public async Task<EnroleeJourneyTaskDetailDto> AcknowledgeMyTaskAsync(
            AcknowledgeJourneyTaskRequest input)
        {
            ArgumentNullException.ThrowIfNull(input);

            var userId = GetRequiredUserId();
            var journeyTask = await GetEnroleeJourneyTaskAsync(
                input.JourneyTaskId,
                GetRequiredTenantId(),
                userId);

            _hireJourneyManager.AcknowledgeEnroleeTask(
                journeyTask.Journey.Hire,
                journeyTask.Journey,
                journeyTask,
                userId);

            await CurrentUnitOfWork.SaveChangesAsync();
            return MapToEnroleeTaskDetailDto(journeyTask);
        }

        /// <summary>
        /// Completes one participant task after all checks succeed.
        /// </summary>
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Enrolee)]
        public async Task<EnroleeJourneyTaskDetailDto> CompleteMyTaskAsync(
            CompleteJourneyTaskRequest input)
        {
            ArgumentNullException.ThrowIfNull(input);

            var userId = GetRequiredUserId();
            var journeyTask = await GetEnroleeJourneyTaskAsync(
                input.JourneyTaskId,
                GetRequiredTenantId(),
                userId);

            _hireJourneyManager.CompleteEnroleeTask(
                journeyTask.Journey.Hire,
                journeyTask.Journey,
                journeyTask,
                userId);

            await CurrentUnitOfWork.SaveChangesAsync();
            return MapToEnroleeTaskDetailDto(journeyTask);
        }

        private async Task<Hire> GetHireForCurrentEnroleeAsync(int tenantId, long userId)
        {
            return await _hireRepository.GetAll()
                .Include(existingHire => existingHire.Journey)
                    .ThenInclude(journey => journey.Tasks)
                .SingleOrDefaultAsync(existingHire =>
                    existingHire.TenantId == tenantId &&
                    existingHire.PlatformUserId == userId &&
                    existingHire.Journey != null &&
                    existingHire.Journey.Status == JourneyStatus.Active);
        }

        private async Task<JourneyTask> GetEnroleeJourneyTaskAsync(
            Guid journeyTaskId,
            int tenantId,
            long userId)
        {
            var journeyTask = await _journeyTaskRepository.GetAll()
                .Include(existingTask => existingTask.Journey)
                    .ThenInclude(journey => journey.Hire)
                .SingleOrDefaultAsync(existingTask =>
                    existingTask.Id == journeyTaskId &&
                    existingTask.TenantId == tenantId &&
                    existingTask.AssignmentTarget == OnboardingTaskAssignmentTarget.Enrolee &&
                    existingTask.Journey.Hire.PlatformUserId == userId &&
                    existingTask.Journey.Status == JourneyStatus.Active);

            if (journeyTask == null)
            {
                throw new EntityNotFoundException(typeof(JourneyTask), journeyTaskId);
            }

            return journeyTask;
        }

        private long GetRequiredUserId()
        {
            if (!AbpSession.UserId.HasValue)
            {
                throw new AbpAuthorizationException("Participant journey access requires an authenticated user.");
            }

            return AbpSession.UserId.Value;
        }

        private static EnroleeJourneyDashboardDto MapToEnroleeDashboardDto(Journey journey)
        {
            var enroleeTasks = journey.Tasks
                .Where(task => task.AssignmentTarget == OnboardingTaskAssignmentTarget.Enrolee)
                .OrderBy(task => task.ModuleOrderIndex)
                .ThenBy(task => task.TaskOrderIndex)
                .ToList();

            return new EnroleeJourneyDashboardDto
            {
                JourneyId = journey.Id,
                HireId = journey.HireId,
                Status = journey.Status,
                ActivatedAt = journey.ActivatedAt,
                TotalTaskCount = enroleeTasks.Count,
                CompletedTaskCount = enroleeTasks.Count(task => task.Status == JourneyTaskStatus.Completed),
                OverdueTaskCount = enroleeTasks.Count(IsOverdue),
                Modules = enroleeTasks
                    .GroupBy(task => new { task.ModuleOrderIndex, task.ModuleTitle })
                    .OrderBy(group => group.Key.ModuleOrderIndex)
                    .Select(group => new EnroleeJourneyModuleGroupDto
                    {
                        ModuleKey = $"{group.Key.ModuleOrderIndex}:{group.Key.ModuleTitle}",
                        ModuleTitle = group.Key.ModuleTitle,
                        ModuleOrderIndex = group.Key.ModuleOrderIndex,
                        TotalTaskCount = group.Count(),
                        CompletedTaskCount = group.Count(task => task.Status == JourneyTaskStatus.Completed),
                        PendingTaskCount = group.Count(task => task.Status == JourneyTaskStatus.Pending),
                        Tasks = group
                            .OrderBy(task => task.TaskOrderIndex)
                            .Select(MapToEnroleeTaskListItemDto)
                            .ToList()
                    })
                    .ToList()
            };
        }

        private static EnroleeJourneyTaskListItemDto MapToEnroleeTaskListItemDto(JourneyTask journeyTask)
        {
            return new EnroleeJourneyTaskListItemDto
            {
                JourneyTaskId = journeyTask.Id,
                Title = journeyTask.Title,
                DescriptionPreview = BuildDescriptionPreview(journeyTask.Description),
                DueOn = journeyTask.DueOn,
                Status = journeyTask.Status,
                AcknowledgementRule = journeyTask.AcknowledgementRule,
                AcknowledgedAt = journeyTask.AcknowledgedAt,
                IsOverdue = IsOverdue(journeyTask),
                IsPersonalised = journeyTask.PersonalisedAt.HasValue
            };
        }

        private static EnroleeJourneyTaskDetailDto MapToEnroleeTaskDetailDto(JourneyTask journeyTask)
        {
            return new EnroleeJourneyTaskDetailDto
            {
                JourneyTaskId = journeyTask.Id,
                JourneyId = journeyTask.JourneyId,
                ModuleTitle = journeyTask.ModuleTitle,
                ModuleOrderIndex = journeyTask.ModuleOrderIndex,
                TaskOrderIndex = journeyTask.TaskOrderIndex,
                Title = journeyTask.Title,
                Description = journeyTask.Description,
                DueOn = journeyTask.DueOn,
                Status = journeyTask.Status,
                AcknowledgementRule = journeyTask.AcknowledgementRule,
                AcknowledgedAt = journeyTask.AcknowledgedAt,
                CompletedAt = journeyTask.CompletedAt,
                IsOverdue = IsOverdue(journeyTask),
                IsPersonalised = journeyTask.PersonalisedAt.HasValue,
                PersonalisedAt = journeyTask.PersonalisedAt,
                CanAcknowledge = CanAcknowledge(journeyTask),
                CanComplete = CanComplete(journeyTask)
            };
        }

        private static bool IsOverdue(JourneyTask journeyTask)
        {
            return journeyTask.Status == JourneyTaskStatus.Pending &&
                   journeyTask.DueOn.Date < DateTime.UtcNow.Date;
        }

        private static bool CanAcknowledge(JourneyTask journeyTask)
        {
            return journeyTask.Status == JourneyTaskStatus.Pending &&
                   journeyTask.AcknowledgementRule == OnboardingTaskAcknowledgementRule.Required &&
                   !journeyTask.AcknowledgedAt.HasValue;
        }

        private static bool CanComplete(JourneyTask journeyTask)
        {
            return journeyTask.Status == JourneyTaskStatus.Pending &&
                   (journeyTask.AcknowledgementRule == OnboardingTaskAcknowledgementRule.NotRequired ||
                    journeyTask.AcknowledgedAt.HasValue);
        }

        private static string BuildDescriptionPreview(string description)
        {
            if (string.IsNullOrWhiteSpace(description))
            {
                return string.Empty;
            }

            const int maxLength = 160;
            var trimmedDescription = description.Trim();
            return trimmedDescription.Length <= maxLength
                ? trimmedDescription
                : $"{trimmedDescription[..maxLength].TrimEnd()}...";
        }
    }
}
