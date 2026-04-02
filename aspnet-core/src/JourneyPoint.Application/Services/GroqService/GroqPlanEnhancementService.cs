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
using JourneyPoint.Application.Services.OnboardingPlanService.Dto;
using JourneyPoint.Configuration;
using JourneyPoint.Domains.Audit.Enums;
using JourneyPoint.Domains.OnboardingPlans;
using Microsoft.Extensions.Options;

namespace JourneyPoint.Application.Services.GroqService
{
    /// <summary>
    /// Rewrites onboarding plan module and task content with AI-enhanced professional writing.
    /// </summary>
    public class GroqPlanEnhancementService : IGroqPlanEnhancementService, ITransientDependency
    {
        private static readonly JsonSerializerOptions SerializerOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        private readonly GroqOptions _groqOptions;
        private readonly IAiAuditLogService _aiAuditLogService;

        /// <summary>
        /// Initializes a new instance of the <see cref="GroqPlanEnhancementService"/> class.
        /// </summary>
        public GroqPlanEnhancementService(
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
        public async Task<GroqPlanEnhancementResult> EnhancePlanAsync(
            OnboardingPlan plan,
            IReadOnlyList<OnboardingModuleDto> modules,
            int tenantId,
            Guid planId)
        {
            EnsureEnabled();
            ArgumentNullException.ThrowIfNull(plan);
            ArgumentNullException.ThrowIfNull(modules);

            if (modules.Count == 0)
            {
                throw new InvalidOperationException("At least one module is required for AI enhancement.");
            }

            var modelName = _groqOptions.Model;
            var systemPrompt = GroqPlanEnhancementPromptFactory.BuildSystemPrompt();
            var userContent = GroqPlanEnhancementPromptFactory.BuildUserContent(plan, modules);
            var promptSummary = $"Enhance plan '{plan.Name}' with {modules.Count} modules and {modules.Sum(m => m.Tasks.Count)} tasks.";
            var startedAt = DateTime.UtcNow;
            var stopwatch = Stopwatch.StartNew();

            try
            {
                var responseText = await RequestJsonAsync(modelName, BuildMessages(systemPrompt, userContent));
                var payload = DeserializeRequired<GroqPlanEnhancementResponse>(responseText);
                var result = MapResult(payload, modelName);

                var totalTasks = result.Modules.Sum(m => m.Tasks.Count);
                await _aiAuditLogService.WriteAsync(new AiAuditLogRequest
                {
                    TenantId = tenantId,
                    WorkflowType = GenerationLogWorkflowType.PlanEnhancement,
                    Status = GenerationLogStatus.Succeeded,
                    OnboardingPlanId = planId,
                    ModelName = modelName,
                    PromptSummary = promptSummary,
                    ResponseSummary = responseText.Length > 2000 ? responseText[..2000] : responseText,
                    TasksRevised = totalTasks,
                    StartedAt = startedAt,
                    CompletedAt = startedAt.Add(stopwatch.Elapsed)
                });

                return result;
            }
            catch (Exception exception)
            {
                await _aiAuditLogService.WriteAsync(new AiAuditLogRequest
                {
                    TenantId = tenantId,
                    WorkflowType = GenerationLogWorkflowType.PlanEnhancement,
                    Status = GenerationLogStatus.Failed,
                    OnboardingPlanId = planId,
                    ModelName = modelName,
                    PromptSummary = promptSummary,
                    FailureReason = exception.Message,
                    StartedAt = startedAt,
                    CompletedAt = startedAt.Add(stopwatch.Elapsed)
                });

                throw;
            }
        }

        private static GroqPlanEnhancementResult MapResult(GroqPlanEnhancementResponse payload, string modelName)
        {
            var modules = payload.Modules
                .Where(m => Guid.TryParse(m.ModuleId, out _))
                .Select(m => new EnhancedModuleProposal
                {
                    ModuleId = Guid.Parse(m.ModuleId),
                    Name = m.Name?.Trim(),
                    Description = m.Description?.Trim(),
                    Tasks = (m.Tasks ?? new List<GroqEnhancedTaskPayload>())
                        .Where(t => Guid.TryParse(t.TaskId, out _))
                        .Select(t => new EnhancedTaskProposal
                        {
                            TaskId = Guid.Parse(t.TaskId),
                            Title = t.Title?.Trim(),
                            Description = t.Description?.Trim()
                        })
                        .ToList()
                })
                .ToList();

            return new GroqPlanEnhancementResult
            {
                ModelName = modelName,
                Modules = modules
            };
        }

        private void EnsureEnabled()
        {
            if (!IsEnabled)
            {
                throw new InvalidOperationException("Groq plan enhancement is not configured.");
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
                temperature = 0.4,
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
                    $"Groq plan enhancement failed with status {(int)response.StatusCode}: {responseBody}");
            }

            var completion = DeserializeRequired<GroqChatCompletionResponse>(responseBody);
            var content = completion.Choices?.FirstOrDefault()?.Message?.Content;

            if (string.IsNullOrWhiteSpace(content))
            {
                throw new InvalidOperationException("Groq returned an empty plan enhancement response.");
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
