using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.MarkdownImportService.Dto
{
    /// <summary>
    /// Defines the facilitator-approved markdown import payload used to create a draft plan.
    /// </summary>
    public class SaveMarkdownImportRequest
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SaveMarkdownImportRequest"/> class.
        /// </summary>
        public SaveMarkdownImportRequest()
        {
            Modules = new List<MarkdownImportPreviewModuleDto>();
        }

        /// <summary>
        /// Gets or sets the draft plan name.
        /// </summary>
        [Required]
        [MaxLength(OnboardingPlan.MaxNameLength)]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the draft plan description.
        /// </summary>
        [Required]
        [MaxLength(OnboardingPlan.MaxDescriptionLength)]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the target audience for the imported draft.
        /// </summary>
        [Required]
        [MaxLength(OnboardingPlan.MaxTargetAudienceLength)]
        public string TargetAudience { get; set; }

        /// <summary>
        /// Gets or sets the imported draft duration in days.
        /// </summary>
        [Range(OnboardingPlan.MinDurationDays, int.MaxValue)]
        public int DurationDays { get; set; }

        /// <summary>
        /// Gets or sets the ordered module collection approved by the facilitator.
        /// </summary>
        public List<MarkdownImportPreviewModuleDto> Modules { get; set; }
    }
}
