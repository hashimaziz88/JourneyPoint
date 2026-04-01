using System;
using System.Collections.Generic;
using Abp.Dependency;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;

namespace JourneyPoint.Application.Services.MarkdownImportService.Helpers
{
    /// <summary>
    /// Parses structured markdown into onboarding preview data and review warnings.
    /// </summary>
    public partial class MarkdownImportParser : ITransientDependency
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
    }
}
