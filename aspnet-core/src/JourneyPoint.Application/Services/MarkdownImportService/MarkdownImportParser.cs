using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Abp.Dependency;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.MarkdownImportService
{
    /// <summary>
    /// Parses structured markdown into onboarding preview data and review warnings.
    /// </summary>
    public class MarkdownImportParser : ITransientDependency
    {
        private const string DefaultPlanName = "Imported Onboarding Plan";
        private const string DefaultPlanDescription = "Imported from structured markdown.";
        private const string DefaultTargetAudience = "General Onboarding";
        private const int DefaultDurationDays = 30;
        private const string TitleHeaderKey = "title";
        private const string DescriptionHeaderKey = "description";
        private const string CategoryHeaderKey = "category";
        private const string DueDayOffsetHeaderKey = "dueDayOffset";
        private const string AssignmentTargetHeaderKey = "assignmentTarget";
        private const string AcknowledgementRuleHeaderKey = "acknowledgementRule";

        /// <summary>
        /// Parses markdown content into a preview DTO that can be reviewed before save.
        /// </summary>
        public MarkdownImportPreviewDto Parse(string markdownContent, string sourceFileName)
        {
            if (string.IsNullOrWhiteSpace(markdownContent))
            {
                throw new ArgumentException("Markdown content is required.", nameof(markdownContent));
            }

            var preview = new MarkdownImportPreviewDto();
            var warnings = new List<MarkdownImportWarningDto>();
            var lines = markdownContent.Replace("\r\n", "\n").Split('\n');
            var prefaceLines = new List<string>();
            var currentModuleDescriptionLines = new List<string>();
            MarkdownImportPreviewModuleDto currentModule = null;
            var index = 0;

            while (index < lines.Length)
            {
                var trimmedLine = lines[index].Trim();

                if (TryHandleBlankOrPlanTitle(preview, trimmedLine, ref index))
                {
                    continue;
                }

                if (TryStartModule(
                    preview,
                    trimmedLine,
                    currentModule,
                    currentModuleDescriptionLines,
                    out currentModule))
                {
                    index++;
                    continue;
                }

                if (TryHandlePrefaceContent(
                    preview,
                    trimmedLine,
                    warnings,
                    prefaceLines,
                    currentModule,
                    ref index))
                {
                    continue;
                }

                if (TryHandleModuleContent(
                    lines,
                    trimmedLine,
                    currentModule,
                    currentModuleDescriptionLines,
                    warnings,
                    ref index))
                {
                    continue;
                }

                currentModuleDescriptionLines.Add(trimmedLine);
                index++;
            }

            FinalizeModuleDescription(currentModule, currentModuleDescriptionLines);
            ApplyFallbacks(preview, prefaceLines, sourceFileName, warnings);
            preview.Warnings = warnings;
            preview.CanSave = CanSave(preview);

            return preview;
        }

        private static bool TryHandleBlankOrPlanTitle(
            MarkdownImportPreviewDto preview,
            string trimmedLine,
            ref int index)
        {
            if (string.IsNullOrWhiteSpace(trimmedLine))
            {
                index++;
                return true;
            }

            if (!TryApplyPlanTitle(preview, trimmedLine))
            {
                return false;
            }

            index++;
            return true;
        }

        private static bool TryHandlePrefaceContent(
            MarkdownImportPreviewDto preview,
            string trimmedLine,
            ICollection<MarkdownImportWarningDto> warnings,
            List<string> prefaceLines,
            MarkdownImportPreviewModuleDto currentModule,
            ref int index)
        {
            if (currentModule != null)
            {
                return false;
            }

            if (TryApplyPlanMetadata(preview, trimmedLine, warnings, index + 1))
            {
                index++;
                return true;
            }

            prefaceLines.Add(trimmedLine);
            index++;
            return true;
        }

        private static bool TryHandleModuleContent(
            string[] lines,
            string trimmedLine,
            MarkdownImportPreviewModuleDto currentModule,
            List<string> currentModuleDescriptionLines,
            ICollection<MarkdownImportWarningDto> warnings,
            ref int index)
        {
            if (currentModule == null)
            {
                return false;
            }

            if (IsTableRow(trimmedLine))
            {
                FinalizeModuleDescription(currentModule, currentModuleDescriptionLines);
                currentModuleDescriptionLines.Clear();
                var rowStartLineNumber = index + 1;
                var tableLines = ReadTableLines(lines, ref index);
                ParseTable(currentModule, tableLines, warnings, rowStartLineNumber);
                return true;
            }

            if (!trimmedLine.StartsWith("- ", StringComparison.Ordinal))
            {
                return false;
            }

            FinalizeModuleDescription(currentModule, currentModuleDescriptionLines);
            currentModuleDescriptionLines.Clear();
            ParseListTask(currentModule, trimmedLine.Substring(2).Trim(), warnings, index + 1);
            index++;
            return true;
        }

        private static bool TryApplyPlanTitle(MarkdownImportPreviewDto preview, string trimmedLine)
        {
            if (!string.IsNullOrWhiteSpace(preview.Name) ||
                !trimmedLine.StartsWith("# ", StringComparison.Ordinal))
            {
                return false;
            }

            preview.Name = trimmedLine.Substring(2).Trim();
            return true;
        }

        private static bool TryStartModule(
            MarkdownImportPreviewDto preview,
            string trimmedLine,
            MarkdownImportPreviewModuleDto currentModule,
            List<string> currentModuleDescriptionLines,
            out MarkdownImportPreviewModuleDto nextModule)
        {
            if (!trimmedLine.StartsWith("## ", StringComparison.Ordinal))
            {
                nextModule = currentModule;
                return false;
            }

            FinalizeModuleDescription(currentModule, currentModuleDescriptionLines);
            currentModuleDescriptionLines.Clear();

            nextModule = new MarkdownImportPreviewModuleDto
            {
                Name = trimmedLine.Substring(3).Trim(),
                Description = string.Empty,
                OrderIndex = preview.Modules.Count + 1
            };

            preview.Modules.Add(nextModule);
            return true;
        }

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

        private static List<string> ReadTableLines(string[] lines, ref int index)
        {
            var tableLines = new List<string>();

            while (index < lines.Length && IsTableRow(lines[index].Trim()))
            {
                tableLines.Add(lines[index].Trim());
                index++;
            }

            return tableLines;
        }

        private static void ParseTable(
            MarkdownImportPreviewModuleDto module,
            IReadOnlyList<string> tableLines,
            ICollection<MarkdownImportWarningDto> warnings,
            int startingLineNumber)
        {
            if (tableLines.Count < 2)
            {
                warnings.Add(CreateWarning(
                    "IncompleteTable",
                    "A markdown table was detected but did not contain enough rows to parse tasks.",
                    startingLineNumber,
                    module.Name));
                return;
            }

            var headerCells = SplitMarkdownRow(tableLines[0]);
            var headerMap = BuildHeaderMap(headerCells, warnings, startingLineNumber, module.Name);

            if (!headerMap.ContainsKey(TitleHeaderKey))
            {
                warnings.Add(CreateWarning(
                    "MissingTitleColumn",
                    "Task rows were ignored because no task title column could be identified.",
                    startingLineNumber,
                    module.Name));
                return;
            }

            for (var rowIndex = 2; rowIndex < tableLines.Count; rowIndex++)
            {
                var rowCells = SplitMarkdownRow(tableLines[rowIndex]);

                if (rowCells.Count == 0)
                {
                    continue;
                }

                while (rowCells.Count < headerCells.Count)
                {
                    rowCells.Add(string.Empty);
                }

                var task = CreateTaskFromCells(
                    rowCells,
                    headerMap,
                    warnings,
                    startingLineNumber + rowIndex,
                    module.Name,
                    module.Tasks.Count + 1);

                if (task != null)
                {
                    module.Tasks.Add(task);
                }
            }
        }

        private static void ParseListTask(
            MarkdownImportPreviewModuleDto module,
            string listContent,
            ICollection<MarkdownImportWarningDto> warnings,
            int lineNumber)
        {
            var parts = listContent.Split('|').Select(part => part.Trim()).ToList();

            if (parts.Count < 2)
            {
                warnings.Add(CreateWarning(
                    "InvalidListTaskFormat",
                    "List-based task rows must include at least a title and description separated by '|'.",
                    lineNumber,
                    module.Name));
                return;
            }

            module.Tasks.Add(new MarkdownImportPreviewTaskDto
            {
                Title = parts[0],
                Description = parts[1],
                Category = ParseCategory(parts.ElementAtOrDefault(2), warnings, lineNumber, module.Name),
                OrderIndex = module.Tasks.Count + 1,
                DueDayOffset = ParseDueDayOffset(parts.ElementAtOrDefault(3), warnings, lineNumber, module.Name),
                AssignmentTarget = ParseAssignmentTarget(parts.ElementAtOrDefault(4), warnings, lineNumber, module.Name),
                AcknowledgementRule = ParseAcknowledgementRule(parts.ElementAtOrDefault(5), warnings, lineNumber, module.Name)
            });
        }

        private static Dictionary<string, int> BuildHeaderMap(
            IReadOnlyList<string> headerCells,
            ICollection<MarkdownImportWarningDto> warnings,
            int lineNumber,
            string sectionName)
        {
            var headerMap = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

            for (var index = 0; index < headerCells.Count; index++)
            {
                var normalizedHeader = NormalizeHeader(headerCells[index]);

                if (normalizedHeader == null)
                {
                    warnings.Add(CreateWarning(
                        "UnknownTaskColumn",
                        $"The column '{headerCells[index]}' is not recognised and will be ignored.",
                        lineNumber,
                        sectionName));
                    continue;
                }

                if (!headerMap.ContainsKey(normalizedHeader))
                {
                    headerMap.Add(normalizedHeader, index);
                }
            }

            return headerMap;
        }

        private static MarkdownImportPreviewTaskDto CreateTaskFromCells(
            IReadOnlyList<string> rowCells,
            IReadOnlyDictionary<string, int> headerMap,
            ICollection<MarkdownImportWarningDto> warnings,
            int lineNumber,
            string sectionName,
            int orderIndex)
        {
            var title = GetCell(rowCells, headerMap, TitleHeaderKey);
            var description = GetCell(rowCells, headerMap, DescriptionHeaderKey);

            if (string.IsNullOrWhiteSpace(title) && string.IsNullOrWhiteSpace(description))
            {
                warnings.Add(CreateWarning(
                    "EmptyTaskRow",
                    "A task row was ignored because both title and description were empty.",
                    lineNumber,
                    sectionName));
                return null;
            }

            return new MarkdownImportPreviewTaskDto
            {
                Title = title ?? string.Empty,
                Description = description ?? string.Empty,
                Category = ParseCategory(GetCell(rowCells, headerMap, CategoryHeaderKey), warnings, lineNumber, sectionName),
                OrderIndex = orderIndex,
                DueDayOffset = ParseDueDayOffset(GetCell(rowCells, headerMap, DueDayOffsetHeaderKey), warnings, lineNumber, sectionName),
                AssignmentTarget = ParseAssignmentTarget(GetCell(rowCells, headerMap, AssignmentTargetHeaderKey), warnings, lineNumber, sectionName),
                AcknowledgementRule = ParseAcknowledgementRule(GetCell(rowCells, headerMap, AcknowledgementRuleHeaderKey), warnings, lineNumber, sectionName)
            };
        }

        private static string GetCell(
            IReadOnlyList<string> rowCells,
            IReadOnlyDictionary<string, int> headerMap,
            string key)
        {
            return headerMap.TryGetValue(key, out var index) && index < rowCells.Count
                ? rowCells[index]
                : null;
        }

        private static OnboardingTaskCategory ParseCategory(
            string value,
            ICollection<MarkdownImportWarningDto> warnings,
            int lineNumber,
            string sectionName)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return OnboardingTaskCategory.Orientation;
            }

            var normalizedValue = value.Replace("-", string.Empty).Replace(" ", string.Empty);

            if (Enum.TryParse(normalizedValue, true, out OnboardingTaskCategory category))
            {
                return category;
            }

            warnings.Add(CreateWarning(
                "InvalidTaskCategory",
                $"The task category '{value}' was not recognised and defaulted to Orientation.",
                lineNumber,
                sectionName));

            return OnboardingTaskCategory.Orientation;
        }

        private static int ParseDueDayOffset(
            string value,
            ICollection<MarkdownImportWarningDto> warnings,
            int lineNumber,
            string sectionName)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return 0;
            }

            if (int.TryParse(value, out var dueDayOffset) &&
                dueDayOffset >= OnboardingTask.MinDueDayOffset)
            {
                return dueDayOffset;
            }

            warnings.Add(CreateWarning(
                "InvalidDueDayOffset",
                $"The due day offset '{value}' was not recognised and defaulted to 0.",
                lineNumber,
                sectionName));

            return 0;
        }

        private static OnboardingTaskAssignmentTarget ParseAssignmentTarget(
            string value,
            ICollection<MarkdownImportWarningDto> warnings,
            int lineNumber,
            string sectionName)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return OnboardingTaskAssignmentTarget.Enrolee;
            }

            var normalizedValue = value.Replace("-", string.Empty).Replace(" ", string.Empty);

            if (Enum.TryParse(normalizedValue, true, out OnboardingTaskAssignmentTarget assignmentTarget))
            {
                return assignmentTarget;
            }

            warnings.Add(CreateWarning(
                "InvalidAssignmentTarget",
                $"The assignment target '{value}' was not recognised and defaulted to Enrolee.",
                lineNumber,
                sectionName));

            return OnboardingTaskAssignmentTarget.Enrolee;
        }

        private static OnboardingTaskAcknowledgementRule ParseAcknowledgementRule(
            string value,
            ICollection<MarkdownImportWarningDto> warnings,
            int lineNumber,
            string sectionName)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return OnboardingTaskAcknowledgementRule.NotRequired;
            }

            var normalizedValue = value.Replace("-", string.Empty).Replace(" ", string.Empty);

            if (normalizedValue.Equals("Yes", StringComparison.OrdinalIgnoreCase) ||
                normalizedValue.Equals("True", StringComparison.OrdinalIgnoreCase))
            {
                return OnboardingTaskAcknowledgementRule.Required;
            }

            if (normalizedValue.Equals("No", StringComparison.OrdinalIgnoreCase) ||
                normalizedValue.Equals("False", StringComparison.OrdinalIgnoreCase))
            {
                return OnboardingTaskAcknowledgementRule.NotRequired;
            }

            if (Enum.TryParse(normalizedValue, true, out OnboardingTaskAcknowledgementRule acknowledgementRule))
            {
                return acknowledgementRule;
            }

            warnings.Add(CreateWarning(
                "InvalidAcknowledgementRule",
                $"The acknowledgement rule '{value}' was not recognised and defaulted to NotRequired.",
                lineNumber,
                sectionName));

            return OnboardingTaskAcknowledgementRule.NotRequired;
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

        private static bool IsTableRow(string line)
        {
            return !string.IsNullOrWhiteSpace(line) && line[0] == '|';
        }

        private static string NormalizeHeader(string headerCell)
        {
            var normalizedHeader = headerCell
                .Trim()
                .ToLowerInvariant()
                .Replace("-", string.Empty)
                .Replace(" ", string.Empty);

            switch (normalizedHeader)
            {
                case TitleHeaderKey:
                case "task":
                case "tasktitle":
                    return TitleHeaderKey;
                case DescriptionHeaderKey:
                case "details":
                case "taskdescription":
                    return DescriptionHeaderKey;
                case "category":
                case "type":
                    return CategoryHeaderKey;
                case "duedayoffset":
                case "dayoffset":
                case "duedays":
                case "due":
                    return DueDayOffsetHeaderKey;
                case "assignmenttarget":
                case "assignedto":
                case "owner":
                    return AssignmentTargetHeaderKey;
                case "acknowledgement":
                case "acknowledgementrule":
                case "acknowledgment":
                case "ack":
                    return AcknowledgementRuleHeaderKey;
                default:
                    return null;
            }
        }

        private static List<string> SplitMarkdownRow(string row)
        {
            return row
                .Trim()
                .Trim('|')
                .Split('|')
                .Select(cell => cell.Trim())
                .ToList();
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
