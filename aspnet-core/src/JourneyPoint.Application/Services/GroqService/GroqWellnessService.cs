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
using JourneyPoint.Application.Services.AuditService.Dto;
using JourneyPoint.Application.Services.GroqService.Dto;
using JourneyPoint.Application.Services.GroqService.Helpers;
using JourneyPoint.Configuration;
using JourneyPoint.Domains.Audit.Enums;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.Wellness;
using JourneyPoint.Domains.Wellness.Enums;
using Microsoft.Extensions.Options;

namespace JourneyPoint.Application.Services.GroqService
{
    /// <summary>
    /// Generates backend-only Groq AI questions and answer suggestions for wellness check-ins.
    /// </summary>
    public class GroqWellnessService : IGroqWellnessService, ITransientDependency
    {
        private static readonly JsonSerializerOptions SerializerOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        private readonly GroqOptions _groqOptions;
        private readonly IAiAuditLogService _aiAuditLogService;

        /// <summary>
        /// Initializes a new instance of the <see cref="GroqWellnessService"/> class.
        /// </summary>
        public GroqWellnessService(
            IOptions<GroqOptions> groqOptions,
            IAiAuditLogService aiAuditLogService)
        {
            _groqOptions = groqOptions?.Value ?? throw new ArgumentNullException(nameof(groqOptions));
            _aiAuditLogService = aiAuditLogService ?? throw new ArgumentNullException(nameof(aiAuditLogService));
        }

        /// <inheritdoc />
        public bool IsEnabled =>
            _groqOptions.Enabled &&
            !string.IsNullOrWhiteSpace(_groqOptions.ApiKey) &&
            _groqOptions.GetBaseUri() != null &&
            !string.IsNullOrWhiteSpace(_groqOptions.Model);

        /// <inheritdoc />
        public async Task<GroqWellnessQuestionsResult> GenerateQuestionsAsync(
            Hire hire,
            Journey journey,
            OnboardingPlan onboardingPlan,
            WellnessCheckInPeriod period)
        {
            EnsureEnabled();
            ArgumentNullException.ThrowIfNull(hire);
            ArgumentNullException.ThrowIfNull(journey);
            ArgumentNullException.ThrowIfNull(onboardingPlan);

            var modelName = _groqOptions.Model;
            var systemPrompt = GroqWellnessPromptFactory.BuildQuestionGenerationSystemPrompt();
            var userContent = GroqWellnessPromptFactory.BuildQuestionGenerationUserContent(hire, onboardingPlan, period);
            var periodLabel = GroqWellnessPromptFactory.GetPeriodLabel(period);
            var promptSummary = $"Generate wellness questions for hire '{hire.FullName}' at period '{periodLabel}'.";
            var startedAt = DateTime.UtcNow;
            var stopwatch = Stopwatch.StartNew();

            try
            {
                var responseText = await RequestJsonAsync(modelName, BuildMessages(systemPrompt, userContent));
                var payload = DeserializeRequired<GroqWellnessQuestionsResponse>(responseText);
                var questions = (payload.Questions ?? new List<string>())
                    .Where(q => !string.IsNullOrWhiteSpace(q))
                    .Take(5)
                    .ToList();

                var generationLogId = await _aiAuditLogService.WriteAsync(new AiAuditLogRequest
                {
                    TenantId = journey.TenantId,
                    WorkflowType = GenerationLogWorkflowType.WellnessQuestionGeneration,
                    Status = GenerationLogStatus.Succeeded,
                    HireId = hire.Id,
                    JourneyId = journey.Id,
                    OnboardingPlanId = onboardingPlan.Id,
                    ModelName = modelName,
                    PromptSummary = promptSummary,
                    ResponseSummary = responseText,
                    TasksAdded = questions.Count,
                    TasksRevised = 0,
                    StartedAt = startedAt,
                    CompletedAt = startedAt.Add(stopwatch.Elapsed)
                });

                return new GroqWellnessQuestionsResult
                {
                    GenerationLogId = generationLogId,
                    ModelName = modelName,
                    Questions = questions
                };
            }
            catch (Exception exception)
            {
                await _aiAuditLogService.WriteAsync(new AiAuditLogRequest
                {
                    TenantId = journey.TenantId,
                    WorkflowType = GenerationLogWorkflowType.WellnessQuestionGeneration,
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

        /// <inheritdoc />
        public async Task<GroqWellnessAnswerSuggestionResult> SuggestAnswerAsync(
            Hire hire,
            WellnessCheckIn checkIn,
            WellnessQuestion question)
        {
            EnsureEnabled();
            ArgumentNullException.ThrowIfNull(hire);
            ArgumentNullException.ThrowIfNull(checkIn);
            ArgumentNullException.ThrowIfNull(question);

            var modelName = _groqOptions.Model;
            var periodLabel = GroqWellnessPromptFactory.GetPeriodLabel(checkIn.Period);
            var systemPrompt = GroqWellnessPromptFactory.BuildAnswerSuggestionSystemPrompt();
            var userContent = GroqWellnessPromptFactory.BuildAnswerSuggestionUserContent(hire, question.QuestionText, periodLabel);
            var promptSummary = $"Suggest answer for hire '{hire.FullName}' on question: {question.QuestionText[..Math.Min(100, question.QuestionText.Length)]}";
            var startedAt = DateTime.UtcNow;
            var stopwatch = Stopwatch.StartNew();

            try
            {
                var responseText = await RequestJsonAsync(modelName, BuildMessages(systemPrompt, userContent));
                var payload = DeserializeRequired<GroqWellnessAnswerSuggestionResponse>(responseText);

                var generationLogId = await _aiAuditLogService.WriteAsync(new AiAuditLogRequest
                {
                    TenantId = checkIn.TenantId,
                    WorkflowType = GenerationLogWorkflowType.WellnessAnswerSuggestion,
                    Status = GenerationLogStatus.Succeeded,
                    HireId = hire.Id,
                    JourneyId = checkIn.JourneyId,
                    ModelName = modelName,
                    PromptSummary = promptSummary,
                    ResponseSummary = responseText,
                    TasksAdded = 0,
                    TasksRevised = 1,
                    StartedAt = startedAt,
                    CompletedAt = startedAt.Add(stopwatch.Elapsed)
                });

                return new GroqWellnessAnswerSuggestionResult
                {
                    GenerationLogId = generationLogId,
                    SuggestedAnswer = payload.SuggestedAnswer?.Trim()
                };
            }
            catch (Exception exception)
            {
                await _aiAuditLogService.WriteAsync(new AiAuditLogRequest
                {
                    TenantId = checkIn.TenantId,
                    WorkflowType = GenerationLogWorkflowType.WellnessAnswerSuggestion,
                    Status = GenerationLogStatus.Failed,
                    HireId = hire.Id,
                    JourneyId = checkIn.JourneyId,
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
                throw new InvalidOperationException("Groq wellness service is not configured.");
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
                temperature = 0.5,
                response_format = new { type = "json_object" },
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
                    $"Groq wellness request failed with status {(int)response.StatusCode}: {responseBody}");
            }

            var completion = DeserializeRequired<GroqChatCompletionResponse>(responseBody);
            var content = completion.Choices?.FirstOrDefault()?.Message?.Content;

            if (string.IsNullOrWhiteSpace(content))
            {
                throw new InvalidOperationException("Groq returned an empty wellness response.");
            }

            return content;
        }

        private static IEnumerable<object> BuildMessages(string systemPrompt, string userContent)
        {
            return new object[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userContent }
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
