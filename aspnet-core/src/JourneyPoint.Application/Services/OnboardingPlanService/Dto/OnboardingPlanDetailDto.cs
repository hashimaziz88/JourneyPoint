using System;
using System.Collections.Generic;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingPlanService.Dto
{
    /// <summary>
    /// Represents the full onboarding plan payload for the plan builder UI.
    /// </summary>
    public class OnboardingPlanDetailDto
    {
        public OnboardingPlanDetailDto()
        {
            Modules = new List<OnboardingModuleDto>();
        }

        /// <summary>
        /// Gets or sets the onboarding plan identifier.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the onboarding plan name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the onboarding plan description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the intended onboarding audience.
        /// </summary>
        public string TargetAudience { get; set; }

        /// <summary>
        /// Gets or sets the duration in days.
        /// </summary>
        public int DurationDays { get; set; }

        /// <summary>
        /// Gets or sets the current lifecycle state.
        /// </summary>
        public OnboardingPlanStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the ordered module collection.
        /// </summary>
        public List<OnboardingModuleDto> Modules { get; set; }
    }
}
