using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace JourneyPoint.Domains.OnboardingPlans
{
    /// <summary>
    /// Represents one facilitator-reviewable task proposal extracted from a document.
    /// </summary>
    public class ExtractedTask : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public const int MaxTitleLength = 200;
        public const int MaxDescriptionLength = 4000;
        public const int MinDueDayOffset = 0;

        public int TenantId { get; set; }

        public Guid OnboardingDocumentId { get; set; }

        [ForeignKey(nameof(OnboardingDocumentId))]
        public virtual OnboardingDocument OnboardingDocument { get; set; }

        public Guid? SuggestedModuleId { get; set; }

        [Required]
        [MaxLength(MaxTitleLength)]
        public string Title { get; set; }

        [Required]
        [MaxLength(MaxDescriptionLength)]
        public string Description { get; set; }

        public OnboardingTaskCategory Category { get; set; }

        [Range(MinDueDayOffset, int.MaxValue)]
        public int DueDayOffset { get; set; }

        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }

        public ExtractedTaskReviewStatus ReviewStatus { get; set; }

        public long? ReviewedByUserId { get; set; }

        public DateTime? ReviewedTime { get; set; }

        public Guid? AppliedOnboardingTaskId { get; set; }
    }
}
