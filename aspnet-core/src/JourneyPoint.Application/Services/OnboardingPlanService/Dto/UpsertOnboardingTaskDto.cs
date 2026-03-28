using System;
using System.ComponentModel.DataAnnotations;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingPlanService.Dto
{
    /// <summary>
    /// Defines task input used during onboarding plan create and update operations.
    /// </summary>
    public class UpsertOnboardingTaskDto
    {
        /// <summary>
        /// Gets or sets the optional task identifier for existing draft tasks.
        /// </summary>
        public Guid? Id { get; set; }

        /// <summary>
        /// Gets or sets the task title.
        /// </summary>
        [Required]
        [MaxLength(OnboardingTask.MaxTitleLength)]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the task description.
        /// </summary>
        [Required]
        [MaxLength(OnboardingTask.MaxDescriptionLength)]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the task category.
        /// </summary>
        public OnboardingTaskCategory Category { get; set; }

        /// <summary>
        /// Gets or sets the module-local order index.
        /// </summary>
        [Range(OnboardingTask.MinOrderIndex, int.MaxValue)]
        public int OrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the due day offset.
        /// </summary>
        [Range(OnboardingTask.MinDueDayOffset, int.MaxValue)]
        public int DueDayOffset { get; set; }

        /// <summary>
        /// Gets or sets the assignment target.
        /// </summary>
        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        /// <summary>
        /// Gets or sets the acknowledgement rule.
        /// </summary>
        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }
    }
}
