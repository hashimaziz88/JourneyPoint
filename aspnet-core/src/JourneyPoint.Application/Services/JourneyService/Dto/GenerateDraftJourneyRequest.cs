using System;
using System.ComponentModel.DataAnnotations;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Captures the hire id required to generate one draft journey.
    /// </summary>
    public class GenerateDraftJourneyRequest
    {
        /// <summary>
        /// Gets or sets the hire id that should receive the generated draft journey.
        /// </summary>
        [Required]
        public Guid HireId { get; set; }
    }
}
