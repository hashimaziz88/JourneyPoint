using System;
using System.ComponentModel.DataAnnotations;
using JourneyPoint.Domains.Engagement;

namespace JourneyPoint.Application.Services.EngagementService.Dto
{
    /// <summary>
    /// Captures facilitator resolution of an unresolved at-risk flag.
    /// </summary>
    public class ResolveAtRiskFlagRequest
    {
        [Required]
        public Guid FlagId { get; set; }

        [Required]
        public AtRiskResolutionType ResolutionType { get; set; }

        public string ResolutionNotes { get; set; }
    }
}
