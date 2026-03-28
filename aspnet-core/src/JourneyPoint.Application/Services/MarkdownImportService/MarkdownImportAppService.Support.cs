using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Abp.UI;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Application.Services.OnboardingPlanService.Dto;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.MarkdownImportService
{
    public partial class MarkdownImportAppService
    {
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
