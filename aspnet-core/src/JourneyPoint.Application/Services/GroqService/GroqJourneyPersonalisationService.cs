using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Abp.Dependency;
using JourneyPoint.Application.Services.AuditService;
using JourneyPoint.Configuration;
using JourneyPoint.Domains.Audit;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;
using Microsoft.Extensions.Options;

namespace JourneyPoint.Application.Services.GroqService
{
    /// <summary>
    /// Generates backend-only Groq personalisation proposals for reviewable journey task revisions.
    /// </summary>
    public class GroqJourneyPersonalisationService : IGroqJourneyPersonalisationService, ITransientDependency
    {
        private static readonly JsonSerializerOptions SerializerOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        private readonly GroqOptions _groqOptions;
        private readonly IAiAuditLogService _aiAuditLogService;

        /// <summary>
        /// Initializes a new instance of the <see cref="GroqJourneyPersonalisationService"/> class.
        /// </summary>
        public GroqJourneyPersonalisationService(
            IOptions<GroqOptions> groqOptions,
            IAiAuditLogService aiAuditLogService)
        {
            _groqOptions = groqOptions?.Value ?? throw new ArgumentNullException(nameof(groqOptions));
            _aiAuditLogService = aiAuditLogService ?? throw new ArgumentNullException(nameof(aiAuditLogService));
        }

        /// <summary>
        /// Gets a value indicating whether journey personalisation is configured and available.
        /// </summary>
        public bool IsEnabled =>
            _groqOptions.Enabled &&
            !string.IsNullOrWhiteSpace(_groqOptions.ApiKey) &&
            _groqOptions.GetBaseUri() != null &&
            !string.IsNullOrWhiteSpace(_groqOptions.Model);

        /// <summary>
        /// Requests diff-ready personalisation proposals for the provided journey tasks.
        /// </summary>
        public async Task<GroqJourneyPersonalisationResult> GenerateProposalAsync(
            Hire hire,
            Journey journey,
            OnboardingPlan onboardingPlan,
            IReadOnlyCollection<JourneyTask> eligibleTasks,
            string facilitatorInstructions = null)
        {
            EnsureEnabled();
            ArgumentNullException.ThrowIfNull(hire);
            ArgumentNullException.ThrowIfNull(journey);
            ArgumentNullException.ThrowIfNull(onboardingPlan);
            ArgumentNullException.ThrowIfNull(eligibleTasks);

            if (eligibleTasks.Count == 0)
            {
                throw new InvalidOperationException("Journey personalisation requires at least one eligible pending task.");
            }

            var modelName = _groqOptions.Model;
            var systemPrompt = GroqJourneyPersonalisationPromptFactory.BuildSystemPrompt();
            var userContent = GroqJourneyPersonalisationPromptFactory.BuildUserContent(
                hire,
                journey,
                onboardingPlan,
                eligibleTasks,
                facilitatorInstructions);
            var promptSummary = GroqJourneyPersonalisationPromptFactory.BuildAuditPromptSummary(
                hire,
                journey,
                onboardingPlan,
                eligibleTasks.Count,
                facilitatorInstructions);
            var startedAt = DateTime.UtcNow;
            var stopwatch = Stopwatch.StartNew();

            try
            {
                var responseText = await RequestJsonAsync(
                    modelName,
                    BuildMessages(systemPrompt, userContent));
                var payload = DeserializeRequired<GroqJourneyPersonalisationResponse>(responseText);
                var taskLookup = eligibleTasks.ToDictionary(task => task.Id);
                var revisions = GroqJourneyPersonalisationMapper.MapRevisions(payload, taskLookup);
                var generationLogId = await _aiAuditLogService.WriteAsync(new AiAuditLogRequest
                {
                    TenantId = journey.TenantId,
                    WorkflowType = GenerationLogWorkflowType.Personalisation,
                    Status = GenerationLogStatus.Succeeded,
                    HireId = hire.Id,
                    JourneyId = journey.Id,
                    OnboardingPlanId = onboardingPlan.Id,
                    ModelName = modelName,
                    PromptSummary = promptSummary,
                    ResponseSummary = responseText,
                    TasksAdded = 0,
                    TasksRevised = revisions.Count,
                    StartedAt = startedAt,
                    CompletedAt = startedAt.Add(stopwatch.Elapsed)
                });

                return new GroqJourneyPersonalisationResult
                {
                    GenerationLogId = generationLogId,
                    ModelName = modelName,
                    RequestedAt = startedAt,
                    Summary = GroqJourneyPersonalisationMapper.NormalizeSummary(payload.Summary),
                    Revisions = revisions
                };
            }
            catch (Exception exception)
            {
                await _aiAuditLogService.WriteAsync(new AiAuditLogRequest
                {
                    TenantId = journey.TenantId,
                    WorkflowType = GenerationLogWorkflowType.Personalisation,
                    Status = GenerationLogStatus.Failed,
                    HireId = hire.Id,
                    JourneyId = journey.Id,
                    OnboardingPlanId = onboardingPlan.Id,
                    ModelName = modelName,
                    PromptSummary = promptSummary,
                    FailureReason = exception.Message,
                    TasksAdded = 0,
                    TasksRevised = 0,
                    StartedAt = startedAt,
                    CompletedAt = startedAt.Add(stopwatch.Elapsed)
                });

                throw;
            }
        }

        private void EnsureEnabled()
        {
            if (!IsEnabled)
            {
                throw new InvalidOperationException("Groq journey personalisation is not configured.");
            }
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
                temperature = 0.3,
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
                    $"Groq personalisation failed with status {(int)response.StatusCode}: {responseBody}");
            }

            var completion = DeserializeRequired<GroqChatCompletionResponse>(responseBody);
            var content = completion.Choices?.FirstOrDefault()?.Message?.Content;
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new InvalidOperationException("Groq returned an empty personalisation response.");
            }

            return content;
        }

        private static IEnumerable<object> BuildMessages(string systemPrompt, string userContent)
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
                    content = userContent
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
