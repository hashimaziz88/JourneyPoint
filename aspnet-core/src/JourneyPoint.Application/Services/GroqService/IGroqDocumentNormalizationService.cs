using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using JourneyPoint.Application.Services.DocumentExtractionService;
using JourneyPoint.Application.Services.DocumentExtractionService.Dto;
using JourneyPoint.Application.Services.GroqService.Dto;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Application.Services.OnboardingDocumentService.Dto;
using JourneyPoint.Application.Services.OnboardingDocumentService;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.GroqService
{
    /// <summary>
    /// Defines Groq-backed normalization operations for onboarding imports and document enrichment.
    /// </summary>
    public interface IGroqDocumentNormalizationService
    {
        /// <summary>
        /// Gets a value indicating whether Groq-backed normalization is configured and ready for use.
        /// </summary>
        bool IsEnabled { get; }

        /// <summary>
        /// Normalizes raw text content into a markdown import preview.
        /// </summary>
        Task<MarkdownImportPreviewDto> NormalizeImportFromTextAsync(
            string sourceFileName,
            string contentType,
            string rawText);

        /// <summary>
        /// Normalizes image content into a markdown import preview.
        /// </summary>
        Task<MarkdownImportPreviewDto> NormalizeImportFromImagesAsync(
            string sourceFileName,
            string contentType,
            IReadOnlyCollection<DocumentImageContent> images);

        /// <summary>
        /// Extracts plan-linked proposal candidates from raw text content.
        /// </summary>
        Task<IReadOnlyCollection<ExtractedTaskCandidate>> ExtractPlanProposalsFromTextAsync(
            OnboardingPlan plan,
            string sourceFileName,
            string contentType,
            string rawText,
            Guid? onboardingDocumentId = null);

        /// <summary>
        /// Extracts plan-linked proposal candidates from image content.
        /// </summary>
        Task<IReadOnlyCollection<ExtractedTaskCandidate>> ExtractPlanProposalsFromImagesAsync(
            OnboardingPlan plan,
            string sourceFileName,
            string contentType,
            IReadOnlyCollection<DocumentImageContent> images,
            Guid? onboardingDocumentId = null);
    }
}
