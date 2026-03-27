using System;
using System.ComponentModel.DataAnnotations;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingPlanService.Dto
{
    /// <summary>
    /// Defines the input used to clone an onboarding plan into a new draft.
    /// </summary>
    public class CloneOnboardingPlanRequest
    {
        /// <summary>
        /// Gets or sets the source onboarding plan identifier.
        /// </summary>
        public Guid SourcePlanId { get; set; }

        /// <summary>
        /// Gets or sets an optional override for the cloned plan name.
        /// </summary>
        [MaxLength(OnboardingPlan.MaxNameLength)]
        public string Name { get; set; }
    }
}
