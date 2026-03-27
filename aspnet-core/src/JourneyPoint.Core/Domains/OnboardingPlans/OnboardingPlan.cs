using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace JourneyPoint.Domains.OnboardingPlans
{
    /// <summary>
    /// Represents a reusable onboarding plan owned by a single tenant.
    /// </summary>
    public class OnboardingPlan : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public const int MinDurationDays = 1;
        public const int MaxNameLength = 200;
        public const int MaxDescriptionLength = 4000;
        public const int MaxTargetAudienceLength = 200;

        public OnboardingPlan()
        {
            Modules = new Collection<OnboardingModule>();
        }

        public int TenantId { get; set; }

        [Required]
        [MaxLength(MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [MaxLength(MaxDescriptionLength)]
        public string Description { get; set; }

        [Required]
        [MaxLength(MaxTargetAudienceLength)]
        public string TargetAudience { get; set; }

        [Range(MinDurationDays, int.MaxValue)]
        public int DurationDays { get; set; }

        public OnboardingPlanStatus Status { get; set; }

        public virtual ICollection<OnboardingModule> Modules { get; set; }
    }
}
