using System;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingDocumentService
{
    /// <summary>
    /// Represents one normalized extraction candidate before it is persisted as a reviewable proposal.
    /// </summary>
    public sealed class ExtractedTaskCandidate
    {
        public Guid? SuggestedModuleId { get; init; }

        public string Title { get; init; }

        public string Description { get; init; }

        public OnboardingTaskCategory Category { get; init; }

        public int DueDayOffset { get; init; }

        public OnboardingTaskAssignmentTarget AssignmentTarget { get; init; }

        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; init; }
    }
}
