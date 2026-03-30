using System;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Requests AI personalisation for one existing journey.
    /// </summary>
    public class RequestJourneyPersonalisationRequest
    {
        /// <summary>
        /// Gets or sets the journey to personalise.
        /// </summary>
        public Guid JourneyId { get; set; }

        /// <summary>
        /// Gets or sets optional facilitator instructions for the request.
        /// </summary>
        public string FacilitatorInstructions { get; set; }
    }
}
