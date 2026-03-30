using System;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Returns one dashboard-ready task summary for the signed-in enrolee.
    /// </summary>
    public class EnroleeJourneyTaskListItemDto
    {
        /// <summary>
        /// Gets or sets the copied journey task id.
        /// </summary>
        public Guid JourneyTaskId { get; set; }

        /// <summary>
        /// Gets or sets the task title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the task description preview.
        /// </summary>
        public string DescriptionPreview { get; set; }

        /// <summary>
        /// Gets or sets the copied due date.
        /// </summary>
        public DateTime DueOn { get; set; }

        /// <summary>
        /// Gets or sets the task execution state.
        /// </summary>
        public JourneyTaskStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the acknowledgement rule.
        /// </summary>
        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }

        /// <summary>
        /// Gets or sets the acknowledgement timestamp when present.
        /// </summary>
        public DateTime? AcknowledgedAt { get; set; }

        /// <summary>
        /// Gets or sets whether the task is overdue.
        /// </summary>
        public bool IsOverdue { get; set; }

        /// <summary>
        /// Gets or sets whether the task includes applied AI personalisation.
        /// </summary>
        public bool IsPersonalised { get; set; }
    }
}
