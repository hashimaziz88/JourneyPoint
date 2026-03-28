using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Abp.Dependency;
using JourneyPoint.Application.Services.DocumentExtractionService;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Application.Services.OnboardingDocumentService;
using JourneyPoint.Configuration;
using JourneyPoint.Domains.OnboardingPlans;
using Microsoft.Extensions.Options;

namespace JourneyPoint.Application.Services.GroqService
{
    /// <summary>
    /// Uses backend-only Groq calls to normalize onboarding source material into DTO-shaped previews and proposals.
    /// </summary>
    public class GroqDocumentNormalizationService : ITransientDependency
    {
        private static readonly JsonSerializerOptions SerializerOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        private readonly GroqOptions _groqOptions;

        /// <summary>
        /// Initializes a new instance of the <see cref="GroqDocumentNormalizationService"/> class.
        /// </summary>
        public GroqDocumentNormalizationService(IOptions<GroqOptions> groqOptions)
        {
            _groqOptions = groqOptions?.Value ?? throw new ArgumentNullException(nameof(groqOptions));
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

            var prompt = BuildImportPrompt(sourceFileName, contentType);
            var responseText = await RequestJsonAsync(
                _groqOptions.Model,
                BuildTextMessages(prompt, rawText));
            var payload = DeserializeRequired<GroqImportResponse>(responseText);
            return MapImportPreview(payload, sourceFileName);
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

            var prompt = BuildImportPrompt(sourceFileName, contentType);
            var responseText = await RequestJsonAsync(
                ResolveVisionModel(),
                BuildImageMessages(prompt, images));
            var payload = DeserializeRequired<GroqImportResponse>(responseText);
            return MapImportPreview(payload, sourceFileName);
        }

        /// <summary>
        /// Extracts reviewable plan-linked task proposals from raw text content.
        /// </summary>
        public async Task<IReadOnlyCollection<ExtractedTaskCandidate>> ExtractPlanProposalsFromTextAsync(
            OnboardingPlan plan,
            string sourceFileName,
            string contentType,
            string rawText)
        {
            EnsureEnabled();

            var prompt = BuildProposalPrompt(plan, sourceFileName, contentType);
            var responseText = await RequestJsonAsync(
                _groqOptions.Model,
                BuildTextMessages(prompt, rawText));
            var payload = DeserializeRequired<GroqProposalResponse>(responseText);
            return MapProposalCandidates(plan, payload);
        }

