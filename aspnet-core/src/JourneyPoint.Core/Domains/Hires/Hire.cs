using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Domains.Hires
{
    /// <summary>
    /// Represents a tenant-scoped hire enrolled against one onboarding plan.
    /// </summary>
    public class Hire : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public const int MaxFullNameLength = 200;
        public const int MaxEmailAddressLength = 256;
        public const int MaxRoleTitleLength = 200;
        public const int MaxDepartmentLength = 200;
        public const int MaxWelcomeNotificationFailureReasonLength = 500;

        public int TenantId { get; set; }

        public Guid OnboardingPlanId { get; set; }

        [ForeignKey(nameof(OnboardingPlanId))]
        public virtual OnboardingPlan OnboardingPlan { get; set; }

        public long? PlatformUserId { get; set; }

        public long? ManagerUserId { get; set; }

        [Required]
        [MaxLength(MaxFullNameLength)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(MaxEmailAddressLength)]
        public string EmailAddress { get; set; }

        [MaxLength(MaxRoleTitleLength)]
        public string RoleTitle { get; set; }

        [MaxLength(MaxDepartmentLength)]
        public string Department { get; set; }

        public DateTime StartDate { get; set; }

        public HireLifecycleState Status { get; set; }

        public WelcomeNotificationStatus WelcomeNotificationStatus { get; set; }

        public DateTime? WelcomeNotificationLastAttemptedAt { get; set; }

        public DateTime? WelcomeNotificationSentAt { get; set; }

        [MaxLength(MaxWelcomeNotificationFailureReasonLength)]
        public string WelcomeNotificationFailureReason { get; set; }

        public DateTime? ActivatedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        public DateTime? ExitedAt { get; set; }

        public virtual Journey Journey { get; set; }
    }
}
