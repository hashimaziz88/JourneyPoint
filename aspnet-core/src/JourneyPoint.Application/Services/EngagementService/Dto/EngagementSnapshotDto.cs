using System;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Engagement.Enums;

namespace JourneyPoint.Application.Services.EngagementService.Dto
{
    /// <summary>
    /// Returns one persisted engagement snapshot for facilitator intelligence views.
    /// </summary>
    public class EngagementSnapshotDto
    {
        public Guid Id { get; set; }

        public decimal CompletionRate { get; set; }

        public int DaysSinceLastActivity { get; set; }

        public int OverdueTaskCount { get; set; }

        public decimal CompositeScore { get; set; }

        public EngagementClassification Classification { get; set; }

        public DateTime ComputedAt { get; set; }
    }
}
