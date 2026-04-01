using Abp.Application.Services.Dto;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;

namespace JourneyPoint.Application.Services.HireService.Dto
{
    /// <summary>
    /// Captures facilitator hire-list query filters.
    /// </summary>
    public class GetHiresInput : PagedAndSortedResultRequestDto
    {
        /// <summary>
        /// Gets or sets the optional free-text filter for hire identity and plan metadata.
        /// </summary>
        public string Keyword { get; set; }

        /// <summary>
        /// Gets or sets the optional lifecycle-state filter.
        /// </summary>
        public HireLifecycleState? Status { get; set; }
    }
}
