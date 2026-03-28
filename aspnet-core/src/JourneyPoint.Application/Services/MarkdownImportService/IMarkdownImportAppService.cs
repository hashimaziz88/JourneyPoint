using System.Threading.Tasks;
using Abp.Application.Services;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Application.Services.OnboardingPlanService.Dto;

namespace JourneyPoint.Application.Services.MarkdownImportService
{
    /// <summary>
    /// Defines application-service operations for markdown onboarding import preview and draft save.
    /// </summary>
    public interface IMarkdownImportAppService : IApplicationService
    {
        /// <summary>
        /// Parses markdown content into a reviewable onboarding preview.
        /// </summary>
        Task<MarkdownImportPreviewDto> PreviewAsync(PreviewMarkdownImportRequest input);

        /// <summary>
        /// Saves a facilitator-approved markdown preview as a new onboarding draft.
        /// </summary>
        Task<OnboardingPlanDetailDto> SaveDraftAsync(SaveMarkdownImportRequest input);
    }
}
