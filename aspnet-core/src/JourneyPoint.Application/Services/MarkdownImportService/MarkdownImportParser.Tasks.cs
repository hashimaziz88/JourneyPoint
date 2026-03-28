using System;
using System.Collections.Generic;
using System.Linq;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.MarkdownImportService
{
    /// <summary>
    /// Provides task and table parsing helpers for markdown onboarding imports.
    /// </summary>
    public partial class MarkdownImportParser
    {
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
    }
}
