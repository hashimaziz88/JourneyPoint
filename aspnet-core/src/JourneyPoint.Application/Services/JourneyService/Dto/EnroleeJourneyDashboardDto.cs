using System;
using System.Collections.Generic;
using JourneyPoint.Domains.Hires;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Returns the active journey dashboard for the signed-in enrolee.
    /// </summary>
    public class EnroleeJourneyDashboardDto
    {
        /// <summary>
        /// Gets or sets the journey id.
        /// </summary>
        public Guid JourneyId { get; set; }

        /// <summary>
        /// Gets or sets the hire id.
        /// </summary>
        public Guid HireId { get; set; }

        /// <summary>
        /// Gets or sets the journey status.
        /// </summary>
        public JourneyStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the activation timestamp when present.
        /// </summary>
        public DateTime? ActivatedAt { get; set; }

        /// <summary>
        /// Gets or sets the total participant task count.
        /// </summary>
        public int TotalTaskCount { get; set; }

        /// <summary>
        /// Gets or sets the completed participant task count.
        /// </summary>
        public int CompletedTaskCount { get; set; }

        /// <summary>
        /// Gets or sets the overdue participant task count.
        /// </summary>
        public int OverdueTaskCount { get; set; }

        /// <summary>
        /// Gets or sets the grouped participant task sections.
        /// </summary>
        public IReadOnlyList<EnroleeJourneyModuleGroupDto> Modules { get; set; }
    }
}
