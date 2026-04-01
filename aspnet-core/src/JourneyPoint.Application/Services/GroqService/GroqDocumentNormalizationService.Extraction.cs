using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using JourneyPoint.Application.Services.AuditService;
using JourneyPoint.Application.Services.AuditService.Dto;
using JourneyPoint.Application.Services.DocumentExtractionService;
using JourneyPoint.Application.Services.DocumentExtractionService.Dto;
using JourneyPoint.Application.Services.GroqService.Dto;
using JourneyPoint.Application.Services.GroqService.Helpers;
using JourneyPoint.Application.Services.OnboardingDocumentService;
using JourneyPoint.Application.Services.OnboardingDocumentService.Dto;
using JourneyPoint.Domains.Audit;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.GroqService
{
    /// <summary>
    /// Handles proposal extraction and audit logging for Groq-backed onboarding document analysis.
    /// </summary>
    public partial class GroqDocumentNormalizationService
    {
        /// <summary>
        /// Extracts reviewable plan-linked task proposals from raw text content.
        /// </summary>
        public async Task<IReadOnlyCollection<ExtractedTaskCandidate>> ExtractPlanProposalsFromTextAsync(
            OnboardingPlan plan,
            string sourceFileName,
            string contentType,
            string rawText,
            Guid? onboardingDocumentId = null)
        {
            EnsureEnabled();

            var modelName = _groqOptions.Model;
            var prompt = GroqDocumentNormalizationPromptFactory.BuildProposalPrompt(
                plan,
                sourceFileName,
                contentType);
            var startedAt = DateTime.UtcNow;
            var stopwatch = Stopwatch.StartNew();

            try
            {
                var responseText = await RequestJsonAsync(
                    modelName,
                    BuildTextMessages(prompt, rawText));
                var payload = DeserializeRequired<GroqProposalResponse>(responseText);
                var candidates = GroqDocumentNormalizationMapper.MapProposalCandidates(plan, payload);

                await WriteAuditLogAsync(new AiAuditLogRequest
                {
                    TenantId = plan.TenantId,
                    WorkflowType = GenerationLogWorkflowType.Extraction,
                    Status = GenerationLogStatus.Succeeded,
                    OnboardingPlanId = plan.Id,
                    OnboardingDocumentId = onboardingDocumentId,
                    ModelName = modelName,
                    PromptSummary = prompt,
                    ResponseSummary = responseText,
                    TasksAdded = candidates.Count,
                    TasksRevised = 0,
                    StartedAt = startedAt,
                    CompletedAt = startedAt.Add(stopwatch.Elapsed)
                });

                return candidates;
            }
            catch (Exception exception)
            {
                await WriteAuditLogAsync(new AiAuditLogRequest
                {
                    TenantId = plan.TenantId,
                    WorkflowType = GenerationLogWorkflowType.Extraction,
                    Status = GenerationLogStatus.Failed,
                    OnboardingPlanId = plan.Id,
                    OnboardingDocumentId = onboardingDocumentId,
                    ModelName = modelName,
                    PromptSummary = prompt,
                    FailureReason = exception.Message,
                    StartedAt = startedAt,
                    CompletedAt = startedAt.Add(stopwatch.Elapsed)
                });

                throw;
            }
        }

        /// <summary>
        /// Extracts reviewable plan-linked task proposals from image content.
        /// </summary>
        public async Task<IReadOnlyCollection<ExtractedTaskCandidate>> ExtractPlanProposalsFromImagesAsync(
            OnboardingPlan plan,
            string sourceFileName,
            string contentType,
            IReadOnlyCollection<DocumentImageContent> images,
            Guid? onboardingDocumentId = null)
        {
            EnsureEnabled();

            var modelName = ResolveVisionModel();
            var prompt = GroqDocumentNormalizationPromptFactory.BuildProposalPrompt(
                plan,
                sourceFileName,
                contentType);
            var startedAt = DateTime.UtcNow;
            var stopwatch = Stopwatch.StartNew();

            try
            {
                var responseText = await RequestJsonAsync(
                    modelName,
                    BuildImageMessages(prompt, images));
                var payload = DeserializeRequired<GroqProposalResponse>(responseText);
                var candidates = GroqDocumentNormalizationMapper.MapProposalCandidates(plan, payload);

                await WriteAuditLogAsync(new AiAuditLogRequest
                {
                    TenantId = plan.TenantId,
                    WorkflowType = GenerationLogWorkflowType.Extraction,
                    Status = GenerationLogStatus.Succeeded,
                    OnboardingPlanId = plan.Id,
                    OnboardingDocumentId = onboardingDocumentId,
                    ModelName = modelName,
                    PromptSummary = prompt,
                    ResponseSummary = responseText,
                    TasksAdded = candidates.Count,
                    TasksRevised = 0,
                    StartedAt = startedAt,
                    CompletedAt = startedAt.Add(stopwatch.Elapsed)
                });

                return candidates;
            }
            catch (Exception exception)
            {
                await WriteAuditLogAsync(new AiAuditLogRequest
                {
                    TenantId = plan.TenantId,
                    WorkflowType = GenerationLogWorkflowType.Extraction,
                    Status = GenerationLogStatus.Failed,
                    OnboardingPlanId = plan.Id,
                    OnboardingDocumentId = onboardingDocumentId,
                    ModelName = modelName,
                    PromptSummary = prompt,
                    FailureReason = exception.Message,
                    StartedAt = startedAt,
                    CompletedAt = startedAt.Add(stopwatch.Elapsed)
                });

                throw;
            }
        }

        /// <summary>
        /// Persists append-only AI audit metadata for extraction requests.
        /// </summary>
        private async Task WriteAuditLogAsync(AiAuditLogRequest request)
        {
            await _aiAuditLogService.WriteAsync(request);
        }
    }
}
