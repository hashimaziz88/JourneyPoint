using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using JourneyPoint.Application.Services.EngagementService.Dto;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Hires;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.EngagementService
{
    /// <summary>
    /// Provides query, scope, and session helpers for engagement application workflows.
    /// </summary>
    public partial class EngagementAppService
    {
        private async Task<PipelineBoardDto> BuildPipelineBoardAsync(int tenantId, GetPipelineBoardInput input)
        {
            var normalizedInput = input ?? new GetPipelineBoardInput();
            var hires = await GetPipelineCandidateHiresAsync(tenantId, normalizedInput);
            var pipelineEntries = new List<(PipelineHireCardDto Card, string ColumnKey, string ColumnTitle, int OrderIndex)>();

            foreach (var hire in hires)
            {
                var intelligence = await ComputeCurrentIntelligenceAsync(hire);

                if (intelligence.Snapshot == null)
                {
                    continue;
                }

                if (normalizedInput.Classification.HasValue &&
                    intelligence.Snapshot.Classification != normalizedInput.Classification.Value)
                {
                    continue;
                }

                var stage = GetCurrentStage(hire.Journey);
                pipelineEntries.Add((new PipelineHireCardDto
                {
                    HireId = hire.Id,
                    JourneyId = intelligence.Snapshot.JourneyId,
                    FullName = hire.FullName,
                    EmailAddress = hire.EmailAddress,
                    RoleTitle = hire.RoleTitle,
                    Department = hire.Department,
                    StartDate = hire.StartDate,
                    HireStatus = hire.Status,
                    JourneyStatus = hire.Journey.Status,
                    CurrentStageTitle = intelligence.CurrentStageTitle,
                    CompletionRate = intelligence.Snapshot.CompletionRate,
                    CompositeScore = intelligence.Snapshot.CompositeScore,
                    Classification = intelligence.Snapshot.Classification,
                    HasActiveAtRiskFlag = intelligence.ActiveFlag != null,
                    ActiveAtRiskFlagId = intelligence.ActiveFlag?.Id,
                    SnapshotComputedAt = intelligence.Snapshot.ComputedAt,
                    OnboardingPlanId = hire.OnboardingPlanId,
                    OnboardingPlanName = hire.OnboardingPlan.Name
                }, stage.Key, stage.Title, stage.OrderIndex));
            }

            var columns = pipelineEntries
                .GroupBy(entry => new { entry.ColumnKey, entry.ColumnTitle, entry.OrderIndex })
                .Select(group => new PipelineColumnDto
                {
                    ColumnKey = group.Key.ColumnKey,
                    ColumnTitle = group.Key.ColumnTitle,
                    OrderIndex = group.Key.OrderIndex,
                    Hires = group
                        .Select(entry => entry.Card)
                        .OrderBy(card => card.StartDate)
                        .ThenBy(card => card.FullName)
                        .ToList()
                })
                .OrderBy(column => column.OrderIndex)
                .ThenBy(column => column.ColumnTitle)
                .ToList();

            return new PipelineBoardDto
            {
                GeneratedAt = DateTime.UtcNow,
                Keyword = normalizedInput.Keyword?.Trim(),
                ClassificationFilter = normalizedInput.Classification,
                Columns = columns
            };
        }

        private async Task<List<Hire>> GetPipelineCandidateHiresAsync(int tenantId, GetPipelineBoardInput input)
        {
            var normalizedKeyword = input.Keyword?.Trim();

            return await _hireRepository.GetAll()
                .AsNoTracking()
                .Include(hire => hire.OnboardingPlan)
                .Include(hire => hire.Journey)
                    .ThenInclude(journey => journey.Tasks)
                .Where(hire =>
                    hire.TenantId == tenantId &&
                    hire.Status != HireLifecycleState.Exited &&
                    hire.Journey != null &&
                    hire.Journey.Status != JourneyStatus.Draft)
                .WhereIf(
                    !string.IsNullOrWhiteSpace(normalizedKeyword),
                    hire =>
                        hire.FullName.Contains(normalizedKeyword) ||
                        hire.EmailAddress.Contains(normalizedKeyword) ||
                        (hire.RoleTitle != null && hire.RoleTitle.Contains(normalizedKeyword)) ||
                        (hire.Department != null && hire.Department.Contains(normalizedKeyword)) ||
                        hire.OnboardingPlan.Name.Contains(normalizedKeyword))
                .OrderBy(hire => hire.StartDate)
                .ThenBy(hire => hire.FullName)
                .ToListAsync();
        }

        private async Task<Hire> GetHireForIntelligenceAsync(Guid hireId, int tenantId, User currentUser)
        {
            var hire = await _hireRepository.GetAll()
                .AsNoTracking()
                .Include(existingHire => existingHire.OnboardingPlan)
                .Include(existingHire => existingHire.Journey)
                    .ThenInclude(journey => journey.Tasks)
                .SingleOrDefaultAsync(existingHire =>
                    existingHire.Id == hireId &&
                    existingHire.TenantId == tenantId);

            if (hire == null)
            {
                throw new EntityNotFoundException(typeof(Hire), hireId);
            }

            if (await CanViewAllHireIntelligenceAsync(currentUser) || hire.ManagerUserId == currentUser.Id)
            {
                return hire;
            }

            throw new EntityNotFoundException(typeof(Hire), hireId);
        }

        private async Task<bool> CanViewAllHireIntelligenceAsync(User currentUser)
        {
            var roleNames = await _userManager.GetRolesAsync(currentUser);

            return roleNames.Any(roleName =>
                StaticRoleNames.Tenants.IsTenantAdmin(roleName) ||
                string.Equals(roleName, StaticRoleNames.Tenants.Facilitator, StringComparison.OrdinalIgnoreCase));
        }

        private async Task<AtRiskFlag> GetFlagForFacilitatorActionAsync(Guid flagId, int tenantId)
        {
            var flag = await _atRiskFlagRepository.GetAll()
                .SingleOrDefaultAsync(existingFlag =>
                    existingFlag.Id == flagId &&
                    existingFlag.TenantId == tenantId);

            if (flag == null)
            {
                throw new EntityNotFoundException(typeof(AtRiskFlag), flagId);
            }

            return flag;
        }

        private int GetRequiredTenantId()
        {
            return AbpSession.GetTenantId();
        }

        private long GetRequiredUserId()
        {
            return AbpSession.GetUserId();
        }
    }
}
