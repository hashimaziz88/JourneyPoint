using System;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Carries one facilitator-approved task revision from a reviewed personalisation diff.
    /// </summary>
    public class ApplyJourneyPersonalisationSelectionDto
    {
        /// <summary>
        /// Gets or sets the target journey task id.
        /// </summary>
        public Guid JourneyTaskId { get; set; }

        /// <summary>
        /// Gets or sets the reviewed task snapshot timestamp.
        /// </summary>
        public DateTime BaselineSnapshotAt { get; set; }

        /// <summary>
        /// Gets or sets the approved task title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the approved task description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the approved task category.
        /// </summary>
        public OnboardingTaskCategory Category { get; set; }

        /// <summary>
        /// Gets or sets the approved assignment target.
        /// </summary>
        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        /// <summary>
        /// Gets or sets the approved acknowledgement rule.
        /// </summary>
        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }

        /// <summary>
        /// Gets or sets the approved due-day offset.
        /// </summary>
        public int DueDayOffset { get; set; }
    }
}
