using System;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Requests completion for one participant journey task.
    /// </summary>
    public class CompleteJourneyTaskRequest
    {
        /// <summary>
        /// Gets or sets the journey task id to complete.
        /// </summary>
        public Guid JourneyTaskId { get; set; }
    }
}
