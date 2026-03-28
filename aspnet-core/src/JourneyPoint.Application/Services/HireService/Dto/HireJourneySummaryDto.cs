using System;
using JourneyPoint.Domains.Hires;

namespace JourneyPoint.Application.Services.HireService.Dto
{
    /// <summary>
    /// Returns a compact journey summary for facilitator hire screens.
    /// </summary>
    public class HireJourneySummaryDto
    {
        /// <summary>
        /// Gets or sets the journey id.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the current journey lifecycle state.
        /// </summary>
        public JourneyStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the total task count in the journey.
        /// </summary>
        public int TaskCount { get; set; }

        /// <summary>
        /// Gets or sets the completed task count in the journey.
        /// </summary>
        public int CompletedTaskCount { get; set; }

        /// <summary>
        /// Gets or sets the pending task count in the journey.
        /// </summary>
        public int PendingTaskCount { get; set; }

        /// <summary>
        /// Gets or sets the activation timestamp when applicable.
        /// </summary>
        public DateTime? ActivatedAt { get; set; }
    }
}
