using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Domains.OnboardingPlans
{
    /// <summary>
    /// Represents a reusable template task inside an onboarding module.
    /// </summary>
    public class OnboardingTask : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public const int MinOrderIndex = 1;
        public const int MinDueDayOffset = 0;
        public const int MaxTitleLength = 200;
        public const int MaxDescriptionLength = 4000;

        public int TenantId { get; set; }

        public Guid OnboardingModuleId { get; set; }

        [ForeignKey(nameof(OnboardingModuleId))]
        public virtual OnboardingModule OnboardingModule { get; set; }

        [Required]
        [MaxLength(MaxTitleLength)]
        public string Title { get; set; }

        [Required]
        [MaxLength(MaxDescriptionLength)]
        public string Description { get; set; }

        public OnboardingTaskCategory Category { get; set; }

        [Range(MinOrderIndex, int.MaxValue)]
        public int OrderIndex { get; set; }

        [Range(MinDueDayOffset, int.MaxValue)]
        public int DueDayOffset { get; set; }

        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }
    }
}
