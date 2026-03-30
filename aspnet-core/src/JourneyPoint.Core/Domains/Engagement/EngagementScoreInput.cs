using System;
using System.ComponentModel.DataAnnotations;

namespace JourneyPoint.Domains.Engagement
{
    /// <summary>
    /// Represents the normalized task-state inputs required for one engagement scoring run.
    /// </summary>
    public class EngagementScoreInput
    {
        [Range(1, int.MaxValue)]
        public int TotalTaskCount { get; set; }

        [Range(0, int.MaxValue)]
        public int CompletedTaskCount { get; set; }

        [Range(0, int.MaxValue)]
        public int DaysSinceLastActivity { get; set; }

        [Range(0, int.MaxValue)]
        public int OverdueTaskCount { get; set; }

        public DateTime ComputedAt { get; set; }
    }
}
