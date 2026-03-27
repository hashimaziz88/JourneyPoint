using System;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingPlanService.Dto
{
    /// <summary>
    /// Represents a lightweight onboarding plan record for list views.
    /// </summary>
    public class OnboardingPlanListItemDto
    {
        /// <summary>
        /// Gets or sets the onboarding plan identifier.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the onboarding plan name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the intended onboarding audience.
        /// </summary>
        public string TargetAudience { get; set; }

        /// <summary>
        /// Gets or sets the onboarding duration in days.
        /// </summary>
        public int DurationDays { get; set; }

        /// <summary>
        /// Gets or sets the current lifecycle state.
        /// </summary>
        public OnboardingPlanStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the number of modules in the plan.
        /// </summary>
        public int ModuleCount { get; set; }

        /// <summary>
        /// Gets or sets the number of template tasks in the plan.
        /// </summary>
        public int TaskCount { get; set; }

        /// <summary>
        /// Gets or sets the most recent edit timestamp or creation time if never edited.
        /// </summary>
        public DateTime LastUpdatedTime { get; set; }
    }
}
