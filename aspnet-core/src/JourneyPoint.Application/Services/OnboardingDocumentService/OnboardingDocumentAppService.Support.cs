using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Abp.UI;
using JourneyPoint.Application.Services.OnboardingDocumentService.Dto;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingDocumentService
{
    public partial class OnboardingDocumentAppService
    {
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

            if (normalizedContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                return normalizedContentType;
            }

            throw new UserFriendlyException("Only markdown, plain-text, PDF, PNG, JPG, JPEG, and WEBP documents are supported.");
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
    }
}
