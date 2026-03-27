using Abp.Application.Services.Dto;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingPlanService.Dto
{
    /// <summary>
    /// Defines filtering and paging for onboarding plan list queries.
    /// </summary>
    public class GetOnboardingPlansInput : PagedAndSortedResultRequestDto
    {
        /// <summary>
        /// Gets or sets an optional keyword matched against plan name or target audience.
        /// </summary>
        public string Keyword { get; set; }

        /// <summary>
        /// Gets or sets an optional lifecycle filter.
        /// </summary>
        public OnboardingPlanStatus? Status { get; set; }
    }
}
