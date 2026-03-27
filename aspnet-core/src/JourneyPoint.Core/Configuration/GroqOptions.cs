using System;

namespace JourneyPoint.Configuration
{
    /// <summary>
    /// Defines configurable settings for backend Groq integration.
    /// </summary>
    public class GroqOptions
    {
        public bool Enabled { get; set; }

        public string ApiKey { get; set; }

        public string BaseUrl { get; set; } = "https://api.groq.com/openai/v1";

        public string Model { get; set; } = "llama-3.3-70b-versatile";

        public int TimeoutSeconds { get; set; } = 60;

        /// <summary>
        /// Resolves the configured Groq base URL into an absolute URI.
        /// </summary>
        public Uri GetBaseUri()
        {
            return string.IsNullOrWhiteSpace(BaseUrl) ? null : new Uri(BaseUrl, UriKind.Absolute);
        }
    }
}
