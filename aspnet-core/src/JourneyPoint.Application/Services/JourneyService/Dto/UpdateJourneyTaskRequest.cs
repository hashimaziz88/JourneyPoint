using System.ComponentModel.DataAnnotations;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Captures facilitator draft-review edits for an existing journey task snapshot.
    /// </summary>
    public class UpdateJourneyTaskRequest
    {
        /// <summary>
        /// Gets or sets the edited module title snapshot.
        /// </summary>
        [Required]
        [MaxLength(JourneyTask.MaxModuleTitleLength)]
        public string ModuleTitle { get; set; }

        /// <summary>
        /// Gets or sets the edited module order index.
        /// </summary>
        [Range(JourneyTask.MinModuleOrderIndex, int.MaxValue)]
        public int ModuleOrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the edited task order index.
        /// </summary>
        [Range(JourneyTask.MinTaskOrderIndex, int.MaxValue)]
        public int TaskOrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the edited task title.
        /// </summary>
        [Required]
        [MaxLength(JourneyTask.MaxTitleLength)]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the edited task description.
        /// </summary>
        [Required]
        [MaxLength(JourneyTask.MaxDescriptionLength)]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the edited task category.
        /// </summary>
        public OnboardingTaskCategory Category { get; set; }

        /// <summary>
        /// Gets or sets the edited assignment target.
        /// </summary>
        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        /// <summary>
        /// Gets or sets the edited acknowledgement rule.
        /// </summary>
        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }

        /// <summary>
        /// Gets or sets the edited due-day offset.
        /// </summary>
        [Range(JourneyTask.MinDueDayOffset, int.MaxValue)]
        public int DueDayOffset { get; set; }
    }
}
