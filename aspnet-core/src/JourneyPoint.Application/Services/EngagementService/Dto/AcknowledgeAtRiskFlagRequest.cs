using System;
using System.ComponentModel.DataAnnotations;

namespace JourneyPoint.Application.Services.EngagementService.Dto
{
    /// <summary>
    /// Captures facilitator acknowledgement of an active at-risk flag.
    /// </summary>
    public class AcknowledgeAtRiskFlagRequest
    {
        [Required]
        public Guid FlagId { get; set; }

        public string AcknowledgementNotes { get; set; }
    }
}
