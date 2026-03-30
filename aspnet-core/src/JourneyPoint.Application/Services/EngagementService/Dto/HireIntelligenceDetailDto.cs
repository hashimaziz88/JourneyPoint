using System;
using System.Collections.Generic;
using JourneyPoint.Domains.Hires;

namespace JourneyPoint.Application.Services.EngagementService.Dto
{
    /// <summary>
    /// Returns one hire intelligence profile with current, historical, and intervention data.
    /// </summary>
    public class HireIntelligenceDetailDto
    {
        public Guid HireId { get; set; }

        public Guid? JourneyId { get; set; }

        public Guid OnboardingPlanId { get; set; }

        public string OnboardingPlanName { get; set; }

        public long? ManagerUserId { get; set; }

        public string ManagerDisplayName { get; set; }

        public string FullName { get; set; }

        public string EmailAddress { get; set; }

        public string RoleTitle { get; set; }

        public string Department { get; set; }

        public DateTime StartDate { get; set; }

        public HireLifecycleState HireStatus { get; set; }

        public JourneyStatus? JourneyStatus { get; set; }

        public string CurrentStageTitle { get; set; }

        public EngagementSnapshotDto CurrentSnapshot { get; set; }

        public List<EngagementSnapshotDto> SnapshotHistory { get; set; } = new();

        public AtRiskFlagDto ActiveFlag { get; set; }

        public List<AtRiskFlagDto> ResolvedFlags { get; set; } = new();
    }
}
