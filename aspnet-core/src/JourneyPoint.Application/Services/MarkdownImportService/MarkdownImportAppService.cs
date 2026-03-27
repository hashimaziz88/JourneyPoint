using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using JourneyPoint.Application.Services.DocumentExtractionService;
using JourneyPoint.Application.Services.GroqService;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Application.Services.OnboardingPlanService.Dto;
using JourneyPoint.Authorization;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.MarkdownImportService
{
    /// <summary>
    /// Provides markdown onboarding import preview and draft-save orchestration.
    /// </summary>
    [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
    public class MarkdownImportAppService : JourneyPointAppServiceBase, IMarkdownImportAppService
    {
        private const int MaximumImportSizeBytes = 10 * 1024 * 1024;

        private readonly IRepository<OnboardingPlan, Guid> _onboardingPlanRepository;
        private readonly OnboardingPlanManager _onboardingPlanManager;
        private readonly MarkdownImportParser _markdownImportParser;
        private readonly DocumentContentExtractionService _documentContentExtractionService;
        private readonly GroqDocumentNormalizationService _groqDocumentNormalizationService;

        /// <summary>
        /// Initializes a new instance of the <see cref="MarkdownImportAppService"/> class.
        /// </summary>
        public MarkdownImportAppService(
            IRepository<OnboardingPlan, Guid> onboardingPlanRepository,
            OnboardingPlanManager onboardingPlanManager,
            MarkdownImportParser markdownImportParser,
            DocumentContentExtractionService documentContentExtractionService,
            GroqDocumentNormalizationService groqDocumentNormalizationService)
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

        private static IEnumerable<MarkdownImportPreviewModuleDto> OrderModules(IEnumerable<MarkdownImportPreviewModuleDto> modules)
        {
            return (modules ?? Enumerable.Empty<MarkdownImportPreviewModuleDto>())
                .OrderBy(module => module.OrderIndex)
                .ThenBy(module => module.Name);
        }

        private static IEnumerable<MarkdownImportPreviewTaskDto> OrderTasks(IEnumerable<MarkdownImportPreviewTaskDto> tasks)
        {
            return (tasks ?? Enumerable.Empty<MarkdownImportPreviewTaskDto>())
                .OrderBy(task => task.OrderIndex)
                .ThenBy(task => task.Title);
        }

        private static OnboardingPlanDetailDto MapToDetailDto(OnboardingPlan plan)
        {
            return new OnboardingPlanDetailDto
            {
                Id = plan.Id,
                Name = plan.Name,
                Description = plan.Description,
                TargetAudience = plan.TargetAudience,
                DurationDays = plan.DurationDays,
                Status = plan.Status,
                Modules = plan.Modules
                    .OrderBy(module => module.OrderIndex)
                    .Select(MapModuleDto)
                    .ToList()
            };
        }

        private static OnboardingModuleDto MapModuleDto(OnboardingModule module)
        {
            return new OnboardingModuleDto
            {
                Id = module.Id,
                Name = module.Name,
                Description = module.Description,
                OrderIndex = module.OrderIndex,
                Tasks = module.Tasks
                    .OrderBy(task => task.OrderIndex)
                    .Select(MapTaskDto)
                    .ToList()
            };
        }

        private static OnboardingTaskDto MapTaskDto(OnboardingTask task)
        {
            return new OnboardingTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Category = task.Category,
                OrderIndex = task.OrderIndex,
                DueDayOffset = task.DueDayOffset,
                AssignmentTarget = task.AssignmentTarget,
                AcknowledgementRule = task.AcknowledgementRule
            };
        }

        private async Task<MarkdownImportPreviewDto> PreviewFromTextAsync(
            string markdownContent,
            string sourceFileName,
            string contentType)
        {
            var deterministicPreview = TryParsePreview(markdownContent, sourceFileName);
            if (deterministicPreview != null &&
                deterministicPreview.CanSave &&
                deterministicPreview.Warnings.Count == 0)
            {
                return deterministicPreview;
            }

            if (_groqDocumentNormalizationService.IsEnabled)
            {
                return await _groqDocumentNormalizationService.NormalizeImportFromTextAsync(
                    sourceFileName,
                    contentType,
                    markdownContent);
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
                if (deterministicPreview != null &&
                    deterministicPreview.CanSave &&
                    deterministicPreview.Warnings.Count == 0)
                {
                    return deterministicPreview;
                }

                if (_groqDocumentNormalizationService.IsEnabled)
                {
                    return await _groqDocumentNormalizationService.NormalizeImportFromTextAsync(
                        sourceFileName,
                        contentType,
                        extractedContent.TextContent);
                }

                if (deterministicPreview != null)
                {
                    return deterministicPreview;
                }
            }

            if (extractedContent.Images.Any() && _groqDocumentNormalizationService.IsEnabled)
            {
                return await _groqDocumentNormalizationService.NormalizeImportFromImagesAsync(
                    sourceFileName,
                    contentType,
                    extractedContent.Images);
            }

            throw new UserFriendlyException(
                "This document could not be normalized into an onboarding draft preview. Enable Groq-backed document import or upload a text-based source.");
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

        private static byte[] DecodeAndValidateFile(string base64Content)
        {
            byte[] fileBytes;

            try
            {
                fileBytes = Convert.FromBase64String(base64Content);
            }
            catch (FormatException exception)
            {
                throw new UserFriendlyException("Uploaded document content is not valid base64.", exception);
            }

            if (fileBytes.Length == 0)
            {
                throw new UserFriendlyException("Uploaded document content cannot be empty.");
            }

            if (fileBytes.Length > MaximumImportSizeBytes)
            {
                throw new UserFriendlyException("Uploaded import documents must be 10 MB or smaller.");
            }

            return fileBytes;
        }

        private static string NormalizeImportContentType(string contentType, string sourceFileName)
        {
            var normalizedContentType = string.IsNullOrWhiteSpace(contentType)
                ? "text/markdown"
                : contentType.Trim();
            var extension = Path.GetExtension(sourceFileName ?? string.Empty);

            if (extension.Equals(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                return "application/pdf";
            }

            if (extension.Equals(".md", StringComparison.OrdinalIgnoreCase) ||
                extension.Equals(".markdown", StringComparison.OrdinalIgnoreCase))
            {
                return "text/markdown";
            }

            if (extension.Equals(".txt", StringComparison.OrdinalIgnoreCase))
            {
                return "text/plain";
            }

            if (extension.Equals(".png", StringComparison.OrdinalIgnoreCase))
            {
                return "image/png";
            }

            if (extension.Equals(".webp", StringComparison.OrdinalIgnoreCase))
            {
                return "image/webp";
            }

            if (extension.Equals(".jpg", StringComparison.OrdinalIgnoreCase) ||
                extension.Equals(".jpeg", StringComparison.OrdinalIgnoreCase))
            {
                return "image/jpeg";
            }

            return normalizedContentType;
        }
    }
}
