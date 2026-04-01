using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using JourneyPoint.Application.Services.GroqService.Dto;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Application.Services.OnboardingDocumentService.Dto;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Application.Services.GroqService.Helpers
{
    internal static class GroqDocumentNormalizationMapper
    {
        internal static MarkdownImportPreviewDto MapImportPreview(
            GroqImportResponse payload,
            string sourceFileName)
        {
            var moduleInputs = payload.Modules ?? new List<GroqImportModule>();
            var warnings = (payload.Warnings ?? new List<JsonElement>())
                .Select(MapWarning)
                .ToList();

            var preview = new MarkdownImportPreviewDto
            {
                Name = NormalizeRequiredText(payload.Name, DerivePlanName(sourceFileName), OnboardingPlan.MaxNameLength),
                Description = NormalizeRequiredText(
                    payload.Description,
                    "Imported onboarding plan draft requiring facilitator review.",
                    OnboardingPlan.MaxDescriptionLength),
                TargetAudience = NormalizeRequiredText(
                    payload.TargetAudience,
                    "Imported hires",
                    OnboardingPlan.MaxTargetAudienceLength),
                DurationDays = payload.DurationDays > 0 ? payload.DurationDays : OnboardingPlan.MinDurationDays,
                Modules = moduleInputs
                    .Select((module, moduleIndex) => MapModule(module, moduleIndex))
                    .Where(module => module.Tasks.Count > 0)
                    .ToList(),
                Warnings = warnings
            };

            GroqDocumentPreviewNormalizer.Normalize(preview);

            preview.CanSave = preview.Modules.Count > 0 &&
                              preview.Modules.All(module => !string.IsNullOrWhiteSpace(module.Name)) &&
                              preview.Modules.All(module => module.Tasks.Count > 0) &&
                              preview.Modules.All(module => module.Tasks.All(task => !string.IsNullOrWhiteSpace(task.Title)));
            return preview;
        }

        internal static IReadOnlyCollection<ExtractedTaskCandidate> MapProposalCandidates(
            OnboardingPlan plan,
            GroqProposalResponse payload)
        {
            return (payload.Proposals ?? new List<GroqProposal>())
                .Where(proposal => !string.IsNullOrWhiteSpace(proposal.Title))
                .Select(proposal => new ExtractedTaskCandidate
                {
                    SuggestedModuleId = ResolveModuleId(plan, proposal.SuggestedModuleName),
                    Title = NormalizeRequiredText(
                        proposal.Title,
                        "Imported Task",
                        OnboardingTask.MaxTitleLength),
                    Description = NormalizeRequiredText(
                        proposal.Description,
                        proposal.Title,
                        OnboardingTask.MaxDescriptionLength),
                    Category = ParseCategory(proposal.Category),
                    DueDayOffset = Math.Max(proposal.DueDayOffset, OnboardingTask.MinDueDayOffset),
                    AssignmentTarget = ParseAssignmentTarget(proposal.AssignmentTarget),
                    AcknowledgementRule = ParseAcknowledgementRule(proposal.AcknowledgementRule)
                })
                .ToList();
        }

        private static MarkdownImportPreviewModuleDto MapModule(GroqImportModule module, int moduleIndex)
        {
            var moduleName = NormalizeRequiredText(
                module.Name,
                $"Imported Module {moduleIndex + 1}",
                OnboardingModule.MaxNameLength);

            return new MarkdownImportPreviewModuleDto
            {
                Name = moduleName,
                Description = NormalizeRequiredText(
                    module.Description,
                    $"Tasks imported for {moduleName}.",
                    OnboardingModule.MaxDescriptionLength),
                OrderIndex = module.OrderIndex > 0 ? module.OrderIndex : moduleIndex + 1,
                Tasks = (module.Tasks ?? new List<GroqImportTask>())
                    .Select((task, taskIndex) => MapTask(task, taskIndex))
                    .ToList()
            };
        }

        private static MarkdownImportPreviewTaskDto MapTask(GroqImportTask task, int taskIndex)
        {
            var title = NormalizeRequiredText(
                task.Title,
                $"Imported Task {taskIndex + 1}",
                OnboardingTask.MaxTitleLength);

            return new MarkdownImportPreviewTaskDto
            {
                Title = title,
                Description = NormalizeRequiredText(
                    task.Description,
                    title,
                    OnboardingTask.MaxDescriptionLength),
                Category = ParseCategory(task.Category),
                OrderIndex = task.OrderIndex > 0 ? task.OrderIndex : taskIndex + 1,
                DueDayOffset = Math.Max(task.DueDayOffset, OnboardingTask.MinDueDayOffset),
                AssignmentTarget = ParseAssignmentTarget(task.AssignmentTarget),
                AcknowledgementRule = ParseAcknowledgementRule(task.AcknowledgementRule)
            };
        }

        private static Guid? ResolveModuleId(OnboardingPlan plan, string moduleName)
        {
            if (!plan.Modules.Any())
            {
                return null;
            }

            if (string.IsNullOrWhiteSpace(moduleName))
            {
                return plan.Modules.OrderBy(module => module.OrderIndex).First().Id;
            }

            var normalizedModuleName = moduleName.Trim().ToLowerInvariant();
            var exactMatch = plan.Modules
                .OrderBy(module => module.OrderIndex)
                .FirstOrDefault(module => module.Name.Trim().ToLowerInvariant() == normalizedModuleName);

            if (exactMatch != null)
            {
                return exactMatch.Id;
            }

            var partialMatch = plan.Modules
                .OrderBy(module => module.OrderIndex)
                .FirstOrDefault(module =>
                {
                    var candidateName = module.Name.Trim().ToLowerInvariant();
                    return candidateName.Contains(normalizedModuleName, StringComparison.Ordinal) ||
                           normalizedModuleName.Contains(candidateName, StringComparison.Ordinal);
                });

            return partialMatch?.Id ?? plan.Modules.OrderBy(module => module.OrderIndex).First().Id;
        }

        private static OnboardingTaskCategory ParseCategory(string value)
        {
            return Enum.TryParse(value, true, out OnboardingTaskCategory parsedValue)
                ? parsedValue
                : OnboardingTaskCategory.Orientation;
        }

        private static OnboardingTaskAssignmentTarget ParseAssignmentTarget(string value)
        {
            return Enum.TryParse(value, true, out OnboardingTaskAssignmentTarget parsedValue)
                ? parsedValue
                : OnboardingTaskAssignmentTarget.Enrolee;
        }

        private static OnboardingTaskAcknowledgementRule ParseAcknowledgementRule(string value)
        {
            return Enum.TryParse(value, true, out OnboardingTaskAcknowledgementRule parsedValue)
                ? parsedValue
                : OnboardingTaskAcknowledgementRule.NotRequired;
        }

        private static MarkdownImportWarningDto MapWarning(JsonElement warningElement)
        {
            if (warningElement.ValueKind == JsonValueKind.String)
            {
                return new MarkdownImportWarningDto
                {
                    Code = "AI_INFERENCE",
                    Message = NormalizeWarningMessage(warningElement.GetString())
                };
            }

            if (warningElement.ValueKind != JsonValueKind.Object)
            {
                return new MarkdownImportWarningDto
                {
                    Code = "AI_INFERENCE",
                    Message = "The import required AI-assisted inference."
                };
            }

            var code = ReadWarningString(warningElement, "code");
            var message = ReadWarningString(warningElement, "message");

            return new MarkdownImportWarningDto
            {
                Code = string.IsNullOrWhiteSpace(code) ? "AI_INFERENCE" : code.Trim(),
                Message = NormalizeWarningMessage(message),
                LineNumber = ReadWarningInt32(warningElement, "lineNumber"),
                SectionName = ReadWarningString(warningElement, "sectionName")
            };
        }

        private static string NormalizeWarningMessage(string message)
        {
            return string.IsNullOrWhiteSpace(message)
                ? "The import required AI-assisted inference."
                : message.Trim();
        }

        private static string ReadWarningString(JsonElement warningElement, string propertyName)
        {
            if (!warningElement.TryGetProperty(propertyName, out var propertyValue))
            {
                return null;
            }

            return propertyValue.ValueKind switch
            {
                JsonValueKind.String => propertyValue.GetString(),
                JsonValueKind.Number => propertyValue.GetRawText(),
                JsonValueKind.True => bool.TrueString,
                JsonValueKind.False => bool.FalseString,
                _ => null
            };
        }

        private static int? ReadWarningInt32(JsonElement warningElement, string propertyName)
        {
            if (!warningElement.TryGetProperty(propertyName, out var propertyValue))
            {
                return null;
            }

            if (propertyValue.ValueKind == JsonValueKind.Number &&
                propertyValue.TryGetInt32(out var lineNumber))
            {
                return lineNumber;
            }

            if (propertyValue.ValueKind == JsonValueKind.String &&
                int.TryParse(propertyValue.GetString(), out lineNumber))
            {
                return lineNumber;
            }

            return null;
        }

        private static string NormalizeRequiredText(string value, string fallback, int maxLength)
        {
            var normalizedValue = string.IsNullOrWhiteSpace(value) ? fallback : value.Trim();
            if (normalizedValue.Length > maxLength)
            {
                return normalizedValue[..maxLength];
            }

            return normalizedValue;
        }

        private static string DerivePlanName(string sourceFileName)
        {
            if (string.IsNullOrWhiteSpace(sourceFileName))
            {
                return "Imported Onboarding Plan";
            }

            var fileName = System.IO.Path.GetFileNameWithoutExtension(sourceFileName)?.Trim();
            return string.IsNullOrWhiteSpace(fileName)
                ? "Imported Onboarding Plan"
                : fileName;
        }
    }
}
