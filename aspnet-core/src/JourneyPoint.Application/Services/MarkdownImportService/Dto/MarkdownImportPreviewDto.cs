using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.MarkdownImportService.Dto
{
    /// <summary>
    /// Represents the full markdown import preview returned to facilitators.
    /// </summary>
    public class MarkdownImportPreviewDto
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MarkdownImportPreviewDto"/> class.
        /// </summary>
        public MarkdownImportPreviewDto()
        {
            Modules = new List<MarkdownImportPreviewModuleDto>();
            Warnings = new List<MarkdownImportWarningDto>();
        }

        /// <summary>
        /// Gets or sets the parsed plan name.
        /// </summary>
        [Required]
        [MaxLength(OnboardingPlan.MaxNameLength)]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the parsed plan description.
        /// </summary>
        [Required]
        [MaxLength(OnboardingPlan.MaxDescriptionLength)]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the parsed target audience.
        /// </summary>
        [Required]
        [MaxLength(OnboardingPlan.MaxTargetAudienceLength)]
        public string TargetAudience { get; set; }

        /// <summary>
        /// Gets or sets the parsed duration in days.
        /// </summary>
        [Range(OnboardingPlan.MinDurationDays, int.MaxValue)]
        public int DurationDays { get; set; }

        /// <summary>
        /// Gets or sets the ordered parsed modules.
        /// </summary>
        public List<MarkdownImportPreviewModuleDto> Modules { get; set; }

        /// <summary>
        /// Gets or sets the parser warnings that require facilitator review.
        /// </summary>
        public List<MarkdownImportWarningDto> Warnings { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the preview has enough structure to save as a draft.
        /// </summary>
        public bool CanSave { get; set; }
    }
}
