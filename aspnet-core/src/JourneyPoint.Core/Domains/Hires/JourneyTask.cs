using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Domains.Hires
{
    /// <summary>
    /// Represents one copied task inside a hire-specific onboarding journey.
    /// </summary>
    public class JourneyTask : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public const int MinModuleOrderIndex = 1;
        public const int MinTaskOrderIndex = 1;
        public const int MinDueDayOffset = 0;
        public const int MaxModuleTitleLength = 200;
        public const int MaxTitleLength = 200;
        public const int MaxDescriptionLength = 4000;

        public int TenantId { get; set; }

        public Guid JourneyId { get; set; }

        [ForeignKey(nameof(JourneyId))]
        public virtual Journey Journey { get; set; }

        public Guid? SourceOnboardingTaskId { get; set; }

        [ForeignKey(nameof(SourceOnboardingTaskId))]
        public virtual OnboardingTask SourceOnboardingTask { get; set; }

        public Guid? SourceOnboardingModuleId { get; set; }

        [ForeignKey(nameof(SourceOnboardingModuleId))]
        public virtual OnboardingModule SourceOnboardingModule { get; set; }

        [Required]
        [MaxLength(MaxModuleTitleLength)]
        public string ModuleTitle { get; set; }

        [Range(MinModuleOrderIndex, int.MaxValue)]
        public int ModuleOrderIndex { get; set; }

        [Range(MinTaskOrderIndex, int.MaxValue)]
        public int TaskOrderIndex { get; set; }

        [Required]
        [MaxLength(MaxTitleLength)]
        public string Title { get; set; }

        [Required]
        [MaxLength(MaxDescriptionLength)]
        public string Description { get; set; }

        public OnboardingTaskCategory Category { get; set; }

        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }

        [Range(MinDueDayOffset, int.MaxValue)]
        public int DueDayOffset { get; set; }

        public DateTime DueOn { get; set; }

        public JourneyTaskStatus Status { get; set; }

        public DateTime? AcknowledgedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        public long? CompletedByUserId { get; set; }

        public DateTime? PersonalisedAt { get; set; }
    }
}
