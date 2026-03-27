using System;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingPlanService.Dto
{
    /// <summary>
    /// Represents one ordered template task in the onboarding plan builder contract.
    /// </summary>
    public class OnboardingTaskDto
    {
        /// <summary>
        /// Gets or sets the template task identifier.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the task title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the task description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the task category.
        /// </summary>
        public OnboardingTaskCategory Category { get; set; }

        /// <summary>
        /// Gets or sets the module-local order index.
        /// </summary>
        public int OrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the due day offset from the hire start date.
        /// </summary>
        public int DueDayOffset { get; set; }

        /// <summary>
        /// Gets or sets the target actor responsible for the task.
        /// </summary>
        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        /// <summary>
        /// Gets or sets the acknowledgement rule for the task.
        /// </summary>
        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }
    }
}
