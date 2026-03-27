using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.UI;
using JourneyPoint.Application.Services.OnboardingDocumentService.Dto;
using JourneyPoint.Authorization;
using JourneyPoint.Domains.OnboardingPlans;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.OnboardingDocumentService
{
    /// <summary>
    /// Provides plan-level document upload, extraction orchestration, and facilitator review operations.
    /// </summary>
    [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
    public class OnboardingDocumentAppService : JourneyPointAppServiceBase, IOnboardingDocumentAppService
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
                        "No reviewable task proposals could be extracted from this document. Use structured markdown or a text-based PDF.");
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
        /// Applies all currently accepted proposals to the published onboarding plan.
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

                _onboardingPlanManager.AddReviewedTaskToPublishedPlan(document.OnboardingPlan, targetModule.Id, task);
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

        private async Task<OnboardingPlan> GetPlanForReadAsync(Guid planId)
        {
            var tenantId = GetRequiredTenantId();
            var plan = await _onboardingPlanRepository.GetAll()
                .AsNoTracking()
                .Where(planEntity => planEntity.TenantId == tenantId && planEntity.Id == planId)
                .Include(planEntity => planEntity.Documents)
                .ThenInclude(document => document.ExtractedTasks)
                .Include(planEntity => planEntity.Modules)
                .ThenInclude(module => module.Tasks)
                .SingleOrDefaultAsync();

            if (plan == null)
            {
                throw new EntityNotFoundException(typeof(OnboardingPlan), planId);
            }

            return plan;
        }

        private async Task<OnboardingPlan> GetPlanForEditAsync(Guid planId)
        {
            var tenantId = GetRequiredTenantId();
            var plan = await _onboardingPlanRepository.GetAll()
                .Where(planEntity => planEntity.TenantId == tenantId && planEntity.Id == planId)
                .Include(planEntity => planEntity.Documents)
                .ThenInclude(document => document.ExtractedTasks)
                .Include(planEntity => planEntity.Modules)
                .ThenInclude(module => module.Tasks)
                .SingleOrDefaultAsync();

            if (plan == null)
            {
                throw new EntityNotFoundException(typeof(OnboardingPlan), planId);
            }

            return plan;
        }

        private async Task<OnboardingDocument> GetDocumentForReadAsync(Guid documentId)
        {
            var tenantId = GetRequiredTenantId();
            var document = await _onboardingDocumentRepository.GetAll()
                .AsNoTracking()
                .Where(documentEntity => documentEntity.TenantId == tenantId && documentEntity.Id == documentId)
                .Include(documentEntity => documentEntity.ExtractedTasks)
                .Include(documentEntity => documentEntity.OnboardingPlan)
                .ThenInclude(plan => plan.Modules)
                .ThenInclude(module => module.Tasks)
                .SingleOrDefaultAsync();

            if (document == null)
            {
                throw new EntityNotFoundException(typeof(OnboardingDocument), documentId);
            }

            return document;
        }

        private async Task<OnboardingDocument> GetDocumentForEditAsync(Guid documentId)
        {
            var tenantId = GetRequiredTenantId();
            var document = await _onboardingDocumentRepository.GetAll()
                .Where(documentEntity => documentEntity.TenantId == tenantId && documentEntity.Id == documentId)
                .Include(documentEntity => documentEntity.ExtractedTasks)
                .Include(documentEntity => documentEntity.OnboardingPlan)
                .ThenInclude(plan => plan.Modules)
                .ThenInclude(module => module.Tasks)
                .SingleOrDefaultAsync();

            if (document == null)
            {
                throw new EntityNotFoundException(typeof(OnboardingDocument), documentId);
            }

            return document;
        }

        private async Task<ExtractedTask> GetProposalForEditAsync(Guid proposalId)
        {
            var tenantId = GetRequiredTenantId();
            var proposal = await _extractedTaskRepository.GetAll()
                .Where(task => task.TenantId == tenantId && task.Id == proposalId)
                .Include(task => task.OnboardingDocument)
                .ThenInclude(document => document.OnboardingPlan)
                .ThenInclude(plan => plan.Modules)
                .ThenInclude(module => module.Tasks)
                .Include(task => task.OnboardingDocument)
                .ThenInclude(document => document.ExtractedTasks)
                .SingleOrDefaultAsync();

            if (proposal == null)
            {
                throw new EntityNotFoundException(typeof(ExtractedTask), proposalId);
            }

            return proposal;
        }

        private static OnboardingDocumentListItemDto MapListItemDto(OnboardingDocument document)
        {
            return new OnboardingDocumentListItemDto
            {
                Id = document.Id,
                PlanId = document.OnboardingPlanId,
                FileName = document.FileName,
                ContentType = document.ContentType,
                FileSizeBytes = document.FileSizeBytes,
                Status = document.Status,
                ExtractedTaskCount = document.ExtractedTaskCount,
                AcceptedTaskCount = document.AcceptedTaskCount,
                AppliedTaskCount = document.ExtractedTasks.Count(proposal => proposal.ReviewStatus == ExtractedTaskReviewStatus.Applied),
                FailureReason = document.FailureReason,
                CreationTime = document.CreationTime,
                ExtractionCompletedTime = document.ExtractionCompletedTime
            };
        }

        private static OnboardingDocumentDetailDto MapDetailDto(OnboardingDocument document)
        {
            return new OnboardingDocumentDetailDto
            {
                Id = document.Id,
                PlanId = document.OnboardingPlanId,
                PlanName = document.OnboardingPlan?.Name,
                FileName = document.FileName,
                ContentType = document.ContentType,
                FileSizeBytes = document.FileSizeBytes,
                Status = document.Status,
                ExtractedTaskCount = document.ExtractedTaskCount,
                AcceptedTaskCount = document.AcceptedTaskCount,
                AppliedTaskCount = document.ExtractedTasks.Count(proposal => proposal.ReviewStatus == ExtractedTaskReviewStatus.Applied),
                FailureReason = document.FailureReason,
                CreationTime = document.CreationTime,
                ExtractionCompletedTime = document.ExtractionCompletedTime,
                AvailableModules = document.OnboardingPlan?.Modules
                    .OrderBy(module => module.OrderIndex)
                    .Select(module => new DocumentModuleOptionDto
                    {
                        Id = module.Id,
                        Name = module.Name,
                        OrderIndex = module.OrderIndex
                    })
                    .ToList() ?? new List<DocumentModuleOptionDto>(),
                Proposals = document.ExtractedTasks
                    .OrderBy(proposal => proposal.CreationTime)
                    .Select(proposal => new ExtractedTaskProposalDto
                    {
                        Id = proposal.Id,
                        SuggestedModuleId = proposal.SuggestedModuleId,
                        Title = proposal.Title,
                        Description = proposal.Description,
                        Category = proposal.Category,
                        DueDayOffset = proposal.DueDayOffset,
                        AssignmentTarget = proposal.AssignmentTarget,
                        AcknowledgementRule = proposal.AcknowledgementRule,
                        ReviewStatus = proposal.ReviewStatus,
                        ReviewedByUserId = proposal.ReviewedByUserId,
                        ReviewedTime = proposal.ReviewedTime,
                        AppliedOnboardingTaskId = proposal.AppliedOnboardingTaskId
                    })
                    .ToList()
            };
        }

        private static byte[] DecodeAndValidateFile(string base64Content)
        {
            if (string.IsNullOrWhiteSpace(base64Content))
            {
                throw new UserFriendlyException("Document content is required.");
            }

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

            if (fileBytes.Length > MaximumUploadSizeBytes)
            {
                throw new UserFriendlyException("Uploaded documents must be 10 MB or smaller.");
            }

            return fileBytes;
        }

        private static string NormalizeContentType(string contentType, string fileName)
        {
            var normalizedContentType = string.IsNullOrWhiteSpace(contentType)
                ? "application/octet-stream"
                : contentType.Trim();
            var extension = Path.GetExtension(fileName);

            if (extension.Equals(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                return "application/pdf";
            }

            if (extension.Equals(".md", StringComparison.OrdinalIgnoreCase) ||
                extension.Equals(".markdown", StringComparison.OrdinalIgnoreCase))
            {
                return "text/markdown";
            }

            if (normalizedContentType.Equals("text/plain", StringComparison.OrdinalIgnoreCase))
            {
                return normalizedContentType;
            }

            throw new UserFriendlyException("Only markdown and PDF documents are supported.");
        }

        private static void ValidateSuggestedModule(OnboardingPlan plan, Guid? suggestedModuleId)
        {
            if (!suggestedModuleId.HasValue)
            {
                return;
            }

            if (!plan.Modules.Any(module => module.Id == suggestedModuleId.Value))
            {
                throw new UserFriendlyException("The selected module does not belong to the current onboarding plan.");
            }
        }

        private int GetRequiredTenantId()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                throw new AbpAuthorizationException("Onboarding document enrichment requires a tenant context.");
            }

            return AbpSession.TenantId.Value;
        }

        private long GetRequiredUserId()
        {
            if (!AbpSession.UserId.HasValue)
            {
                throw new AbpAuthorizationException("A signed-in user is required to review extracted proposals.");
            }

            return AbpSession.UserId.Value;
        }
    }
}
