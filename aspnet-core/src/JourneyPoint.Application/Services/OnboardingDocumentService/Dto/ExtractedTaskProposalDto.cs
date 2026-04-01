using System;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Application.Services.OnboardingDocumentService.Dto
{
    /// <summary>
    /// Represents one reviewable extracted task proposal.
    /// </summary>
    public class ExtractedTaskProposalDto
    {
        public Guid Id { get; set; }

        public Guid? SuggestedModuleId { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public OnboardingTaskCategory Category { get; set; }

        public int DueDayOffset { get; set; }

        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }

        public ExtractedTaskReviewStatus ReviewStatus { get; set; }

        public long? ReviewedByUserId { get; set; }

        public DateTime? ReviewedTime { get; set; }

        public Guid? AppliedOnboardingTaskId { get; set; }
    }
}
