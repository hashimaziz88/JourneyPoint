using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using JourneyPoint.Application.Services.OnboardingDocumentService.Dto;
using JourneyPoint.Application.Services.OnboardingDocumentService.Helpers;
using JourneyPoint.Authorization;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingDocumentService
{
    /// <summary>
    /// Provides plan-level document upload, extraction orchestration, and facilitator review operations.
    /// </summary>
    [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
    public partial class OnboardingDocumentAppService : JourneyPointAppServiceBase, IOnboardingDocumentAppService
    {
        private const int MaximumUploadSizeBytes = 10 * 1024 * 1024;

        private readonly IRepository<OnboardingPlan, Guid> _onboardingPlanRepository;
        private readonly IRepository<OnboardingDocument, Guid> _onboardingDocumentRepository;
        private readonly IRepository<ExtractedTask, Guid> _extractedTaskRepository;
        private readonly OnboardingPlanManager _onboardingPlanManager;
        private readonly OnboardingDocumentManager _onboardingDocumentManager;
        private readonly IOnboardingDocumentStorage _onboardingDocumentStorage;
        private readonly OnboardingDocumentExtractionOrchestrator _onboardingDocumentExtractionOrchestrator;

        /// <summary>
        /// Initializes a new instance of the <see cref="OnboardingDocumentAppService"/> class.
        /// </summary>
        public OnboardingDocumentAppService(
            IRepository<OnboardingPlan, Guid> onboardingPlanRepository,
            IRepository<OnboardingDocument, Guid> onboardingDocumentRepository,
            IRepository<ExtractedTask, Guid> extractedTaskRepository,
            OnboardingPlanManager onboardingPlanManager,
            OnboardingDocumentManager onboardingDocumentManager,
            IOnboardingDocumentStorage onboardingDocumentStorage,
            OnboardingDocumentExtractionOrchestrator onboardingDocumentExtractionOrchestrator)
        {
            _onboardingPlanRepository = onboardingPlanRepository;
            _onboardingDocumentRepository = onboardingDocumentRepository;
            _extractedTaskRepository = extractedTaskRepository;
            _onboardingPlanManager = onboardingPlanManager;
            _onboardingDocumentManager = onboardingDocumentManager;
            _onboardingDocumentStorage = onboardingDocumentStorage;
            _onboardingDocumentExtractionOrchestrator = onboardingDocumentExtractionOrchestrator;
        }

        /// <summary>
        /// Returns uploaded documents for one onboarding plan.
        /// </summary>
        public async Task<ListResultDto<OnboardingDocumentListItemDto>> GetPlanDocumentsAsync(EntityDto<Guid> input)
        {
            var plan = await GetPlanForReadAsync(input.Id);
            var items = plan.Documents
                .OrderByDescending(document => document.LastModificationTime ?? document.CreationTime)
                .Select(MapListItemDto)
                .ToList();

            return new ListResultDto<OnboardingDocumentListItemDto>(items);
        }

        /// <summary>
        /// Returns one uploaded document with reviewable proposals.
        /// </summary>
        public async Task<OnboardingDocumentDetailDto> GetDetailAsync(EntityDto<Guid> input)
        {
            var document = await GetDocumentForReadAsync(input.Id);
            return MapDetailDto(document);
        }

        /// <summary>
        /// Uploads one plan-level document without applying extracted tasks automatically.
        /// </summary>
        public async Task<OnboardingDocumentDetailDto> UploadAsync(CreateOnboardingDocumentUploadRequest input)
        {
            var plan = await GetPlanForEditAsync(input.PlanId);
            var fileBytes = DecodeAndValidateFile(input.Base64Content);
            var safeFileName = Path.GetFileName(input.FileName);
            var contentType = NormalizeContentType(input.ContentType, safeFileName);
            var document = _onboardingDocumentManager.CreateDocument(
                plan,
                safeFileName,
                "pending",
                contentType,
                fileBytes.Length);

            document.StoragePath = await _onboardingDocumentStorage.SaveAsync(
                plan.TenantId,
                plan.Id,
                document.Id,
                safeFileName,
                fileBytes);

            plan.Documents.Add(document);
            await _onboardingDocumentRepository.InsertAsync(document);
            await CurrentUnitOfWork.SaveChangesAsync();

            var persistedDocument = await GetDocumentForReadAsync(document.Id);
            return MapDetailDto(persistedDocument);
        }

        /// <summary>
        /// Starts extraction for one uploaded document.
        /// </summary>
        public async Task<OnboardingDocumentDetailDto> StartExtractionAsync(EntityDto<Guid> input)
        {
            var document = await GetDocumentForEditAsync(input.Id);

            _onboardingDocumentManager.MarkExtracting(document);
            await RemoveExistingProposalsAsync(document);
            await CurrentUnitOfWork.SaveChangesAsync();

            try
            {
                var candidates = await _onboardingDocumentExtractionOrchestrator.ExtractAsync(document.OnboardingPlan, document);

                if (!candidates.Any())
                {
                    throw new InvalidOperationException(
                        "No reviewable task proposals could be extracted from this document. Review the source content or enable Groq-backed document normalization.");
                }

                foreach (var candidate in candidates)
                {
                    var proposal = _onboardingDocumentManager.CreateProposal(
                        document,
                        candidate.SuggestedModuleId,
                        candidate.Title,
                        candidate.Description,
                        candidate.Category,
                        candidate.DueDayOffset,
                        candidate.AssignmentTarget,
                        candidate.AcknowledgementRule);

                    document.ExtractedTasks.Add(proposal);
                }

                _onboardingDocumentManager.MarkReadyForReview(document);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                _onboardingDocumentManager.MarkFailed(document, exception.Message);
                await CurrentUnitOfWork.SaveChangesAsync();
            }

            var persistedDocument = await GetDocumentForReadAsync(document.Id);
            return MapDetailDto(persistedDocument);
        }

        /// <summary>
        /// Updates one proposal while keeping it reviewable.
        /// </summary>
        public async Task<OnboardingDocumentDetailDto> UpdateProposalAsync(UpdateExtractedTaskProposalRequest input)
        {
            var proposal = await GetProposalForEditAsync(input.ProposalId);
            ValidateSuggestedModule(proposal.OnboardingDocument.OnboardingPlan, input.SuggestedModuleId);

            _onboardingDocumentManager.UpdateProposal(
                proposal,
                input.SuggestedModuleId,
                input.Title,
                input.Description,
                input.Category,
                input.DueDayOffset,
                input.AssignmentTarget,
                input.AcknowledgementRule);

            await CurrentUnitOfWork.SaveChangesAsync();
            var persistedDocument = await GetDocumentForReadAsync(proposal.OnboardingDocumentId);
            return MapDetailDto(persistedDocument);
        }

        /// <summary>
        /// Accepts one proposal after facilitator review.
        /// </summary>
        public async Task<OnboardingDocumentDetailDto> AcceptProposalAsync(UpdateExtractedTaskProposalRequest input)
        {
            var proposal = await GetProposalForEditAsync(input.ProposalId);
            ValidateSuggestedModule(proposal.OnboardingDocument.OnboardingPlan, input.SuggestedModuleId);

            _onboardingDocumentManager.UpdateProposal(
                proposal,
                input.SuggestedModuleId,
                input.Title,
                input.Description,
                input.Category,
                input.DueDayOffset,
                input.AssignmentTarget,
                input.AcknowledgementRule);
            _onboardingDocumentManager.AcceptProposal(proposal, GetRequiredUserId());
            _onboardingDocumentManager.RefreshCounts(proposal.OnboardingDocument);

            await CurrentUnitOfWork.SaveChangesAsync();
            var persistedDocument = await GetDocumentForReadAsync(proposal.OnboardingDocumentId);
            return MapDetailDto(persistedDocument);
        }

        /// <summary>
        /// Rejects one proposal after facilitator review.
        /// </summary>
        public async Task<OnboardingDocumentDetailDto> RejectProposalAsync(EntityDto<Guid> input)
        {
            var proposal = await GetProposalForEditAsync(input.Id);
            _onboardingDocumentManager.RejectProposal(proposal, GetRequiredUserId());
            _onboardingDocumentManager.RefreshCounts(proposal.OnboardingDocument);

            await CurrentUnitOfWork.SaveChangesAsync();
            var persistedDocument = await GetDocumentForReadAsync(proposal.OnboardingDocumentId);
            return MapDetailDto(persistedDocument);
        }

        /// <summary>
        /// Applies all currently accepted proposals to the onboarding plan without mutating existing journeys.
        /// </summary>
        public async Task<OnboardingDocumentDetailDto> ApplyAcceptedProposalsAsync(EntityDto<Guid> input)
        {
            var document = await GetDocumentForEditAsync(input.Id);
            var acceptedProposals = document.ExtractedTasks
                .Where(proposal => proposal.ReviewStatus == ExtractedTaskReviewStatus.Accepted)
                .OrderBy(proposal => proposal.CreationTime)
                .ToList();

            if (!acceptedProposals.Any())
            {
                throw new UserFriendlyException("Accept at least one proposal before applying document enrichment.");
            }

            foreach (var proposal in acceptedProposals)
            {
                if (!proposal.SuggestedModuleId.HasValue)
                {
                    throw new UserFriendlyException("Every accepted proposal must target an existing module before apply.");
                }

                var targetModule = document.OnboardingPlan.Modules.Single(module => module.Id == proposal.SuggestedModuleId.Value);
                var nextOrderIndex = targetModule.Tasks.Any()
                    ? targetModule.Tasks.Max(task => task.OrderIndex) + 1
                    : OnboardingTask.MinOrderIndex;
                var task = _onboardingPlanManager.CreateTask(
                    proposal.Title,
                    proposal.Description,
                    proposal.Category,
                    nextOrderIndex,
                    proposal.DueDayOffset,
                    proposal.AssignmentTarget,
                    proposal.AcknowledgementRule);

                _onboardingPlanManager.AddReviewedTaskToPlan(document.OnboardingPlan, targetModule.Id, task);
                _onboardingDocumentManager.MarkProposalApplied(proposal, task.Id, GetRequiredUserId());
            }

            _onboardingDocumentManager.RefreshCounts(document);

            if (document.ExtractedTasks.All(proposal =>
                    proposal.ReviewStatus == ExtractedTaskReviewStatus.Applied ||
                    proposal.ReviewStatus == ExtractedTaskReviewStatus.Rejected))
            {
                _onboardingDocumentManager.MarkApplied(document);
            }
            else
            {
                _onboardingDocumentManager.MarkReadyForReview(document);
            }

            await CurrentUnitOfWork.SaveChangesAsync();
            var persistedDocument = await GetDocumentForReadAsync(document.Id);
            return MapDetailDto(persistedDocument);
        }

        private async Task RemoveExistingProposalsAsync(OnboardingDocument document)
        {
            var existingProposals = document.ExtractedTasks.ToList();
            foreach (var proposal in existingProposals)
            {
                document.ExtractedTasks.Remove(proposal);
                await _extractedTaskRepository.DeleteAsync(proposal);
            }

            _onboardingDocumentManager.RefreshCounts(document);
        }
    }
}
