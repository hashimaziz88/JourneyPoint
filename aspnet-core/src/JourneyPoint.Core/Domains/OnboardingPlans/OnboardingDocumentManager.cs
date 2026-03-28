using System;
using System.Linq;
using Abp.Domain.Services;

namespace JourneyPoint.Domains.OnboardingPlans
{
    /// <summary>
    /// Encapsulates aggregate rules for onboarding-document enrichment and proposal review.
    /// </summary>
    public class OnboardingDocumentManager : DomainService
    {
        /// <summary>
        /// Creates a new uploaded document record for a saved non-archived onboarding plan.
        /// </summary>
        public OnboardingDocument CreateDocument(
            OnboardingPlan plan,
            string fileName,
            string storagePath,
            string contentType,
            long fileSizeBytes)
        {
            EnsureMutablePlan(plan);

            if (fileSizeBytes < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(fileSizeBytes), "File size cannot be negative.");
            }

            return new OnboardingDocument
            {
                Id = Guid.NewGuid(),
                TenantId = plan.TenantId,
                OnboardingPlanId = plan.Id,
                FileName = NormalizeRequiredText(fileName, nameof(fileName), OnboardingDocument.MaxFileNameLength),
                StoragePath = NormalizeRequiredText(storagePath, nameof(storagePath), OnboardingDocument.MaxStoragePathLength),
                ContentType = NormalizeRequiredText(contentType, nameof(contentType), OnboardingDocument.MaxContentTypeLength),
                FileSizeBytes = fileSizeBytes,
                Status = OnboardingDocumentStatus.Uploaded,
                ExtractedTaskCount = 0,
                AcceptedTaskCount = 0,
                FailureReason = null,
                ExtractionCompletedTime = null
            };
        }

        /// <summary>
        /// Marks a document as being extracted.
        /// </summary>
        public void MarkExtracting(OnboardingDocument document)
        {
            EnsureDocument(document);
            document.Status = OnboardingDocumentStatus.Extracting;
            document.FailureReason = null;
            document.ExtractionCompletedTime = null;
        }

        /// <summary>
        /// Marks a document as failed and records the failure reason.
        /// </summary>
        public void MarkFailed(OnboardingDocument document, string failureReason)
        {
            EnsureDocument(document);
            document.Status = OnboardingDocumentStatus.Failed;
            document.FailureReason = NormalizeOptionalText(
                failureReason,
                OnboardingDocument.MaxFailureReasonLength);
            document.ExtractionCompletedTime = DateTime.UtcNow;
        }

        /// <summary>
        /// Marks a document as ready for facilitator review.
        /// </summary>
        public void MarkReadyForReview(OnboardingDocument document)
        {
            EnsureDocument(document);
            RefreshCounts(document);
            document.Status = OnboardingDocumentStatus.ReadyForReview;
            document.FailureReason = null;
            document.ExtractionCompletedTime = DateTime.UtcNow;
        }

        /// <summary>
        /// Marks a document as fully applied after all accepted proposals have been adopted.
        /// </summary>
        public void MarkApplied(OnboardingDocument document)
        {
            EnsureDocument(document);
            RefreshCounts(document);
            document.Status = OnboardingDocumentStatus.Applied;
            document.FailureReason = null;
            document.ExtractionCompletedTime ??= DateTime.UtcNow;
        }

        /// <summary>
        /// Creates a new extracted task proposal in a pending state.
        /// </summary>
        public ExtractedTask CreateProposal(
            OnboardingDocument document,
            Guid? suggestedModuleId,
            string title,
            string description,
            OnboardingTaskCategory category,
            int dueDayOffset,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule)
        {
            EnsureDocument(document);

            return new ExtractedTask
            {
                Id = Guid.NewGuid(),
                TenantId = document.TenantId,
                OnboardingDocumentId = document.Id,
                SuggestedModuleId = suggestedModuleId,
                Title = NormalizeRequiredText(title, nameof(title), ExtractedTask.MaxTitleLength),
                Description = NormalizeRequiredText(description, nameof(description), ExtractedTask.MaxDescriptionLength),
                Category = category,
                DueDayOffset = EnsureDueDayOffset(dueDayOffset),
                AssignmentTarget = assignmentTarget,
                AcknowledgementRule = acknowledgementRule,
                ReviewStatus = ExtractedTaskReviewStatus.Pending,
                ReviewedByUserId = null,
                ReviewedTime = null,
                AppliedOnboardingTaskId = null
            };
        }

