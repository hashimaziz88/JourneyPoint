using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Dependency;
using JourneyPoint.Application.Services.DocumentExtractionService;
using JourneyPoint.Application.Services.GroqService;
using JourneyPoint.Application.Services.MarkdownImportService;
using JourneyPoint.Application.Services.MarkdownImportService.Helpers;
using JourneyPoint.Application.Services.OnboardingDocumentService.Dto;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingDocumentService.Helpers
{
    /// <summary>
    /// Extracts reviewable task proposals from uploaded onboarding documents.
    /// </summary>
    public class OnboardingDocumentExtractionOrchestrator : ITransientDependency
    {
        private readonly IOnboardingDocumentStorage _onboardingDocumentStorage;
        private readonly MarkdownImportParser _markdownImportParser;
        private readonly IDocumentContentExtractionService _documentContentExtractionService;
        private readonly IGroqDocumentNormalizationService _groqDocumentNormalizationService;

        /// <summary>
        /// Initializes a new instance of the <see cref="OnboardingDocumentExtractionOrchestrator"/> class.
        /// </summary>
        public OnboardingDocumentExtractionOrchestrator(
            IOnboardingDocumentStorage onboardingDocumentStorage,
            MarkdownImportParser markdownImportParser,
            IDocumentContentExtractionService documentContentExtractionService,
            IGroqDocumentNormalizationService groqDocumentNormalizationService)
        {
            _onboardingDocumentStorage = onboardingDocumentStorage;
            _markdownImportParser = markdownImportParser;
            _documentContentExtractionService = documentContentExtractionService;
            _groqDocumentNormalizationService = groqDocumentNormalizationService;
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

            var extractedContent = await _documentContentExtractionService.ExtractAsync(
                document.FileName,
                document.ContentType,
                content);
            var proposalCandidates = new List<ExtractedTaskCandidate>();

            if (!string.IsNullOrWhiteSpace(extractedContent.TextContent))
            {
                if (_groqDocumentNormalizationService.IsEnabled)
                {
                    try
                    {
                        var groqCandidates = await _groqDocumentNormalizationService
                            .ExtractPlanProposalsFromTextAsync(
                                plan,
                                document.FileName,
                                document.ContentType,
                                extractedContent.TextContent,
                                document.Id);
                        proposalCandidates.AddRange(groqCandidates);
                    }
                    catch
                    {
                        // fall back to deterministic extraction when Groq normalization fails
                    }
                }

                if (!proposalCandidates.Any())
                {
                    proposalCandidates.AddRange(ExtractFallbackCandidates(
                        plan,
                        extractedContent.TextContent,
                        document.FileName));
                }
            }

            if (!proposalCandidates.Any() &&
                extractedContent.Images.Any() &&
                _groqDocumentNormalizationService.IsEnabled)
            {
                var groqCandidates = await _groqDocumentNormalizationService
                    .ExtractPlanProposalsFromImagesAsync(
                        plan,
                        document.FileName,
                        document.ContentType,
                        extractedContent.Images,
                        document.Id);
                proposalCandidates.AddRange(groqCandidates);
            }

            return proposalCandidates;
        }

        private IReadOnlyCollection<ExtractedTaskCandidate> ExtractFallbackCandidates(
            OnboardingPlan plan,
            string extractedText,
            string sourceFileName)
        {
            var orderedModules = plan.Modules.OrderBy(module => module.OrderIndex).ToList();
            if (!orderedModules.Any())
            {
                return Array.Empty<ExtractedTaskCandidate>();
            }

            if (sourceFileName.EndsWith(".md", StringComparison.OrdinalIgnoreCase) ||
                sourceFileName.EndsWith(".markdown", StringComparison.OrdinalIgnoreCase) ||
                sourceFileName.EndsWith(".txt", StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                    var preview = _markdownImportParser.Parse(extractedText, sourceFileName);
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
                catch
                {
                    // fall through to plain text heuristics when strict parsing fails
                }
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
    }
}
