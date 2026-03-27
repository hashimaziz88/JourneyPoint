using System;
using System.ComponentModel.DataAnnotations;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingDocumentService.Dto
{
    /// <summary>
    /// Represents one facilitator edit to an extracted task proposal.
    /// </summary>
    public class UpdateExtractedTaskProposalRequest
    {
        [Required]
        public Guid ProposalId { get; set; }

        public Guid? SuggestedModuleId { get; set; }

        [Required]
        [MaxLength(OnboardingTask.MaxTitleLength)]
        public string Title { get; set; }

        [Required]
        [MaxLength(OnboardingTask.MaxDescriptionLength)]
        public string Description { get; set; }

        public OnboardingTaskCategory Category { get; set; }

        [Range(OnboardingTask.MinDueDayOffset, int.MaxValue)]
        public int DueDayOffset { get; set; }

        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }
    }
}
