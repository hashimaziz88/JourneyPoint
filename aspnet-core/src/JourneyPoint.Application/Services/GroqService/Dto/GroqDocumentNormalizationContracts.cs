using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace JourneyPoint.Application.Services.GroqService.Dto
{
    internal sealed class GroqChatCompletionResponse
    {
        [JsonPropertyName("choices")]
        public List<GroqChoice> Choices { get; set; }
    }

    internal sealed class GroqChoice
    {
        [JsonPropertyName("message")]
        public GroqMessage Message { get; set; }
    }

    internal sealed class GroqMessage
    {
        [JsonPropertyName("content")]
        public string Content { get; set; }
    }

    internal sealed class GroqImportResponse
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("targetAudience")]
        public string TargetAudience { get; set; }

        [JsonPropertyName("durationDays")]
        public int DurationDays { get; set; }

        [JsonPropertyName("modules")]
        public List<GroqImportModule> Modules { get; set; }

        [JsonPropertyName("warnings")]
        public List<JsonElement> Warnings { get; set; }
    }

    internal sealed class GroqImportModule
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("orderIndex")]
        public int OrderIndex { get; set; }

        [JsonPropertyName("tasks")]
        public List<GroqImportTask> Tasks { get; set; }
    }

    internal sealed class GroqImportTask
    {
        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("category")]
        public string Category { get; set; }

        [JsonPropertyName("orderIndex")]
        public int OrderIndex { get; set; }

        [JsonPropertyName("dueDayOffset")]
        public int DueDayOffset { get; set; }

        [JsonPropertyName("assignmentTarget")]
        public string AssignmentTarget { get; set; }

        [JsonPropertyName("acknowledgementRule")]
        public string AcknowledgementRule { get; set; }
    }

    internal sealed class GroqProposalResponse
    {
        [JsonPropertyName("proposals")]
        public List<GroqProposal> Proposals { get; set; }
    }

    internal sealed class GroqProposal
    {
        [JsonPropertyName("suggestedModuleName")]
        public string SuggestedModuleName { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("category")]
        public string Category { get; set; }

        [JsonPropertyName("dueDayOffset")]
        public int DueDayOffset { get; set; }

        [JsonPropertyName("assignmentTarget")]
        public string AssignmentTarget { get; set; }

        [JsonPropertyName("acknowledgementRule")]
        public string AcknowledgementRule { get; set; }
    }
}
