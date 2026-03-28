using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using Abp.Linq.Extensions;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Application.Services.HireService.Dto;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Domains.Hires;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.HireService
{
    /// <summary>
    /// Provides query and mapping helpers for facilitator hire-management screens.
    /// </summary>
    public partial class HireAppService
    {
        private async Task<ListResultDto<ManagerOptionDto>> GetManagerOptionsListAsync()
        {
            var tenantId = GetRequiredTenantId();
            var managers = await _userManager.GetUsersInRoleAsync(StaticRoleNames.Tenants.Manager);

            var items = managers
                .Where(user => user.TenantId == tenantId && user.IsActive)
                .OrderBy(user => string.IsNullOrWhiteSpace(user.FullName) ? user.UserName : user.FullName)
                .Select(user => new ManagerOptionDto
                {
                    Id = user.Id,
                    DisplayName = string.IsNullOrWhiteSpace(user.FullName)
                        ? user.UserName
                        : user.FullName,
                    EmailAddress = user.EmailAddress
                })
                .ToList();

            return new ListResultDto<ManagerOptionDto>(items);
        }

        private async Task<PagedResultDto<HireListItemDto>> GetHiresPageAsync(GetHiresInput input)
        {
            var tenantId = GetRequiredTenantId();
            var normalizedInput = input ?? new GetHiresInput();
            var normalizedKeyword = normalizedInput.Keyword?.Trim();
            var query = _hireRepository.GetAll()
                .AsNoTracking()
                .Include(hire => hire.OnboardingPlan)
                .Include(hire => hire.Journey)
                .Where(hire => hire.TenantId == tenantId)
                .WhereIf(
                    !string.IsNullOrWhiteSpace(normalizedKeyword),
                    hire =>
                        hire.FullName.Contains(normalizedKeyword) ||
                        hire.EmailAddress.Contains(normalizedKeyword) ||
                        (hire.RoleTitle != null && hire.RoleTitle.Contains(normalizedKeyword)) ||
                        (hire.Department != null && hire.Department.Contains(normalizedKeyword)) ||
                        hire.OnboardingPlan.Name.Contains(normalizedKeyword))
                .WhereIf(normalizedInput.Status.HasValue, hire => hire.Status == normalizedInput.Status.Value);

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(hire => hire.StartDate)
                .ThenBy(hire => hire.FullName)
                .PageBy(normalizedInput)
                .Select(hire => new HireListItemDto
                {
                    Id = hire.Id,
                    OnboardingPlanId = hire.OnboardingPlanId,
                    OnboardingPlanName = hire.OnboardingPlan.Name,
                    JourneyId = hire.Journey != null ? hire.Journey.Id : null,
                    JourneyStatus = hire.Journey != null ? hire.Journey.Status : null,
                    FullName = hire.FullName,
                    EmailAddress = hire.EmailAddress,
                    RoleTitle = hire.RoleTitle,
                    Department = hire.Department,
                    StartDate = hire.StartDate,
                    Status = hire.Status,
                    WelcomeNotificationStatus = hire.WelcomeNotificationStatus
                })
                .ToListAsync();

            return new PagedResultDto<HireListItemDto>(totalCount, items);
        }

        private async Task<HireDetailDto> GetHireDetailAsync(Guid hireId)
        {
            var hire = await _hireRepository.GetAll()
                .AsNoTracking()
                .Include(existingHire => existingHire.OnboardingPlan)
                .Include(existingHire => existingHire.Journey)
                    .ThenInclude(journey => journey.Tasks)
                .SingleOrDefaultAsync(existingHire =>
                    existingHire.Id == hireId &&
                    existingHire.TenantId == GetRequiredTenantId());

            if (hire == null)
            {
                throw new EntityNotFoundException(typeof(Hire), hireId);
            }

            var userDisplayNames = await GetUserDisplayNamesAsync(
                hire.TenantId,
                hire.PlatformUserId,
                hire.ManagerUserId);

            return new HireDetailDto
            {
                Id = hire.Id,
                OnboardingPlanId = hire.OnboardingPlanId,
                OnboardingPlanName = hire.OnboardingPlan.Name,
                PlatformUserId = hire.PlatformUserId,
                PlatformUserDisplayName = GetUserDisplayName(userDisplayNames, hire.PlatformUserId),
                ManagerUserId = hire.ManagerUserId,
                ManagerDisplayName = GetUserDisplayName(userDisplayNames, hire.ManagerUserId),
                FullName = hire.FullName,
                EmailAddress = hire.EmailAddress,
                RoleTitle = hire.RoleTitle,
                Department = hire.Department,
                StartDate = hire.StartDate,
                Status = hire.Status,
                WelcomeNotificationStatus = hire.WelcomeNotificationStatus,
                WelcomeNotificationLastAttemptedAt = hire.WelcomeNotificationLastAttemptedAt,
                WelcomeNotificationSentAt = hire.WelcomeNotificationSentAt,
                WelcomeNotificationFailureReason = hire.WelcomeNotificationFailureReason,
                ActivatedAt = hire.ActivatedAt,
                CompletedAt = hire.CompletedAt,
                ExitedAt = hire.ExitedAt,
                Journey = hire.Journey == null
                    ? null
                    : new HireJourneySummaryDto
                    {
                        Id = hire.Journey.Id,
                        Status = hire.Journey.Status,
                        TaskCount = hire.Journey.Tasks.Count,
                        CompletedTaskCount = hire.Journey.Tasks.Count(task => task.Status == JourneyTaskStatus.Completed),
                        PendingTaskCount = hire.Journey.Tasks.Count(task => task.Status == JourneyTaskStatus.Pending),
                        ActivatedAt = hire.Journey.ActivatedAt
                    }
            };
        }

        private async Task<IReadOnlyDictionary<long, string>> GetUserDisplayNamesAsync(
            int tenantId,
            params long?[] userIds)
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
    }
}
