using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.GroqService
{
    internal static class GroqDocumentPreviewNormalizer
    {
        private static readonly Regex NumberedModulePattern = new Regex(
            @"^(?<label>module|phase|week)\s+\d+\b(?<suffix>.*)$",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private static readonly Regex DayOffsetPattern = new Regex(
            @"\bday\s+(?<value>\d{1,3})\b",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private static readonly Regex WeekOffsetPattern = new Regex(
            @"\bweek\s+(?<value>\d{1,3})\b",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private static readonly Regex MonthOffsetPattern = new Regex(
            @"\bmonth\s+(?<value>\d{1,3})\b",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        internal static void Normalize(MarkdownImportPreviewDto preview)
        {
            preview.Modules = (preview.Modules ?? new List<MarkdownImportPreviewModuleDto>())
                .Where(module => module != null)
                .OrderBy(module => module.OrderIndex)
                .ThenBy(module => module.Name)
                .ToList();

            NormalizeModules(preview.Modules, preview.Warnings);
            NormalizeTasks(preview.Modules, preview.Warnings);

            var derivedDurationDays = DeriveDurationDays(preview.Modules);
            if (derivedDurationDays > preview.DurationDays)
            {
                preview.DurationDays = derivedDurationDays;
                AddWarning(
                    preview.Warnings,
                    "DURATION_RECALCULATED",
                    "Program duration was increased to cover the latest inferred task due-day offset.");
            }
        }

        private static void NormalizeModules(
            List<MarkdownImportPreviewModuleDto> modules,
            List<MarkdownImportWarningDto> warnings)
        {
            var seenNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            for (var moduleIndex = 0; moduleIndex < modules.Count; moduleIndex++)
            {
                var module = modules[moduleIndex];
                module.OrderIndex = moduleIndex + 1;

                var normalizedName = NormalizeModuleName(module.Name, module.OrderIndex);
                if (!string.Equals(module.Name, normalizedName, StringComparison.Ordinal))
                {
                    AddWarning(
                        warnings,
                        "MODULE_NUMBER_NORMALIZED",
                        "Module numbering was normalized to keep modules uniquely sequenced.");
                }

                while (!seenNames.Add(normalizedName))
                {
                    normalizedName = $"{normalizedName} ({module.OrderIndex})";
                    AddWarning(
                        warnings,
                        "MODULE_NAME_DEDUPED",
                        "Duplicate module names were adjusted to keep each module uniquely identifiable.");
                }

                module.Name = normalizedName;
                module.Tasks = (module.Tasks ?? new List<MarkdownImportPreviewTaskDto>())
                    .Where(task => task != null)
                    .OrderBy(task => task.OrderIndex)
                    .ThenBy(task => task.Title)
                    .ToList();
            }
        }

        private static void NormalizeTasks(
            IReadOnlyCollection<MarkdownImportPreviewModuleDto> modules,
            List<MarkdownImportWarningDto> warnings)
        {
            var latestOffset = 0;

            foreach (var module in modules)
            {
                var moduleBaseOffset = InferOffsetFromText(module.Name);

                for (var taskIndex = 0; taskIndex < module.Tasks.Count; taskIndex++)
                {
                    var task = module.Tasks[taskIndex];
                    task.OrderIndex = taskIndex + 1;

                    var normalizedOffset = NormalizeDueDayOffset(task, moduleBaseOffset, latestOffset);
                    if (normalizedOffset != task.DueDayOffset)
                    {
                        AddWarning(
                            warnings,
                            "TASK_OFFSET_NORMALIZED",
                            "Task due-day offsets were normalized to stay chronological and compatible with the program duration.");
                    }

                    task.DueDayOffset = normalizedOffset;
                    latestOffset = Math.Max(latestOffset, task.DueDayOffset);
                }
            }
        }

        private static int NormalizeDueDayOffset(
            MarkdownImportPreviewTaskDto task,
            int? moduleBaseOffset,
            int currentLatestOffset)
        {
            var inferredOffset = task.DueDayOffset > 0
                ? task.DueDayOffset
                : InferOffsetFromText($"{task.Title} {task.Description}") ?? moduleBaseOffset ?? currentLatestOffset;

            return Math.Max(inferredOffset, currentLatestOffset);
        }

        private static int DeriveDurationDays(IReadOnlyCollection<MarkdownImportPreviewModuleDto> modules)
        {
            var latestOffset = modules
                .SelectMany(module => module.Tasks)
                .Select(task => task.DueDayOffset)
                .DefaultIfEmpty(OnboardingPlan.MinDurationDays - 1)
                .Max();

            return Math.Max(OnboardingPlan.MinDurationDays, latestOffset + 1);
        }

        private static string NormalizeModuleName(string value, int moduleOrderIndex)
        {
            var normalizedValue = string.IsNullOrWhiteSpace(value)
                ? $"Module {moduleOrderIndex}"
                : value.Trim();
            if (normalizedValue.Length > OnboardingModule.MaxNameLength)
            {
                normalizedValue = normalizedValue[..OnboardingModule.MaxNameLength];
            }

            var match = NumberedModulePattern.Match(normalizedValue);
            if (!match.Success)
            {
                return normalizedValue;
            }

            var label = NormalizeModuleLabel(match.Groups["label"].Value);
            var suffix = NormalizeModuleSuffix(match.Groups["suffix"].Value);
            var repairedName = string.IsNullOrWhiteSpace(suffix)
                ? $"{label} {moduleOrderIndex}"
                : $"{label} {moduleOrderIndex}{suffix}";

            return repairedName.Length > OnboardingModule.MaxNameLength
                ? repairedName[..OnboardingModule.MaxNameLength]
                : repairedName;
        }

        private static string NormalizeModuleLabel(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return "Module";
            }

            var normalizedValue = value.Trim().ToLowerInvariant();
            return char.ToUpperInvariant(normalizedValue[0]) + normalizedValue[1..];
        }

        private static string NormalizeModuleSuffix(string suffix)
        {
            var normalizedSuffix = (suffix ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(normalizedSuffix))
            {
                return string.Empty;
            }

            normalizedSuffix = normalizedSuffix.TrimStart('-', ':').Trim();
            return string.IsNullOrWhiteSpace(normalizedSuffix)
                ? string.Empty
                : $" - {normalizedSuffix}";
        }

        private static int? InferOffsetFromText(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            var dayMatch = DayOffsetPattern.Match(value);
            if (dayMatch.Success &&
                int.TryParse(dayMatch.Groups["value"].Value, out var dayOffset))
            {
                return dayOffset;
            }

            var weekMatch = WeekOffsetPattern.Match(value);
            if (weekMatch.Success &&
                int.TryParse(weekMatch.Groups["value"].Value, out var weekOffset))
            {
                return Math.Max(0, (weekOffset - 1) * 7);
            }

            var monthMatch = MonthOffsetPattern.Match(value);
            if (monthMatch.Success &&
                int.TryParse(monthMatch.Groups["value"].Value, out var monthOffset))
            {
                return Math.Max(0, (monthOffset - 1) * 30);
            }

            return null;
        }

        private static void AddWarning(
            List<MarkdownImportWarningDto> warnings,
            string code,
            string message)
        {
            warnings ??= new List<MarkdownImportWarningDto>();

            if (warnings.Any(warning =>
                    string.Equals(warning.Code, code, StringComparison.OrdinalIgnoreCase)))
            {
                return;
            }

            warnings.Add(new MarkdownImportWarningDto
            {
                Code = code,
                Message = message
            });
        }
    }
}