        /// <summary>
        /// Extracts reviewable plan-linked task proposals from image content.
        /// </summary>
        public async Task<IReadOnlyCollection<ExtractedTaskCandidate>> ExtractPlanProposalsFromImagesAsync(
            OnboardingPlan plan,
            string sourceFileName,
            string contentType,
            IReadOnlyCollection<DocumentImageContent> images)
        {
            EnsureEnabled();

            var prompt = BuildProposalPrompt(plan, sourceFileName, contentType);
            var responseText = await RequestJsonAsync(
                ResolveVisionModel(),
                BuildImageMessages(prompt, images));
            var payload = DeserializeRequired<GroqProposalResponse>(responseText);
            return MapProposalCandidates(plan, payload);
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

        private static string BuildImportPrompt(string sourceFileName, string contentType)
        {
            return
                "You convert onboarding source material into JSON only. " +
                $"Source file name: {sourceFileName ?? "unknown"}. " +
                $"Source content type: {contentType ?? "unknown"}. " +
                "Return one JSON object with keys name, description, targetAudience, durationDays, modules, warnings, canSave. " +
                "Each module must have name, description, orderIndex, tasks. " +
                "Each task must have title, description, category, orderIndex, dueDayOffset, assignmentTarget, acknowledgementRule. " +
                "Allowed category values: Orientation, Learning, Practice, Assessment, CheckIn. " +
                "Allowed assignmentTarget values: Enrolee, Manager, Facilitator. " +
                "Allowed acknowledgementRule values: NotRequired, Required. " +
                "Infer missing structure conservatively, preserve task order, and add warnings when you had to infer titles, descriptions, audience, duration, module boundaries, or due-day offsets. " +
                "If the document is insufficient to form a usable plan preview, still return your best attempt with warnings and canSave false. Do not wrap the JSON in markdown.";
        }

        private static string BuildProposalPrompt(
            OnboardingPlan plan,
            string sourceFileName,
            string contentType)
        {
            var moduleSummary = string.Join(
                ", ",
                plan.Modules
                    .OrderBy(module => module.OrderIndex)
                    .Select(module => $"{module.OrderIndex}:{module.Name}"));

            return
                "You extract onboarding task proposals into JSON only. " +
                $"Plan name: {plan.Name}. " +
                $"Target audience: {plan.TargetAudience}. " +
                $"Source file name: {sourceFileName ?? "unknown"}. " +
                $"Source content type: {contentType ?? "unknown"}. " +
                $"Existing modules in order: {moduleSummary}. " +
                "Return one JSON object with keys proposals and warnings. " +
                "Each proposal must have suggestedModuleName, title, description, category, dueDayOffset, assignmentTarget, acknowledgementRule. " +
                "Allowed category values: Orientation, Learning, Practice, Assessment, CheckIn. " +
                "Allowed assignmentTarget values: Enrolee, Manager, Facilitator. " +
                "Allowed acknowledgementRule values: NotRequired, Required. " +
                "Map each proposal to the closest existing module name when possible. " +
                "Only return actionable onboarding tasks, not general prose, headings, or policy boilerplate. " +
                "If there is weak evidence for a task, omit it and mention the ambiguity in warnings. Do not wrap the JSON in markdown.";
        }

        private static MarkdownImportPreviewDto MapImportPreview(
            GroqImportResponse payload,
            string sourceFileName)
        {
            var moduleInputs = payload.Modules ?? new List<GroqImportModule>();
            var warnings = (payload.Warnings ?? new List<JsonElement>())
                .Select(MapWarning)
                .ToList();

            var preview = new MarkdownImportPreviewDto
            {
                Name = NormalizeRequiredText(payload.Name, DerivePlanName(sourceFileName), OnboardingPlan.MaxNameLength),
                Description = NormalizeRequiredText(
                    payload.Description,
                    "Imported onboarding plan draft requiring facilitator review.",
                    OnboardingPlan.MaxDescriptionLength),
                TargetAudience = NormalizeRequiredText(
                    payload.TargetAudience,
                    "Imported hires",
                    OnboardingPlan.MaxTargetAudienceLength),
                DurationDays = payload.DurationDays > 0 ? payload.DurationDays : OnboardingPlan.MinDurationDays,
                Modules = moduleInputs
                    .Select((module, moduleIndex) => MapModule(module, moduleIndex))
                    .Where(module => module.Tasks.Count > 0)
                    .ToList(),
                Warnings = warnings
            };

            preview.CanSave = preview.Modules.Count > 0 &&
                              preview.Modules.All(module => !string.IsNullOrWhiteSpace(module.Name)) &&
                              preview.Modules.All(module => module.Tasks.Count > 0) &&
                              preview.Modules.All(module => module.Tasks.All(task => !string.IsNullOrWhiteSpace(task.Title)));
            return preview;
        }

        private static MarkdownImportPreviewModuleDto MapModule(GroqImportModule module, int moduleIndex)
        {
            var moduleName = NormalizeRequiredText(
                module.Name,
                $"Imported Module {moduleIndex + 1}",
                OnboardingModule.MaxNameLength);

            return new MarkdownImportPreviewModuleDto
            {
                Name = moduleName,
                Description = NormalizeRequiredText(
                    module.Description,
                    $"Tasks imported for {moduleName}.",
                    OnboardingModule.MaxDescriptionLength),
                OrderIndex = module.OrderIndex > 0 ? module.OrderIndex : moduleIndex + 1,
                Tasks = (module.Tasks ?? new List<GroqImportTask>())
                    .Select((task, taskIndex) => MapTask(task, taskIndex))
                    .ToList()
            };
        }

        private static MarkdownImportPreviewTaskDto MapTask(GroqImportTask task, int taskIndex)
        {
            var title = NormalizeRequiredText(
                task.Title,
                $"Imported Task {taskIndex + 1}",
                OnboardingTask.MaxTitleLength);

            return new MarkdownImportPreviewTaskDto
            {
                Title = title,
                Description = NormalizeRequiredText(
                    task.Description,
                    title,
                    OnboardingTask.MaxDescriptionLength),
                Category = ParseCategory(task.Category),
                OrderIndex = task.OrderIndex > 0 ? task.OrderIndex : taskIndex + 1,
                DueDayOffset = Math.Max(task.DueDayOffset, OnboardingTask.MinDueDayOffset),
                AssignmentTarget = ParseAssignmentTarget(task.AssignmentTarget),
                AcknowledgementRule = ParseAcknowledgementRule(task.AcknowledgementRule)
            };
        }

        private static IReadOnlyCollection<ExtractedTaskCandidate> MapProposalCandidates(
            OnboardingPlan plan,
            GroqProposalResponse payload)
        {
            return (payload.Proposals ?? new List<GroqProposal>())
                .Where(proposal => !string.IsNullOrWhiteSpace(proposal.Title))
                .Select(proposal => new ExtractedTaskCandidate
                {
                    SuggestedModuleId = ResolveModuleId(plan, proposal.SuggestedModuleName),
                    Title = NormalizeRequiredText(
                        proposal.Title,
                        "Imported Task",
                        OnboardingTask.MaxTitleLength),
                    Description = NormalizeRequiredText(
                        proposal.Description,
                        proposal.Title,
                        OnboardingTask.MaxDescriptionLength),
                    Category = ParseCategory(proposal.Category),
                    DueDayOffset = Math.Max(proposal.DueDayOffset, OnboardingTask.MinDueDayOffset),
                    AssignmentTarget = ParseAssignmentTarget(proposal.AssignmentTarget),
                    AcknowledgementRule = ParseAcknowledgementRule(proposal.AcknowledgementRule)
                })
                .ToList();
        }

        private static Guid? ResolveModuleId(OnboardingPlan plan, string moduleName)
        {
            if (!plan.Modules.Any())
            {
                return null;
            }

            if (string.IsNullOrWhiteSpace(moduleName))
            {
                return plan.Modules.OrderBy(module => module.OrderIndex).First().Id;
            }

            var normalizedModuleName = moduleName.Trim().ToLowerInvariant();
            var exactMatch = plan.Modules
                .OrderBy(module => module.OrderIndex)
                .FirstOrDefault(module => module.Name.Trim().ToLowerInvariant() == normalizedModuleName);

            if (exactMatch != null)
            {
                return exactMatch.Id;
            }

            var partialMatch = plan.Modules
                .OrderBy(module => module.OrderIndex)
                .FirstOrDefault(module =>
                {
                    var candidateName = module.Name.Trim().ToLowerInvariant();
                    return candidateName.Contains(normalizedModuleName, StringComparison.Ordinal) ||
                           normalizedModuleName.Contains(candidateName, StringComparison.Ordinal);
                });

            return partialMatch?.Id ?? plan.Modules.OrderBy(module => module.OrderIndex).First().Id;
        }

        private static OnboardingTaskCategory ParseCategory(string value)
        {
            return Enum.TryParse(value, true, out OnboardingTaskCategory parsedValue)
                ? parsedValue
                : OnboardingTaskCategory.Orientation;
        }

        private static OnboardingTaskAssignmentTarget ParseAssignmentTarget(string value)
        {
            return Enum.TryParse(value, true, out OnboardingTaskAssignmentTarget parsedValue)
                ? parsedValue
                : OnboardingTaskAssignmentTarget.Enrolee;
        }

        private static OnboardingTaskAcknowledgementRule ParseAcknowledgementRule(string value)
        {
            return Enum.TryParse(value, true, out OnboardingTaskAcknowledgementRule parsedValue)
                ? parsedValue
                : OnboardingTaskAcknowledgementRule.NotRequired;
        }

        private static MarkdownImportWarningDto MapWarning(JsonElement warningElement)
        {
            if (warningElement.ValueKind == JsonValueKind.String)
            {
                return new MarkdownImportWarningDto
                {
                    Code = "AI_INFERENCE",
                    Message = NormalizeWarningMessage(warningElement.GetString()),
                };
            }

            if (warningElement.ValueKind != JsonValueKind.Object)
            {
                return new MarkdownImportWarningDto
                {
                    Code = "AI_INFERENCE",
                    Message = "The import required AI-assisted inference.",
                };
            }

            var code = ReadWarningString(warningElement, "code");
            var message = ReadWarningString(warningElement, "message");

            return new MarkdownImportWarningDto
            {
                Code = string.IsNullOrWhiteSpace(code) ? "AI_INFERENCE" : code.Trim(),
                Message = NormalizeWarningMessage(message),
                LineNumber = ReadWarningInt32(warningElement, "lineNumber"),
                SectionName = ReadWarningString(warningElement, "sectionName")
            };
        }

        private static string NormalizeWarningMessage(string message)
        {
            return string.IsNullOrWhiteSpace(message)
                ? "The import required AI-assisted inference."
                : message.Trim();
        }

        private static string ReadWarningString(JsonElement warningElement, string propertyName)
        {
            if (!warningElement.TryGetProperty(propertyName, out var propertyValue))
            {
                return null;
            }

            return propertyValue.ValueKind switch
            {
                JsonValueKind.String => propertyValue.GetString(),
                JsonValueKind.Number => propertyValue.GetRawText(),
                JsonValueKind.True => bool.TrueString,
                JsonValueKind.False => bool.FalseString,
                _ => null
            };
        }

        private static int? ReadWarningInt32(JsonElement warningElement, string propertyName)
        {
            if (!warningElement.TryGetProperty(propertyName, out var propertyValue))
            {
                return null;
            }

            if (propertyValue.ValueKind == JsonValueKind.Number &&
                propertyValue.TryGetInt32(out var lineNumber))
            {
                return lineNumber;
            }

            if (propertyValue.ValueKind == JsonValueKind.String &&
                int.TryParse(propertyValue.GetString(), out lineNumber))
            {
                return lineNumber;
            }

            return null;
        }

        private static string NormalizeRequiredText(string value, string fallback, int maxLength)
        {
            var normalizedValue = string.IsNullOrWhiteSpace(value) ? fallback : value.Trim();
            if (normalizedValue.Length > maxLength)
            {
                return normalizedValue.Substring(0, maxLength);
            }

            return normalizedValue;
        }

        private static string DerivePlanName(string sourceFileName)
        {
            if (string.IsNullOrWhiteSpace(sourceFileName))
            {
                return "Imported Onboarding Plan";
            }

            var fileName = System.IO.Path.GetFileNameWithoutExtension(sourceFileName)?.Trim();
            return string.IsNullOrWhiteSpace(fileName)
                ? "Imported Onboarding Plan"
                : fileName;
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

        private sealed class GroqChatCompletionResponse
        {
            [JsonPropertyName("choices")]
            public List<GroqChoice> Choices { get; set; }
        }

        private sealed class GroqChoice
        {
            [JsonPropertyName("message")]
            public GroqMessage Message { get; set; }
        }

        private sealed class GroqMessage
        {
            [JsonPropertyName("content")]
            public string Content { get; set; }
        }

        private sealed class GroqImportResponse
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

        private sealed class GroqImportModule
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

        private sealed class GroqImportTask
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

        private sealed class GroqProposalResponse
        {
            [JsonPropertyName("proposals")]
            public List<GroqProposal> Proposals { get; set; }
        }

        private sealed class GroqProposal
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
}
