using System;
using System.Collections.Generic;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Returns the current journey draft or active journey state for one hire.
    /// </summary>
    public class JourneyDraftDto
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
        /// Gets or sets the source onboarding plan id.
        /// </summary>
        public Guid OnboardingPlanId { get; set; }

        /// <summary>
        /// Gets or sets the hire start date used for due-date calculation.
        /// </summary>
        public DateTime HireStartDate { get; set; }

        /// <summary>
        /// Gets or sets the current hire lifecycle state.
        /// </summary>
        public HireLifecycleState HireStatus { get; set; }

        /// <summary>
        /// Gets or sets the current journey lifecycle state.
        /// </summary>
        public JourneyStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the journey activation timestamp when applicable.
        /// </summary>
        public DateTime? ActivatedAt { get; set; }

        /// <summary>
        /// Gets or sets the journey pause timestamp when applicable.
        /// </summary>
        public DateTime? PausedAt { get; set; }

        /// <summary>
        /// Gets or sets the journey completion timestamp when applicable.
        /// </summary>
        public DateTime? CompletedAt { get; set; }

        /// <summary>
        /// Gets or sets the ordered journey task snapshots for facilitator review.
        /// </summary>
        public IReadOnlyList<JourneyTaskReviewDto> Tasks { get; set; }
    }
}
