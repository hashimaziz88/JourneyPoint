using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Abp.Dependency;
using JourneyPoint.Application.Services.AuditService;
using JourneyPoint.Application.Services.DocumentExtractionService;
using JourneyPoint.Application.Services.DocumentExtractionService.Dto;
using JourneyPoint.Application.Services.GroqService.Dto;
using JourneyPoint.Application.Services.GroqService.Helpers;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Configuration;
using Microsoft.Extensions.Options;

namespace JourneyPoint.Application.Services.GroqService
{
    /// <summary>
    /// Uses backend-only Groq calls to normalize onboarding source material into DTO-shaped previews and proposals.
    /// </summary>
    public partial class GroqDocumentNormalizationService : IGroqDocumentNormalizationService, ITransientDependency
    {
        private static readonly JsonSerializerOptions SerializerOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        private readonly GroqOptions _groqOptions;
        private readonly IAiAuditLogService _aiAuditLogService;

        /// <summary>
        /// Initializes a new instance of the <see cref="GroqDocumentNormalizationService"/> class.
        /// </summary>
        public GroqDocumentNormalizationService(
            IOptions<GroqOptions> groqOptions,
            IAiAuditLogService aiAuditLogService)
        {
            _groqOptions = groqOptions?.Value ?? throw new ArgumentNullException(nameof(groqOptions));
            _aiAuditLogService = aiAuditLogService ?? throw new ArgumentNullException(nameof(aiAuditLogService));
        }

        /// <summary>
        /// Gets a value indicating whether backend Groq normalization is currently configured and enabled.
        /// </summary>
        public bool IsEnabled =>
            _groqOptions.Enabled &&
            !string.IsNullOrWhiteSpace(_groqOptions.ApiKey) &&
            _groqOptions.GetBaseUri() != null &&
            !string.IsNullOrWhiteSpace(_groqOptions.Model);

        /// <summary>
        /// Normalizes raw text content into a reviewable onboarding plan preview.
        /// </summary>
        public async Task<MarkdownImportPreviewDto> NormalizeImportFromTextAsync(
            string sourceFileName,
            string contentType,
            string rawText)
        {
            EnsureEnabled();

            var prompt = GroqDocumentNormalizationPromptFactory.BuildImportPrompt(sourceFileName, contentType);
            var responseText = await RequestJsonAsync(
                _groqOptions.Model,
                BuildTextMessages(prompt, rawText));
            var payload = DeserializeRequired<GroqImportResponse>(responseText);
            return GroqDocumentNormalizationMapper.MapImportPreview(payload, sourceFileName);
        }

        /// <summary>
        /// Normalizes extracted image content into a reviewable onboarding plan preview.
        /// </summary>
        public async Task<MarkdownImportPreviewDto> NormalizeImportFromImagesAsync(
            string sourceFileName,
            string contentType,
            IReadOnlyCollection<DocumentImageContent> images)
        {
            EnsureEnabled();

            var prompt = GroqDocumentNormalizationPromptFactory.BuildImportPrompt(sourceFileName, contentType);
            var responseText = await RequestJsonAsync(
                ResolveVisionModel(),
                BuildImageMessages(prompt, images));
            var payload = DeserializeRequired<GroqImportResponse>(responseText);
            return GroqDocumentNormalizationMapper.MapImportPreview(payload, sourceFileName);
        }

        private void EnsureEnabled()
        {
            if (!IsEnabled)
            {
                throw new InvalidOperationException("Groq document normalization is not configured.");
            }
        }

        private string ResolveVisionModel()
        {
            return string.IsNullOrWhiteSpace(_groqOptions.VisionModel)
                ? _groqOptions.Model
                : _groqOptions.VisionModel;
        }

        private async Task<string> RequestJsonAsync(string model, IEnumerable<object> messages)
        {
            using var httpClient = new HttpClient
            {
                BaseAddress = _groqOptions.GetBaseUri(),
                Timeout = TimeSpan.FromSeconds(_groqOptions.TimeoutSeconds)
            };
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _groqOptions.ApiKey);

            var requestPayload = new
            {
                model,
                temperature = 0.1,
                response_format = new
                {
                    type = "json_object"
                },
                messages
            };

            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "chat/completions")
            {
                Content = new StringContent(
                    JsonSerializer.Serialize(requestPayload, SerializerOptions),
                    Encoding.UTF8,
                    "application/json")
            };

            using var response = await httpClient.SendAsync(requestMessage);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException(
                    $"Groq normalization failed with status {(int)response.StatusCode}: {responseBody}");
            }

            var completion = DeserializeRequired<GroqChatCompletionResponse>(responseBody);
            var content = completion.Choices?.FirstOrDefault()?.Message?.Content;
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new InvalidOperationException("Groq returned an empty normalization response.");
            }

            return content;
        }

        private static IEnumerable<object> BuildTextMessages(string systemPrompt, string rawText)
        {
            return new object[]
            {
                new
                {
                    role = "system",
                    content = systemPrompt
                },
                new
                {
                    role = "user",
                    content = rawText
                }
            };
        }

        private static IEnumerable<object> BuildImageMessages(
            string systemPrompt,
            IReadOnlyCollection<DocumentImageContent> images)
        {
            var contentItems = new List<object>
            {
                new
                {
                    type = "text",
                    text = systemPrompt
                }
            };

            foreach (var image in images)
            {
                contentItems.Add(new
                {
                    type = "image_url",
                    image_url = new
                    {
                        url = $"data:{image.MimeType};base64,{image.Base64Content}"
                    }
                });
            }

            return new object[]
            {
                new
                {
                    role = "user",
                    content = contentItems
                }
            };
        }

        private static T DeserializeRequired<T>(string json)
        {
            var value = JsonSerializer.Deserialize<T>(json, SerializerOptions);
            if (value == null)
            {
                throw new InvalidOperationException("Groq returned an unreadable JSON payload.");
            }

            return value;
        }
    }
}