        /// <summary>
        /// Updates the editable values of a proposal without changing its review state.
        /// </summary>
        public void UpdateProposal(
            ExtractedTask proposal,
            Guid? suggestedModuleId,
            string title,
            string description,
            OnboardingTaskCategory category,
            int dueDayOffset,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule)
        {
            EnsureProposalEditable(proposal);
            proposal.SuggestedModuleId = suggestedModuleId;
            proposal.Title = NormalizeRequiredText(title, nameof(title), ExtractedTask.MaxTitleLength);
            proposal.Description = NormalizeRequiredText(description, nameof(description), ExtractedTask.MaxDescriptionLength);
            proposal.Category = category;
            proposal.DueDayOffset = EnsureDueDayOffset(dueDayOffset);
            proposal.AssignmentTarget = assignmentTarget;
            proposal.AcknowledgementRule = acknowledgementRule;
        }

        /// <summary>
        /// Accepts a proposal after facilitator review.
        /// </summary>
        public void AcceptProposal(ExtractedTask proposal, long reviewedByUserId)
        {
            EnsureProposalEditable(proposal);

            if (!proposal.SuggestedModuleId.HasValue)
            {
                throw new InvalidOperationException("Accepted proposals must target an existing onboarding module.");
            }

            proposal.ReviewStatus = ExtractedTaskReviewStatus.Accepted;
            proposal.ReviewedByUserId = reviewedByUserId;
            proposal.ReviewedTime = DateTime.UtcNow;
        }

        /// <summary>
        /// Rejects a proposal after facilitator review.
        /// </summary>
        public void RejectProposal(ExtractedTask proposal, long reviewedByUserId)
        {
            EnsureProposalEditable(proposal);
            proposal.ReviewStatus = ExtractedTaskReviewStatus.Rejected;
            proposal.ReviewedByUserId = reviewedByUserId;
            proposal.ReviewedTime = DateTime.UtcNow;
        }

        /// <summary>
        /// Marks a proposal as applied to the onboarding plan.
        /// </summary>
        public void MarkProposalApplied(ExtractedTask proposal, Guid onboardingTaskId, long reviewedByUserId)
        {
            if (proposal == null)
            {
                throw new ArgumentNullException(nameof(proposal));
            }

            proposal.ReviewStatus = ExtractedTaskReviewStatus.Applied;
            proposal.AppliedOnboardingTaskId = onboardingTaskId;
            proposal.ReviewedByUserId = reviewedByUserId;
            proposal.ReviewedTime = DateTime.UtcNow;
        }

        /// <summary>
        /// Refreshes the persisted proposal counters for a document.
        /// </summary>
        public void RefreshCounts(OnboardingDocument document)
        {
            EnsureDocument(document);
            document.ExtractedTaskCount = document.ExtractedTasks.Count;
            document.AcceptedTaskCount = document.ExtractedTasks.Count(
                proposal => proposal.ReviewStatus == ExtractedTaskReviewStatus.Accepted ||
                            proposal.ReviewStatus == ExtractedTaskReviewStatus.Applied);
        }

        private static void EnsureMutablePlan(OnboardingPlan plan)
        {
            if (plan == null)
            {
                throw new ArgumentNullException(nameof(plan));
            }

            if (plan.Status == OnboardingPlanStatus.Archived)
            {
                throw new InvalidOperationException("Documents can be uploaded only to saved onboarding plans that are not archived.");
            }
        }

        private static void EnsureDocument(OnboardingDocument document)
        {
            if (document == null)
            {
                throw new ArgumentNullException(nameof(document));
            }
        }

        private static void EnsureProposalEditable(ExtractedTask proposal)
        {
            if (proposal == null)
            {
                throw new ArgumentNullException(nameof(proposal));
            }

            if (proposal.ReviewStatus == ExtractedTaskReviewStatus.Applied)
            {
                throw new InvalidOperationException("Applied proposals can no longer be edited.");
            }
        }

        private static string NormalizeRequiredText(string value, string parameterName, int maxLength)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(value, parameterName);

            var trimmedValue = value.Trim();
            if (trimmedValue.Length > maxLength)
            {
                throw new ArgumentException($"Value cannot exceed {maxLength} characters.", parameterName);
            }

            return trimmedValue;
        }

        private static string NormalizeOptionalText(string value, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            var trimmedValue = value.Trim();
            if (trimmedValue.Length > maxLength)
            {
                return trimmedValue[..maxLength];
            }

            return trimmedValue;
        }

        private static int EnsureDueDayOffset(int value)
        {
            if (value < ExtractedTask.MinDueDayOffset)
            {
                throw new ArgumentOutOfRangeException(nameof(value), "Due day offset cannot be negative.");
            }

            return value;
        }
    }
}
