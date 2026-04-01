using System.ComponentModel.DataAnnotations;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Application.Services.MarkdownImportService.Dto
{
    /// <summary>
    /// Represents one parsed template task in a markdown import preview.
    /// </summary>
    public class MarkdownImportPreviewTaskDto
    {
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
        /// Gets or sets the parsed task category.
        /// </summary>
        public OnboardingTaskCategory Category { get; set; }

        /// <summary>
        /// Gets or sets the module-local task order index.
        /// </summary>
        [Range(OnboardingTask.MinOrderIndex, int.MaxValue)]
        public int OrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the due-day offset.
        /// </summary>
        [Range(OnboardingTask.MinDueDayOffset, int.MaxValue)]
        public int DueDayOffset { get; set; }

        /// <summary>
        /// Gets or sets the assignment target for the task.
        /// </summary>
        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        /// <summary>
        /// Gets or sets the acknowledgement rule for the task.
        /// </summary>
        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }
    }
}
