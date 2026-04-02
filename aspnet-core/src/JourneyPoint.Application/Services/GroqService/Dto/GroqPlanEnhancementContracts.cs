using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace JourneyPoint.Application.Services.GroqService.Dto
{
    /// <summary>
    /// Raw Groq response for plan module and task enhancement.
    /// </summary>
    internal class GroqPlanEnhancementResponse
    {
        [JsonPropertyName("modules")]
        public List<GroqEnhancedModulePayload> Modules { get; set; } = new();
    }

    internal class GroqEnhancedModulePayload
    {
        [JsonPropertyName("moduleId")]
        public string ModuleId { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("tasks")]
        public List<GroqEnhancedTaskPayload> Tasks { get; set; } = new();
    }

    internal class GroqEnhancedTaskPayload
    {
        [JsonPropertyName("taskId")]
        public string TaskId { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }
    }

    /// <summary>
    /// Carries the AI-enhanced plan content back to the caller for facilitator review.
    /// </summary>
    public class GroqPlanEnhancementResult
    {
        /// <summary>Gets or sets the generation log id created for audit purposes.</summary>
        public Guid GenerationLogId { get; set; }

        /// <summary>Gets or sets the model name used.</summary>
        public string ModelName { get; set; }

        /// <summary>Gets or sets the enhanced module proposals keyed by module id.</summary>
        public List<EnhancedModuleProposal> Modules { get; set; } = new();
    }

    /// <summary>
    /// One AI-enhanced module name and description with its enhanced tasks.
    /// </summary>
    public class EnhancedModuleProposal
    {
        /// <summary>Gets or sets the module identifier to match back to the draft.</summary>
        public Guid ModuleId { get; set; }

        /// <summary>Gets or sets the AI-enhanced module name.</summary>
        public string Name { get; set; }

        /// <summary>Gets or sets the AI-enhanced module description.</summary>
        public string Description { get; set; }

        /// <summary>Gets or sets the enhanced task proposals for this module.</summary>
        public List<EnhancedTaskProposal> Tasks { get; set; } = new();
    }

    /// <summary>
    /// One AI-enhanced task title and description.
    /// </summary>
    public class EnhancedTaskProposal
    {
        /// <summary>Gets or sets the task identifier to match back to the draft.</summary>
        public Guid TaskId { get; set; }

        /// <summary>Gets or sets the AI-enhanced task title.</summary>
        public string Title { get; set; }

        /// <summary>Gets or sets the AI-enhanced task description.</summary>
        public string Description { get; set; }
    }
}
