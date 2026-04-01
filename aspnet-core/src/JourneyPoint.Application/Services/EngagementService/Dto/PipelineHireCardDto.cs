using System;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Engagement.Enums;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;

namespace JourneyPoint.Application.Services.EngagementService.Dto
{
    /// <summary>
    /// Returns one pipeline card with current engagement intelligence.
    /// </summary>
    public class PipelineHireCardDto
    {
        public Guid HireId { get; set; }

        public Guid JourneyId { get; set; }

        public string FullName { get; set; }

        public string EmailAddress { get; set; }

        public string RoleTitle { get; set; }

        public string Department { get; set; }

        public DateTime StartDate { get; set; }

        public HireLifecycleState HireStatus { get; set; }

        public JourneyStatus JourneyStatus { get; set; }

        public string CurrentStageTitle { get; set; }

        public decimal CompletionRate { get; set; }

        public decimal CompositeScore { get; set; }

        public EngagementClassification Classification { get; set; }

        public bool HasActiveAtRiskFlag { get; set; }

        public Guid? ActiveAtRiskFlagId { get; set; }

        public DateTime SnapshotComputedAt { get; set; }

        /// <summary>The onboarding plan this hire is enrolled under.</summary>
        public Guid OnboardingPlanId { get; set; }

        /// <summary>Display name of the onboarding plan for pipeline grouping.</summary>
        public string OnboardingPlanName { get; set; }
    }
}
