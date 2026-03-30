using System;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Returns one detailed participant task view for the signed-in enrolee.
    /// </summary>
    public class EnroleeJourneyTaskDetailDto
    {
        /// <summary>
        /// Gets or sets the journey task id.
        /// </summary>
        public Guid JourneyTaskId { get; set; }

        /// <summary>
        /// Gets or sets the parent journey id.
        /// </summary>
        public Guid JourneyId { get; set; }

        /// <summary>
        /// Gets or sets the copied module title.
        /// </summary>
        public string ModuleTitle { get; set; }

        /// <summary>
        /// Gets or sets the copied module order index.
        /// </summary>
        public int ModuleOrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the copied task order index.
        /// </summary>
        public int TaskOrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the copied task title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the copied task description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the copied due date.
        /// </summary>
        public DateTime DueOn { get; set; }

        /// <summary>
        /// Gets or sets the task status.
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
        /// Gets or sets the completion timestamp when present.
        /// </summary>
        public DateTime? CompletedAt { get; set; }

        /// <summary>
        /// Gets or sets whether the task is overdue.
        /// </summary>
        public bool IsOverdue { get; set; }

        /// <summary>
        /// Gets or sets whether the task includes applied AI personalisation.
        /// </summary>
        public bool IsPersonalised { get; set; }

        /// <summary>
        /// Gets or sets the personalisation timestamp when present.
        /// </summary>
        public DateTime? PersonalisedAt { get; set; }

        /// <summary>
        /// Gets or sets whether the current enrolee may acknowledge this task.
        /// </summary>
        public bool CanAcknowledge { get; set; }

        /// <summary>
        /// Gets or sets whether the current enrolee may complete this task.
        /// </summary>
        public bool CanComplete { get; set; }
    }
}
