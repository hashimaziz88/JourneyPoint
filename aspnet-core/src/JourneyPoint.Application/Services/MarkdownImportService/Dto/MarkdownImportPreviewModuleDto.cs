using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.MarkdownImportService.Dto
{
    /// <summary>
    /// Represents one parsed onboarding module in a markdown import preview.
    /// </summary>
    public class MarkdownImportPreviewModuleDto
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MarkdownImportPreviewModuleDto"/> class.
        /// </summary>
        public MarkdownImportPreviewModuleDto()
        {
            Tasks = new List<MarkdownImportPreviewTaskDto>();
        }

        /// <summary>
        /// Gets or sets the module name.
        /// </summary>
        [Required]
        [MaxLength(OnboardingModule.MaxNameLength)]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the module description.
        /// </summary>
        [Required]
        [MaxLength(OnboardingModule.MaxDescriptionLength)]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the plan-local module order index.
        /// </summary>
        [Range(OnboardingModule.MinOrderIndex, int.MaxValue)]
        public int OrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the ordered tasks parsed inside the module.
        /// </summary>
        public List<MarkdownImportPreviewTaskDto> Tasks { get; set; }
    }
}
