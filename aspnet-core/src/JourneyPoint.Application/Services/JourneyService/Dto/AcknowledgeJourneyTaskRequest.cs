using System;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Requests acknowledgement for one participant journey task.
    /// </summary>
    public class AcknowledgeJourneyTaskRequest
    {
        /// <summary>
        /// Gets or sets the journey task id to acknowledge.
        /// </summary>
        public Guid JourneyTaskId { get; set; }
    }
}
