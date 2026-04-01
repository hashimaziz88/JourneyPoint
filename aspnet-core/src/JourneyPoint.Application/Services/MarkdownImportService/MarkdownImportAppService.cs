using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using JourneyPoint.Application.Services.DocumentExtractionService;
using JourneyPoint.Application.Services.GroqService;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Application.Services.MarkdownImportService.Helpers;
using JourneyPoint.Application.Services.OnboardingPlanService.Dto;
using JourneyPoint.Authorization;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.MarkdownImportService
{
    /// <summary>
    /// Provides markdown onboarding import preview and draft-save orchestration.
    /// </summary>
    [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
    public partial class MarkdownImportAppService : JourneyPointAppServiceBase, IMarkdownImportAppService
    {
        private const int MaximumImportSizeBytes = 10 * 1024 * 1024;

        private readonly IRepository<OnboardingPlan, Guid> _onboardingPlanRepository;
        private readonly OnboardingPlanManager _onboardingPlanManager;
        private readonly MarkdownImportParser _markdownImportParser;
        private readonly IDocumentContentExtractionService _documentContentExtractionService;
        private readonly IGroqDocumentNormalizationService _groqDocumentNormalizationService;

        /// <summary>
        /// Initializes a new instance of the <see cref="MarkdownImportAppService"/> class.
        /// </summary>
        public MarkdownImportAppService(
            IRepository<OnboardingPlan, Guid> onboardingPlanRepository,
            OnboardingPlanManager onboardingPlanManager,
            MarkdownImportParser markdownImportParser,
            IDocumentContentExtractionService documentContentExtractionService,
            IGroqDocumentNormalizationService groqDocumentNormalizationService)
        {
            _onboardingPlanRepository = onboardingPlanRepository;
            _onboardingPlanManager = onboardingPlanManager;
            _markdownImportParser = markdownImportParser;
            _documentContentExtractionService = documentContentExtractionService;
            _groqDocumentNormalizationService = groqDocumentNormalizationService;
        }

        /// <summary>
        /// Parses markdown content into a reviewable onboarding preview.
        /// </summary>
        public async Task<MarkdownImportPreviewDto> PreviewAsync(PreviewMarkdownImportRequest input)
        {
            if (input == null)
            {
                throw new UserFriendlyException("Import content is required before a preview can be generated.");
            }

            var normalizedContentType = NormalizeImportContentType(input.SourceContentType, input.SourceFileName);
            if (!string.IsNullOrWhiteSpace(input.Base64Content))
            {
                var fileBytes = DecodeAndValidateFile(input.Base64Content);
                return await PreviewFromBinaryAsync(input.SourceFileName, normalizedContentType, fileBytes);
            }

            if (string.IsNullOrWhiteSpace(input.MarkdownContent))
            {
                throw new UserFriendlyException("Paste source content or upload a supported document before previewing.");
            }

            return await PreviewFromTextAsync(
                input.MarkdownContent,
                input.SourceFileName,
                normalizedContentType);
        }

        /// <summary>
        /// Saves a facilitator-reviewed markdown preview as a new onboarding draft.
        /// </summary>
        public async Task<OnboardingPlanDetailDto> SaveDraftAsync(SaveMarkdownImportRequest input)
        {
            if (input == null)
            {
                throw new UserFriendlyException("Markdown import content is required before a draft can be saved.");
            }

            var tenantId = GetRequiredTenantId();
            var orderedModules = OrderModules(input.Modules).ToList();

            if (!orderedModules.Any())
            {
                throw new UserFriendlyException("Add at least one module before saving an imported draft.");
            }

            var plan = _onboardingPlanManager.CreatePlan(
                tenantId,
                input.Name,
                input.Description,
                input.TargetAudience,
                input.DurationDays);

            foreach (var moduleInput in orderedModules)
            {
                var module = _onboardingPlanManager.CreateModule(
                    moduleInput.Name,
                    moduleInput.Description,
                    moduleInput.OrderIndex);

                _onboardingPlanManager.AddModule(plan, module);

                foreach (var taskInput in OrderTasks(moduleInput.Tasks))
                {
                    var task = _onboardingPlanManager.CreateTask(
                        taskInput.Title,
                        taskInput.Description,
                        taskInput.Category,
                        taskInput.OrderIndex,
                        taskInput.DueDayOffset,
                        taskInput.AssignmentTarget,
                        taskInput.AcknowledgementRule);

                    _onboardingPlanManager.AddTask(plan, module.Id, task);
                }
            }

            await _onboardingPlanRepository.InsertAsync(plan);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToDetailDto(plan);
        }

        private int GetRequiredTenantId()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                throw new AbpAuthorizationException("Markdown import requires a tenant context.");
            }

            return AbpSession.TenantId.Value;
        }

        private async Task<MarkdownImportPreviewDto> PreviewFromTextAsync(
            string markdownContent,
            string sourceFileName,
            string contentType)
        {
            var deterministicPreview = TryParsePreview(markdownContent, sourceFileName);
            if (IsDeterministicPreviewReady(deterministicPreview))
            {
                return deterministicPreview;
            }

            if (_groqDocumentNormalizationService.IsEnabled)
            {
                var normalizedPreview = await TryNormalizePreviewAsync(
                    () => _groqDocumentNormalizationService.NormalizeImportFromTextAsync(
                        sourceFileName,
                        contentType,
                        markdownContent),
                    deterministicPreview);
                if (normalizedPreview != null)
                {
                    return normalizedPreview;
                }
            }

            if (deterministicPreview != null)
            {
                return deterministicPreview;
            }

            throw new UserFriendlyException(
                "The uploaded content could not be normalized. Enable Groq-backed import normalization or provide structured markdown.");
        }

        private async Task<MarkdownImportPreviewDto> PreviewFromBinaryAsync(
            string sourceFileName,
            string contentType,
            byte[] content)
        {
            var extractedContent = await _documentContentExtractionService.ExtractAsync(
                sourceFileName,
                contentType,
                content);

            if (!string.IsNullOrWhiteSpace(extractedContent.TextContent))
            {
                var deterministicPreview = TryParsePreview(extractedContent.TextContent, sourceFileName);
                if (IsDeterministicPreviewReady(deterministicPreview))
                {
                    return deterministicPreview;
                }

                if (_groqDocumentNormalizationService.IsEnabled)
                {
                    var normalizedPreview = await TryNormalizePreviewAsync(
                        () => _groqDocumentNormalizationService.NormalizeImportFromTextAsync(
                            sourceFileName,
                            contentType,
                            extractedContent.TextContent),
                        deterministicPreview);
                    if (normalizedPreview != null)
                    {
                        return normalizedPreview;
                    }
                }

                if (deterministicPreview != null)
                {
                    return deterministicPreview;
                }
            }

            if (extractedContent.Images.Any() && _groqDocumentNormalizationService.IsEnabled)
            {
                var imagePreview = await TryNormalizePreviewAsync(
                    () => _groqDocumentNormalizationService.NormalizeImportFromImagesAsync(
                        sourceFileName,
                        contentType,
                        extractedContent.Images),
                    fallbackPreview: null);
                if (imagePreview != null)
                {
                    return imagePreview;
                }
            }

            throw new UserFriendlyException(
                "This document could not be normalized into an onboarding draft preview. Enable Groq-backed document import or upload a text-based source.");
        }

        private static bool IsDeterministicPreviewReady(MarkdownImportPreviewDto preview)
        {
            return preview != null &&
                   preview.CanSave &&
                   preview.Warnings.Count == 0;
        }

        private async Task<MarkdownImportPreviewDto> TryNormalizePreviewAsync(
            Func<Task<MarkdownImportPreviewDto>> normalizeAsync,
            MarkdownImportPreviewDto fallbackPreview)
        {
            try
            {
                return await normalizeAsync();
            }
            catch
            {
                if (fallbackPreview == null)
                {
                    return null;
                }

                AddAiFallbackWarning(fallbackPreview);
                return fallbackPreview;
            }
        }

        private static void AddAiFallbackWarning(MarkdownImportPreviewDto preview)
        {
            preview.Warnings ??= new List<MarkdownImportWarningDto>();

            if (preview.Warnings.Any(warning => warning.Code == "AI_UNAVAILABLE"))
            {
                return;
            }

            preview.Warnings.Add(new MarkdownImportWarningDto
            {
                Code = "AI_UNAVAILABLE",
                Message = "AI normalization was unavailable, so the preview is using the parser-only fallback. Review imported fields carefully."
            });
        }

        private MarkdownImportPreviewDto TryParsePreview(string markdownContent, string sourceFileName)
        {
            try
            {
                return _markdownImportParser.Parse(markdownContent, sourceFileName);
            }
            catch
            {
                return null;
            }
        }
    }
}
