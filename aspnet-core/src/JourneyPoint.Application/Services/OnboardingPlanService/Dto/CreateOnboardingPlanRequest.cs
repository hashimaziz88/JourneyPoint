using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingPlanService.Dto
{
    /// <summary>
    /// Defines the input required to create a draft onboarding plan.
    /// </summary>
    public class CreateOnboardingPlanRequest
    {
        public CreateOnboardingPlanRequest()
        {
            Modules = new List<UpsertOnboardingModuleDto>();
        }

        /// <summary>
        /// Gets or sets the onboarding plan name.
        /// </summary>
        [Required]
        [MaxLength(OnboardingPlan.MaxNameLength)]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the onboarding plan description.
        /// </summary>
        [Required]
        [MaxLength(OnboardingPlan.MaxDescriptionLength)]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the target audience.
        /// </summary>
        [Required]
        [MaxLength(OnboardingPlan.MaxTargetAudienceLength)]
        public string TargetAudience { get; set; }

        /// <summary>
        /// Gets or sets the duration in days.
        /// </summary>
        [Range(OnboardingPlan.MinDurationDays, int.MaxValue)]
        public int DurationDays { get; set; }

        /// <summary>
        /// Gets or sets the ordered module collection to create with the plan.
        /// </summary>
        public List<UpsertOnboardingModuleDto> Modules { get; set; }
    }
}
