using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using JourneyPoint.Application.Services.OnboardingDocumentService.Dto;

namespace JourneyPoint.Application.Services.OnboardingDocumentService
{
    /// <summary>
    /// Defines plan-level document upload, extraction, review, and apply operations.
    /// </summary>
    public interface IOnboardingDocumentAppService : IApplicationService
    {
        /// <summary>
        /// Returns uploaded documents for one onboarding plan.
        /// </summary>
        Task<ListResultDto<OnboardingDocumentListItemDto>> GetPlanDocumentsAsync(EntityDto<Guid> input);

        /// <summary>
        /// Returns one uploaded document with reviewable proposals.
        /// </summary>
        Task<OnboardingDocumentDetailDto> GetDetailAsync(EntityDto<Guid> input);

        /// <summary>
        /// Uploads one plan-level document without applying extracted tasks automatically.
        /// </summary>
        Task<OnboardingDocumentDetailDto> UploadAsync(CreateOnboardingDocumentUploadRequest input);

        /// <summary>
        /// Starts extraction for one uploaded document.
        /// </summary>
        Task<OnboardingDocumentDetailDto> StartExtractionAsync(EntityDto<Guid> input);

        /// <summary>
        /// Updates one proposal while keeping it reviewable.
        /// </summary>
        Task<OnboardingDocumentDetailDto> UpdateProposalAsync(UpdateExtractedTaskProposalRequest input);

        /// <summary>
        /// Accepts one proposal after facilitator review.
        /// </summary>
        Task<OnboardingDocumentDetailDto> AcceptProposalAsync(UpdateExtractedTaskProposalRequest input);

        /// <summary>
        /// Rejects one proposal after facilitator review.
        /// </summary>
        Task<OnboardingDocumentDetailDto> RejectProposalAsync(EntityDto<Guid> input);

        /// <summary>
        /// Applies all currently accepted proposals to the onboarding plan.
        /// </summary>
        Task<OnboardingDocumentDetailDto> ApplyAcceptedProposalsAsync(EntityDto<Guid> input);
    }
}
