using System;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Returns one reviewable journey task snapshot.
    /// </summary>
    public class JourneyTaskReviewDto
    {
        /// <summary>
        /// Gets or sets the journey task id.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the optional source onboarding task id.
        /// </summary>
        public Guid? SourceOnboardingTaskId { get; set; }

        /// <summary>
        /// Gets or sets the optional source onboarding module id.
        /// </summary>
        public Guid? SourceOnboardingModuleId { get; set; }

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
        /// Gets or sets the copied or facilitator-edited task title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the copied or facilitator-edited task description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the task category snapshot.
        /// </summary>
        public OnboardingTaskCategory Category { get; set; }

        /// <summary>
        /// Gets or sets the assignment target snapshot.
        /// </summary>
        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        /// <summary>
        /// Gets or sets the acknowledgement rule snapshot.
        /// </summary>
        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }

        /// <summary>
        /// Gets or sets the copied due-day offset snapshot.
        /// </summary>
        public int DueDayOffset { get; set; }

        /// <summary>
        /// Gets or sets the computed due date.
        /// </summary>
        public DateTime DueOn { get; set; }

        /// <summary>
        /// Gets or sets the current task status.
        /// </summary>
        public JourneyTaskStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the acknowledgement timestamp when applicable.
        /// </summary>
        public DateTime? AcknowledgedAt { get; set; }

        /// <summary>
        /// Gets or sets the completion timestamp when applicable.
        /// </summary>
        public DateTime? CompletedAt { get; set; }

        /// <summary>
        /// Gets or sets the user id that completed the task when applicable.
        /// </summary>
        public long? CompletedByUserId { get; set; }
    }
}
