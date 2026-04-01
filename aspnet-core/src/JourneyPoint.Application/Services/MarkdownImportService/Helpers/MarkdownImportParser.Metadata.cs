using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.MarkdownImportService.Helpers
{
    /// <summary>
    /// Provides metadata parsing and preview fallback helpers for markdown import parsing.
    /// </summary>
    public partial class MarkdownImportParser
    {
        private static bool TryApplyPlanMetadata(
            MarkdownImportPreviewDto preview,
            string line,
            ICollection<MarkdownImportWarningDto> warnings,
            int lineNumber)
        {
            if (TryGetMetadataValue(line, "Target Audience", out var targetAudience) ||
                TryGetMetadataValue(line, "Audience", out targetAudience))
            {
                preview.TargetAudience = targetAudience;
                return true;
            }

            if (TryGetMetadataValue(line, "Duration Days", out var durationValue) ||
                TryGetMetadataValue(line, "Duration", out durationValue))
            {
                if (int.TryParse(durationValue, out var durationDays) &&
                    durationDays >= OnboardingPlan.MinDurationDays)
                {
                    preview.DurationDays = durationDays;
                }
                else
                {
                    warnings.Add(CreateWarning(
                        "InvalidDurationDays",
                        "Duration days could not be parsed and defaulted to 30.",
                        lineNumber,
                        null));
                }

                return true;
            }

            if (TryGetMetadataValue(line, "Description", out var description))
            {
                preview.Description = description;
                return true;
            }

            return false;
        }

        private static bool TryGetMetadataValue(string line, string label, out string value)
        {
            var prefix = $"{label}:";

            if (!line.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            {
                value = null;
                return false;
            }

            value = line.Substring(prefix.Length).Trim();
            return true;
        }

        private static void ApplyFallbacks(
            MarkdownImportPreviewDto preview,
            IReadOnlyCollection<string> prefaceLines,
            string sourceFileName,
            ICollection<MarkdownImportWarningDto> warnings)
        {
            if (string.IsNullOrWhiteSpace(preview.Name))
            {
                preview.Name = string.IsNullOrWhiteSpace(sourceFileName)
                    ? DefaultPlanName
                    : Path.GetFileNameWithoutExtension(sourceFileName);

                warnings.Add(CreateWarning(
                    "MissingPlanTitle",
                    "No top-level markdown title was found, so the plan name was derived from the file name or a default label.",
                    null,
                    null));
            }

            if (string.IsNullOrWhiteSpace(preview.Description))
            {
                preview.Description = prefaceLines.Any()
                    ? string.Join(Environment.NewLine, prefaceLines)
                    : DefaultPlanDescription;

                warnings.Add(CreateWarning(
                    "MissingPlanDescription",
                    "No explicit plan description was found, so a default or preface summary was used.",
                    null,
                    null));
            }

            if (string.IsNullOrWhiteSpace(preview.TargetAudience))
            {
                preview.TargetAudience = DefaultTargetAudience;
                warnings.Add(CreateWarning(
                    "MissingTargetAudience",
                    "No target audience was found, so the preview defaulted to General Onboarding.",
                    null,
                    null));
            }

            if (preview.DurationDays < OnboardingPlan.MinDurationDays)
            {
                preview.DurationDays = DefaultDurationDays;
                warnings.Add(CreateWarning(
                    "MissingDurationDays",
                    "No valid duration was found, so the preview defaulted to 30 days.",
                    null,
                    null));
            }

            if (!preview.Modules.Any())
            {
                warnings.Add(CreateWarning(
                    "NoModulesDetected",
                    "No module headings were detected. Add '## Module Name' sections before saving a draft.",
                    null,
                    null));
            }
        }

        private static bool CanSave(MarkdownImportPreviewDto preview)
        {
            return !string.IsNullOrWhiteSpace(preview.Name)
                && !string.IsNullOrWhiteSpace(preview.Description)
                && !string.IsNullOrWhiteSpace(preview.TargetAudience)
                && preview.DurationDays >= OnboardingPlan.MinDurationDays
                && preview.Modules.Any()
                && preview.Modules.All(module => !string.IsNullOrWhiteSpace(module.Name))
                && preview.Modules.All(module => !string.IsNullOrWhiteSpace(module.Description))
                && preview.Modules.All(module => module.Tasks.All(task =>
                    !string.IsNullOrWhiteSpace(task.Title) &&
                    !string.IsNullOrWhiteSpace(task.Description)));
        }

        private static void FinalizeModuleDescription(
            MarkdownImportPreviewModuleDto module,
            IReadOnlyCollection<string> descriptionLines)
        {
            if (module == null)
            {
                return;
            }

            module.Description = descriptionLines.Any()
                ? string.Join(Environment.NewLine, descriptionLines)
                : "Imported module description pending review.";
        }

        private static MarkdownImportWarningDto CreateWarning(
            string code,
            string message,
            int? lineNumber,
            string sectionName)
        {
            return new MarkdownImportWarningDto
            {
                Code = code,
                Message = message,
                LineNumber = lineNumber,
                SectionName = sectionName
            };
        }
    }
}
