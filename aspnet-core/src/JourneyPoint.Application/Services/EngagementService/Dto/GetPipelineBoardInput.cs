using Abp.Application.Services.Dto;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Engagement.Enums;

namespace JourneyPoint.Application.Services.EngagementService.Dto
{
    /// <summary>
    /// Captures optional facilitator pipeline filters.
    /// </summary>
    public class GetPipelineBoardInput : PagedAndSortedResultRequestDto
    {
        /// <summary>
        /// Gets or sets the optional free-text filter for hire identity fields.
        /// </summary>
        public string Keyword { get; set; }

        /// <summary>
        /// Gets or sets the optional engagement classification filter.
        /// </summary>
        public EngagementClassification? Classification { get; set; }
    }
}
