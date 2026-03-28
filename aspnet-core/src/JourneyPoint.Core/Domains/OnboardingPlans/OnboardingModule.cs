using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace JourneyPoint.Domains.OnboardingPlans
{
    /// <summary>
    /// Represents an ordered phase inside a reusable onboarding plan.
    /// </summary>
    public class OnboardingModule : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public const int MinOrderIndex = 1;
        public const int MaxNameLength = 200;
        public const int MaxDescriptionLength = 2000;

        public OnboardingModule()
        {
            Tasks = new Collection<OnboardingTask>();
        }

        public int TenantId { get; set; }

        public Guid OnboardingPlanId { get; set; }

        [ForeignKey(nameof(OnboardingPlanId))]
        public virtual OnboardingPlan OnboardingPlan { get; set; }

        [Required]
        [MaxLength(MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [MaxLength(MaxDescriptionLength)]
        public string Description { get; set; }

        [Range(MinOrderIndex, int.MaxValue)]
        public int OrderIndex { get; set; }

        public virtual ICollection<OnboardingTask> Tasks { get; set; }
    }
}
