using System;
using System.Collections.Generic;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Returns one facilitator-reviewable personalisation proposal for a journey.
    /// </summary>
    public class JourneyPersonalisationProposalDto
    {
        /// <summary>
        /// Gets or sets the audit log id for the AI run.
        /// </summary>
        public Guid GenerationLogId { get; set; }

        /// <summary>
        /// Gets or sets the hire id.
        /// </summary>
        public Guid HireId { get; set; }

        /// <summary>
        /// Gets or sets the journey id.
        /// </summary>
        public Guid JourneyId { get; set; }

        /// <summary>
        /// Gets or sets the Groq model name.
        /// </summary>
        public string ModelName { get; set; }

        /// <summary>
        /// Gets or sets the request timestamp.
        /// </summary>
        public DateTime RequestedAt { get; set; }

        /// <summary>
        /// Gets or sets the facilitator-facing summary of the proposal.
        /// </summary>
        public string Summary { get; set; }

        /// <summary>
        /// Gets or sets the number of revised tasks proposed by the AI response.
        /// </summary>
        public int RevisedTaskCount { get; set; }

        /// <summary>
        /// Gets or sets the diff-ready per-task revisions.
        /// </summary>
        public IReadOnlyList<JourneyTaskPersonalisationDiffDto> Diffs { get; set; }
    }
}
