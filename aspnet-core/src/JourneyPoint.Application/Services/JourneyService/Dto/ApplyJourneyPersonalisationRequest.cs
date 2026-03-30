using System;
using System.Collections.Generic;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Applies selected personalisation revisions to one journey.
    /// </summary>
    public class ApplyJourneyPersonalisationRequest
    {
        /// <summary>
        /// Gets or sets the audit log id for the reviewed AI run.
        /// </summary>
        public Guid GenerationLogId { get; set; }

        /// <summary>
        /// Gets or sets the journey receiving the selected revisions.
        /// </summary>
        public Guid JourneyId { get; set; }

        /// <summary>
        /// Gets or sets the selected per-task revisions to apply.
        /// </summary>
        public IReadOnlyList<ApplyJourneyPersonalisationSelectionDto> Selections { get; set; }
    }
}
