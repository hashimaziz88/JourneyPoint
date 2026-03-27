using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Dependency;
using JourneyPoint.Application.Services.MarkdownImportService;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingDocumentService
{
    /// <summary>
    /// Extracts reviewable task proposals from uploaded onboarding documents.
    /// </summary>
    public class OnboardingDocumentExtractionOrchestrator : ITransientDependency
    {
        private static readonly string[] MarkdownExtensions = [".md", ".markdown"];
        private static readonly string[] PdfToTextCandidatesWindows =
        [
            "pdftotext.exe",
            @"C:\Program Files\Git\mingw64\bin\pdftotext.exe",
            @"C:\Program Files\poppler\Library\bin\pdftotext.exe"
        ];
        private static readonly string[] PdfToTextCandidatesUnix =
        [
            "pdftotext",
            "/usr/bin/pdftotext",
            "/usr/local/bin/pdftotext"
        ];

        private readonly IOnboardingDocumentStorage _onboardingDocumentStorage;
        private readonly MarkdownImportParser _markdownImportParser;

        /// <summary>
        /// Initializes a new instance of the <see cref="OnboardingDocumentExtractionOrchestrator"/> class.
        /// </summary>
        public OnboardingDocumentExtractionOrchestrator(
            IOnboardingDocumentStorage onboardingDocumentStorage,
            MarkdownImportParser markdownImportParser)
        {
            _onboardingDocumentStorage = onboardingDocumentStorage;
            _markdownImportParser = markdownImportParser;
        }

        /// <summary>
        /// Extracts one collection of reviewable task candidates from a stored document.
        /// </summary>
        public async Task<IReadOnlyCollection<ExtractedTaskCandidate>> ExtractAsync(
            OnboardingPlan plan,
            OnboardingDocument document)
        {
            if (plan == null)
            {
                throw new ArgumentNullException(nameof(plan));
            }

            if (document == null)
            {
                throw new ArgumentNullException(nameof(document));
            }

            var content = await _onboardingDocumentStorage.ReadAsync(document.StoragePath);

            if (IsMarkdownDocument(document))
            {
                var markdownContent = Encoding.UTF8.GetString(content);
                return ExtractFromMarkdown(plan, markdownContent, document.FileName);
            }

            if (IsPdfDocument(document))
            {
                var extractedText = await ExtractPdfTextAsync(content);

                if (string.IsNullOrWhiteSpace(extractedText) ||
                    extractedText.All(character => char.IsWhiteSpace(character) || char.IsControl(character)))
                {
                    throw new InvalidOperationException(
                        "The PDF did not contain extractable text. Scanned or image-only PDFs are not supported by the current extractor.");
                }

                return ExtractFromPlainText(plan, extractedText);
            }

            throw new InvalidOperationException("Only markdown and PDF documents are supported for plan enrichment.");
        }

        private IReadOnlyCollection<ExtractedTaskCandidate> ExtractFromMarkdown(
            OnboardingPlan plan,
            string markdownContent,
            string sourceFileName)
        {
            var preview = _markdownImportParser.Parse(markdownContent, sourceFileName);

            return preview.Modules
                .OrderBy(module => module.OrderIndex)
                .SelectMany(module => module.Tasks.Select(task => new ExtractedTaskCandidate
                {
                    SuggestedModuleId = ResolveModuleId(plan, module.Name),
                    Title = task.Title,
                    Description = task.Description,
                    Category = task.Category,
                    DueDayOffset = task.DueDayOffset,
                    AssignmentTarget = task.AssignmentTarget,
                    AcknowledgementRule = task.AcknowledgementRule
                }))
                .ToList();
        }

        private IReadOnlyCollection<ExtractedTaskCandidate> ExtractFromPlainText(OnboardingPlan plan, string extractedText)
        {
            var orderedModules = plan.Modules.OrderBy(module => module.OrderIndex).ToList();

            if (!orderedModules.Any())
            {
                return [];
            }

            var currentModuleId = orderedModules[0].Id;
            var candidates = new List<ExtractedTaskCandidate>();
            var fallbackLines = new List<string>();

            foreach (var rawLine in SplitLines(extractedText))
            {
                var line = rawLine.Trim();

                if (string.IsNullOrWhiteSpace(line))
                {
                    continue;
                }

                if (TryResolveModuleHeading(plan, line, out var matchedModuleId))
                {
                    currentModuleId = matchedModuleId;
                    continue;
                }

                if (TryExtractTaskText(line, out var taskText))
                {
                    candidates.Add(CreateDefaultCandidate(currentModuleId, taskText));
                    continue;
                }

                if (IsFallbackCandidate(line))
                {
                    fallbackLines.Add(line);
                }
            }

            if (candidates.Any())
            {
                return candidates;
            }

            return fallbackLines
                .Take(10)
                .Select(line => CreateDefaultCandidate(orderedModules[0].Id, line))
                .ToList();
        }

        private async Task<string> ExtractPdfTextAsync(byte[] content)
        {
            var executablePath = ResolvePdfToTextExecutable();

            if (string.IsNullOrWhiteSpace(executablePath))
            {
                throw new InvalidOperationException("PDF extraction is unavailable because pdftotext could not be found on the host.");
            }

            var tempDirectory = Path.Combine(Path.GetTempPath(), "journeypoint-document-extraction", Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(tempDirectory);

            var inputPath = Path.Combine(tempDirectory, "source.pdf");
            var outputPath = Path.Combine(tempDirectory, "source.txt");

            try
            {
                await File.WriteAllBytesAsync(inputPath, content);

                var startInfo = new ProcessStartInfo
                {
                    FileName = executablePath,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                };
                startInfo.ArgumentList.Add("-layout");
                startInfo.ArgumentList.Add("-enc");
                startInfo.ArgumentList.Add("UTF-8");
                startInfo.ArgumentList.Add(inputPath);
                startInfo.ArgumentList.Add(outputPath);

                using var process = Process.Start(startInfo);
                if (process == null)
                {
                    throw new InvalidOperationException("The PDF extraction process could not be started.");
                }

                await process.WaitForExitAsync();

                if (process.ExitCode != 0)
                {
                    var standardError = await process.StandardError.ReadToEndAsync();
                    throw new InvalidOperationException(
                        string.IsNullOrWhiteSpace(standardError)
                            ? "PDF extraction failed."
                            : $"PDF extraction failed: {standardError.Trim()}");
                }

                return await File.ReadAllTextAsync(outputPath, Encoding.UTF8);
            }
            finally
            {
                if (Directory.Exists(tempDirectory))
                {
                    Directory.Delete(tempDirectory, true);
                }
            }
        }

        private static IEnumerable<string> SplitLines(string value)
        {
            return (value ?? string.Empty)
                .Replace("\r\n", "\n", StringComparison.Ordinal)
                .Replace('\r', '\n')
                .Split('\n');
        }

        private static bool TryResolveModuleHeading(OnboardingPlan plan, string line, out Guid moduleId)
        {
            var normalizedLine = NormalizeModuleName(line.TrimStart('#', ' ').TrimEnd(':').Trim());
            var matchingModule = plan.Modules
                .OrderBy(module => module.OrderIndex)
                .FirstOrDefault(module =>
                {
                    var normalizedModuleName = NormalizeModuleName(module.Name);
                    return normalizedModuleName == normalizedLine ||
                           normalizedModuleName.Contains(normalizedLine, StringComparison.Ordinal) ||
                           normalizedLine.Contains(normalizedModuleName, StringComparison.Ordinal);
                });

            if (matchingModule == null)
            {
                moduleId = Guid.Empty;
                return false;
            }

            moduleId = matchingModule.Id;
            return true;
        }

        private static bool TryExtractTaskText(string line, out string taskText)
        {
            taskText = null;

            if (line.StartsWith("- ", StringComparison.Ordinal) ||
                line.StartsWith("* ", StringComparison.Ordinal) ||
                line.StartsWith("• ", StringComparison.Ordinal))
            {
                taskText = line[2..].Trim();
                return !string.IsNullOrWhiteSpace(taskText);
            }

            var delimiterIndex = line.IndexOf('|');
            if (delimiterIndex > 0 && !line.StartsWith("| ---", StringComparison.OrdinalIgnoreCase))
            {
                var segments = line.Split('|', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
                if (segments.Length >= 2 &&
                    !segments[0].Equals("title", StringComparison.OrdinalIgnoreCase))
                {
                    taskText = segments[0].Trim();
                    return !string.IsNullOrWhiteSpace(taskText);
                }
            }

            var numberedPrefix = GetNumberedPrefixLength(line);
            if (numberedPrefix > 0)
            {
                taskText = line[numberedPrefix..].Trim();
                return !string.IsNullOrWhiteSpace(taskText);
            }

            return false;
        }

        private static int GetNumberedPrefixLength(string line)
        {
            var index = 0;
            while (index < line.Length && char.IsDigit(line[index]))
            {
                index++;
            }

            if (index == 0 || index >= line.Length)
            {
                return 0;
            }

            return line[index] is '.' or ')' ? index + 1 : 0;
        }

        private static bool IsFallbackCandidate(string line)
        {
            if (line.Length < 12 || line.Length > 180)
            {
                return false;
            }

            if (line.StartsWith("description:", StringComparison.OrdinalIgnoreCase) ||
                line.StartsWith("target audience:", StringComparison.OrdinalIgnoreCase) ||
                line.StartsWith("duration days:", StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            return !line.EndsWith(':');
        }

        private static ExtractedTaskCandidate CreateDefaultCandidate(Guid moduleId, string text)
        {
            var normalizedText = text.Trim();
            var title = normalizedText.Length > OnboardingTask.MaxTitleLength
                ? normalizedText[..OnboardingTask.MaxTitleLength]
                : normalizedText;

            return new ExtractedTaskCandidate
            {
                SuggestedModuleId = moduleId,
                Title = title,
                Description = normalizedText,
                Category = OnboardingTaskCategory.Orientation,
                DueDayOffset = 0,
                AssignmentTarget = OnboardingTaskAssignmentTarget.Enrolee,
                AcknowledgementRule = OnboardingTaskAcknowledgementRule.NotRequired
            };
        }

        private static Guid? ResolveModuleId(OnboardingPlan plan, string moduleName)
        {
            if (plan.Modules.Count == 0)
            {
                return null;
            }

            if (string.IsNullOrWhiteSpace(moduleName))
            {
                return plan.Modules.OrderBy(module => module.OrderIndex).First().Id;
            }

            var normalizedModuleName = NormalizeModuleName(moduleName);
            var exactMatch = plan.Modules
                .OrderBy(module => module.OrderIndex)
                .FirstOrDefault(module => NormalizeModuleName(module.Name) == normalizedModuleName);

            if (exactMatch != null)
            {
                return exactMatch.Id;
            }

            var partialMatch = plan.Modules
                .OrderBy(module => module.OrderIndex)
                .FirstOrDefault(module =>
                {
                    var candidate = NormalizeModuleName(module.Name);
                    return candidate.Contains(normalizedModuleName, StringComparison.Ordinal) ||
                           normalizedModuleName.Contains(candidate, StringComparison.Ordinal);
                });

            return partialMatch?.Id ?? plan.Modules.OrderBy(module => module.OrderIndex).First().Id;
        }

        private static string NormalizeModuleName(string value)
        {
            return (value ?? string.Empty).Trim().ToLowerInvariant();
        }

        private static bool IsMarkdownDocument(OnboardingDocument document)
        {
            var extension = Path.GetExtension(document.FileName);
            return MarkdownExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
                   document.ContentType.Contains("markdown", StringComparison.OrdinalIgnoreCase) ||
                   document.ContentType.Equals("text/plain", StringComparison.OrdinalIgnoreCase);
        }

        private static bool IsPdfDocument(OnboardingDocument document)
        {
            return Path.GetExtension(document.FileName).Equals(".pdf", StringComparison.OrdinalIgnoreCase) ||
                   document.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase);
        }

        private static string ResolvePdfToTextExecutable()
        {
            var candidates = OperatingSystem.IsWindows()
                ? PdfToTextCandidatesWindows
                : PdfToTextCandidatesUnix;

            foreach (var candidate in candidates)
            {
                if (Path.IsPathRooted(candidate))
                {
                    if (File.Exists(candidate))
                    {
                        return candidate;
                    }

                    continue;
                }

                var resolvedFromPath = ResolveFromPath(candidate);
                if (!string.IsNullOrWhiteSpace(resolvedFromPath))
                {
                    return resolvedFromPath;
                }
            }

            return null;
        }

        private static string ResolveFromPath(string executableName)
        {
            var pathValue = Environment.GetEnvironmentVariable("PATH") ?? string.Empty;
            foreach (var directory in pathValue.Split(Path.PathSeparator, StringSplitOptions.RemoveEmptyEntries))
            {
                var candidatePath = Path.Combine(directory.Trim(), executableName);
                if (File.Exists(candidatePath))
                {
                    return candidatePath;
                }
            }

            return null;
        }
    }
}
