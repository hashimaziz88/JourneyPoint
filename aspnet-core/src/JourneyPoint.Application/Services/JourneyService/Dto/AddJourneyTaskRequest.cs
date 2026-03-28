using System.ComponentModel.DataAnnotations;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Captures facilitator-authored draft task input.
    /// </summary>
    public class AddJourneyTaskRequest
    {
        /// <summary>
        /// Gets or sets the module title snapshot for the new task.
        /// </summary>
        [Required]
        [MaxLength(JourneyTask.MaxModuleTitleLength)]
        public string ModuleTitle { get; set; }

        /// <summary>
        /// Gets or sets the module order index for the new task.
        /// </summary>
        [Range(JourneyTask.MinModuleOrderIndex, int.MaxValue)]
        public int ModuleOrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the task order index for the new task.
        /// </summary>
        [Range(JourneyTask.MinTaskOrderIndex, int.MaxValue)]
        public int TaskOrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the new task title.
        /// </summary>
        [Required]
        [MaxLength(JourneyTask.MaxTitleLength)]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the new task description.
        /// </summary>
        [Required]
        [MaxLength(JourneyTask.MaxDescriptionLength)]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the new task category.
        /// </summary>
        public OnboardingTaskCategory Category { get; set; }

        /// <summary>
        /// Gets or sets the assignment target for the new task.
        /// </summary>
        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        /// <summary>
        /// Gets or sets the acknowledgement rule for the new task.
        /// </summary>
        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }

        /// <summary>
        /// Gets or sets the due-day offset for the new task.
        /// </summary>
        [Range(JourneyTask.MinDueDayOffset, int.MaxValue)]
        public int DueDayOffset { get; set; }
    }
}
