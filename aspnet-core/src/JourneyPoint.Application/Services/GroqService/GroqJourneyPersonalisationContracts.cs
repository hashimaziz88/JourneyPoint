using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.GroqService
{
    /// <summary>
    /// Represents one successful Groq journey personalisation result.
    /// </summary>
    public class GroqJourneyPersonalisationResult
    {
        /// <summary>
        /// Gets or sets the audit record identifier for the AI run.
        /// </summary>
        public Guid GenerationLogId { get; set; }

        /// <summary>
        /// Gets or sets the Groq model name used for the run.
        /// </summary>
        public string ModelName { get; set; }

        /// <summary>
        /// Gets or sets the request timestamp.
        /// </summary>
        public DateTime RequestedAt { get; set; }

        /// <summary>
        /// Gets or sets the safe proposal summary.
        /// </summary>
        public string Summary { get; set; }

        /// <summary>
        /// Gets or sets the diff-ready proposed revisions.
        /// </summary>
        public IReadOnlyList<GroqJourneyTaskPersonalisationRevision> Revisions { get; set; }
    }

    /// <summary>
    /// Represents one proposed revision for one existing journey task.
    /// </summary>
    public class GroqJourneyTaskPersonalisationRevision
    {
        /// <summary>
        /// Gets or sets the target journey task id.
        /// </summary>
        public Guid JourneyTaskId { get; set; }

        /// <summary>
        /// Gets or sets the proposed title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the proposed description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the proposed task category.
        /// </summary>
        public OnboardingTaskCategory Category { get; set; }

        /// <summary>
        /// Gets or sets the proposed assignment target.
        /// </summary>
        public OnboardingTaskAssignmentTarget AssignmentTarget { get; set; }

        /// <summary>
        /// Gets or sets the proposed acknowledgement rule.
        /// </summary>
        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; set; }

        /// <summary>
        /// Gets or sets the proposed due-day offset.
        /// </summary>
        public int DueDayOffset { get; set; }

        /// <summary>
        /// Gets or sets the model rationale for the revision.
        /// </summary>
        public string Rationale { get; set; }
    }

    internal sealed class GroqJourneyPersonalisationResponse
    {
        [JsonPropertyName("summary")]
        public string Summary { get; set; }

        [JsonPropertyName("revisions")]
        public List<GroqJourneyPersonalisationRevisionResponse> Revisions { get; set; }
    }

    internal sealed class GroqJourneyPersonalisationRevisionResponse
    {
        [JsonPropertyName("journeyTaskId")]
        public string JourneyTaskId { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("category")]
        public string Category { get; set; }

        [JsonPropertyName("assignmentTarget")]
        public string AssignmentTarget { get; set; }

        [JsonPropertyName("acknowledgementRule")]
        public string AcknowledgementRule { get; set; }

        [JsonPropertyName("dueDayOffset")]
        public int DueDayOffset { get; set; }

        [JsonPropertyName("rationale")]
        public string Rationale { get; set; }
    }
}
