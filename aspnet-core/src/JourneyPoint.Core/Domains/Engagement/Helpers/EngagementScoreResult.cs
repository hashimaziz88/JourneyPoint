using System;

namespace JourneyPoint.Domains.Engagement.Helpers
{
    /// <summary>
    /// Represents the deterministic result of one engagement scoring run.
    /// </summary>
    public class EngagementScoreResult
    {
        public decimal CompletionRate { get; set; }

        public decimal CompletionScore { get; set; }

        public decimal RecencyScore { get; set; }

        public decimal OverdueScore { get; set; }

        public decimal CompositeScore { get; set; }

        public EngagementClassification Classification { get; set; }

        public DateTime ComputedAt { get; set; }
    }
}
