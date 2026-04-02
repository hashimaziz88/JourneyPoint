using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace JourneyPoint.Application.Services.GroqService.Dto
{
    /// <summary>
    /// Represents the raw Groq response for wellness question generation.
    /// </summary>
    internal class GroqWellnessQuestionsResponse
    {
        [JsonPropertyName("questions")]
        public List<string> Questions { get; set; } = new();
    }

    /// <summary>
    /// Represents the raw Groq response for a wellness answer suggestion.
    /// </summary>
    internal class GroqWellnessAnswerSuggestionResponse
    {
        [JsonPropertyName("suggestedAnswer")]
        public string SuggestedAnswer { get; set; }
    }

    /// <summary>
    /// Carries the generated wellness questions back to the caller.
    /// </summary>
    public class GroqWellnessQuestionsResult
    {
        /// <summary>Gets or sets the generation log id created for audit purposes.</summary>
        public System.Guid GenerationLogId { get; set; }

        /// <summary>Gets or sets the model name used for generation.</summary>
        public string ModelName { get; set; }

        /// <summary>Gets or sets the ordered list of generated question texts (max 5).</summary>
        public List<string> Questions { get; set; } = new();
    }

    /// <summary>
    /// Carries the AI-suggested answer back to the caller.
    /// </summary>
    public class GroqWellnessAnswerSuggestionResult
    {
        /// <summary>Gets or sets the generation log id created for audit purposes.</summary>
        public System.Guid GenerationLogId { get; set; }

        /// <summary>Gets or sets the suggested answer text.</summary>
        public string SuggestedAnswer { get; set; }
    }
}
