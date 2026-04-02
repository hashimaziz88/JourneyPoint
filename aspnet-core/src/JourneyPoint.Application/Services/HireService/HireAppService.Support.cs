using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Uow;
using JourneyPoint.Application.Services.HireService.Dto;
using JourneyPoint.Application.Services.NotificationService;
using JourneyPoint.Application.Services.NotificationService.Dto;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.HireService
{
    /// <summary>
    /// Provides query, validation, mapping, and notification helpers for hire enrolment.
    /// </summary>
    public partial class HireAppService
    {
        private async Task<OnboardingPlan> GetPublishedPlanAsync(Guid planId, int tenantId)
        {
            var onboardingPlan = await _onboardingPlanRepository.GetAll()
                .AsNoTracking()
                .SingleOrDefaultAsync(plan => plan.Id == planId && plan.TenantId == tenantId);

            if (onboardingPlan == null)
            {
                throw new EntityNotFoundException(typeof(OnboardingPlan), planId);
            }

            if (onboardingPlan.Status != OnboardingPlanStatus.Published)
            {
                throw new InvalidOperationException("Only published onboarding plans can be used for hire enrolment.");
            }

            return onboardingPlan;
        }

        private async Task<User> GetManagerUserOrNullAsync(long? managerUserId, int tenantId)
        {
            if (!managerUserId.HasValue)
            {
                return null;
            }

            var managerUser = await _userManager.Users.SingleOrDefaultAsync(user =>
                user.Id == managerUserId.Value &&
                user.TenantId == tenantId &&
                !user.IsDeleted);

            if (managerUser == null)
            {
                throw new EntityNotFoundException(typeof(User), managerUserId.Value);
            }

            if (!managerUser.IsActive)
            {
                throw new InvalidOperationException("Assigned manager must be active.");
            }

            var managerRoles = await _userManager.GetRolesAsync(managerUser);
            if (!managerRoles.Any(roleName => string.Equals(roleName, StaticRoleNames.Tenants.Manager, StringComparison.OrdinalIgnoreCase)))
            {
                throw new AbpAuthorizationException("Assigned manager must already have the Manager role.");
            }

            return managerUser;
        }

        private async Task EnsureHireEmailIsAvailableAsync(string normalizedEmailAddress, int tenantId)
        {
            var emailAlreadyUsedByHire = await _hireRepository.GetAll()
                .AnyAsync(hire => hire.TenantId == tenantId && hire.EmailAddress == normalizedEmailAddress);

            if (emailAlreadyUsedByHire)
            {
                throw new InvalidOperationException("A hire with this email address already exists for the current tenant.");
            }
        }

        private async Task EnsurePlatformEmailIsAvailableAsync(string normalizedEmailAddress, int tenantId)
        {
            var normalizedUserName = normalizedEmailAddress.ToUpperInvariant();
            var platformUserExists = await _userManager.Users.AnyAsync(user =>
                user.TenantId == tenantId &&
                !user.IsDeleted &&
                (user.NormalizedEmailAddress == normalizedUserName || user.NormalizedUserName == normalizedUserName));

            if (platformUserExists)
            {
                throw new InvalidOperationException("A platform user with this email address already exists for the current tenant.");
            }
        }

        private User BuildPlatformUser(
            Hire hire,
            string normalizedEmailAddress,
            string firstName,
            string lastName)
        {
            var user = new User
            {
                TenantId = hire.TenantId,
                Name = firstName,
                Surname = lastName,
                EmailAddress = normalizedEmailAddress,
                UserName = normalizedEmailAddress,
                IsActive = true,
                IsEmailConfirmed = true
            };

            user.SetNormalizedNames();
            return user;
        }

        private async Task<WelcomeNotificationDispatchResult> SendWelcomeNotificationAsync(
            Hire hire,
            User platformUser,
            string temporaryPassword)
        {
            var tenant = await GetCurrentTenantAsync();
            return await _welcomeNotificationService.SendAsync(new WelcomeNotificationMessage
            {
                TenantName = tenant?.TenancyName ?? "JourneyPoint",
                RecipientName = hire.FullName,
                RecipientEmailAddress = hire.EmailAddress,
                UserName = platformUser.UserName,
                TemporaryPassword = temporaryPassword
            });
        }

        private async Task<Hire> GetHireForEditAsync(Guid hireId)
        {
            var hire = await _hireRepository.GetAll()
                .SingleOrDefaultAsync(existingHire =>
                    existingHire.Id == hireId &&
                    existingHire.TenantId == GetRequiredTenantId());

            if (hire == null)
            {
                throw new EntityNotFoundException(typeof(Hire), hireId);
            }

            return hire;
        }

        private async Task<User> GetPlatformUserAsync(Hire hire)
        {
            if (!hire.PlatformUserId.HasValue)
            {
                throw new InvalidOperationException("The hire does not yet have a provisioned platform account.");
            }

            var platformUser = await _userManager.Users.SingleOrDefaultAsync(user =>
                user.Id == hire.PlatformUserId.Value &&
                user.TenantId == hire.TenantId &&
                !user.IsDeleted);

            if (platformUser == null)
            {
                throw new EntityNotFoundException(typeof(User), hire.PlatformUserId.Value);
            }

            return platformUser;
        }

        private async Task ResetPlatformPasswordAsync(User platformUser, string temporaryPassword)
        {
            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(platformUser);
            CheckErrors(await _userManager.ResetPasswordAsync(platformUser, resetToken, temporaryPassword));
        }

        private void ApplyWelcomeResult(Hire hire, WelcomeNotificationDispatchResult result)
        {
            if (result.Succeeded)
            {
                _hireJourneyManager.MarkWelcomeNotificationSent(hire, result.SentAt ?? result.AttemptedAt);
                return;
            }

            _hireJourneyManager.MarkWelcomeNotificationFailed(hire, result.AttemptedAt, result.FailureReason);
        }

        private int GetRequiredTenantId()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                throw new AbpAuthorizationException("Hire enrolment requires a tenant context.");
            }

            return AbpSession.TenantId.Value;
        }

        private static string NormalizeEmailAddress(string value)
        {
            return string.IsNullOrWhiteSpace(value)
                ? string.Empty
                : value.Trim().ToLowerInvariant();
        }

        private static string NormalizeRequiredNamePart(string value, string parameterName)
        {
            var normalizedValue = value?.Trim() ?? string.Empty;
            if (string.IsNullOrWhiteSpace(normalizedValue))
            {
                throw new InvalidOperationException($"{parameterName} is required.");
            }

            return normalizedValue;
        }

        private static HireEnrolmentResultDto MapToResultDto(Hire hire)
        {
            return new HireEnrolmentResultDto
            {
                Id = hire.Id,
                OnboardingPlanId = hire.OnboardingPlanId,
                PlatformUserId = hire.PlatformUserId ?? 0,
                ManagerUserId = hire.ManagerUserId,
                FullName = hire.FullName,
                EmailAddress = hire.EmailAddress,
                RoleTitle = hire.RoleTitle,
                Department = hire.Department,
                StartDate = hire.StartDate,
                Status = hire.Status,
                WelcomeNotificationStatus = hire.WelcomeNotificationStatus,
                WelcomeNotificationLastAttemptedAt = hire.WelcomeNotificationLastAttemptedAt,
                WelcomeNotificationSentAt = hire.WelcomeNotificationSentAt,
                WelcomeNotificationFailureReason = hire.WelcomeNotificationFailureReason
            };
        }

        /// <summary>
        /// Sends the welcome email in a background task with its own unit-of-work,
        /// so the hire creation response is not blocked by SMTP latency.
        /// </summary>
        private async Task SendWelcomeNotificationInBackgroundAsync(
            Guid hireId,
            long platformUserId,
            string temporaryPassword,
            int tenantId)
        {
            try
            {
                using var uow = UnitOfWorkManager.Begin(new UnitOfWorkOptions
                {
                    Scope = System.Transactions.TransactionScopeOption.RequiresNew,
                    IsTransactional = true
                });

                using (CurrentUnitOfWork.SetTenantId(tenantId))
                {
                    var hire = await _hireRepository.GetAsync(hireId);
                    var platformUser = await _userManager.GetUserByIdAsync(platformUserId);
                    var tenant = await TenantManager.GetByIdAsync(tenantId);

                    var result = await _welcomeNotificationService.SendAsync(new WelcomeNotificationMessage
                    {
                        TenantName = tenant?.TenancyName ?? "JourneyPoint",
                        RecipientName = hire.FullName,
                        RecipientEmailAddress = hire.EmailAddress,
                        UserName = platformUser.UserName,
                        TemporaryPassword = temporaryPassword
                    });

                    ApplyWelcomeResult(hire, result);
                    await uow.CompleteAsync();
                }
            }
            catch (Exception exception)
            {
                Logger.Error($"Background welcome notification failed for hire {hireId}.", exception);
            }
        }
    }
}
