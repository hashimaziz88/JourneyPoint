using System;
using System.Collections.Generic;
using System.Linq;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.GroqService
{
    internal static class GroqJourneyPersonalisationMapper
    {
        internal static IReadOnlyList<GroqJourneyTaskPersonalisationRevision> MapRevisions(
            GroqJourneyPersonalisationResponse payload,
            IReadOnlyDictionary<Guid, JourneyTask> eligibleTasks)
        {
            var revisions = new List<GroqJourneyTaskPersonalisationRevision>();
            var seenTaskIds = new HashSet<Guid>();

            foreach (var revision in payload.Revisions ?? new List<GroqJourneyPersonalisationRevisionResponse>())
            {
                var journeyTaskId = ParseJourneyTaskId(revision.JourneyTaskId);
                if (!eligibleTasks.TryGetValue(journeyTaskId, out var task))
                {
                    throw new InvalidOperationException("Groq returned a revision for an unknown or ineligible journey task.");
                }

                if (!seenTaskIds.Add(journeyTaskId))
                {
                    throw new InvalidOperationException("Groq returned duplicate revisions for the same journey task.");
                }

                var mappedRevision = new GroqJourneyTaskPersonalisationRevision
                {
                    JourneyTaskId = journeyTaskId,
                    Title = NormalizeRequiredText(revision.Title, task.Title, JourneyTask.MaxTitleLength),
                    Description = NormalizeRequiredText(
                        revision.Description,
                        task.Description,
                        JourneyTask.MaxDescriptionLength),
                    Category = ParseCategory(revision.Category, task.Category),
                    AssignmentTarget = ParseAssignmentTarget(revision.AssignmentTarget, task.AssignmentTarget),
                    AcknowledgementRule = ParseAcknowledgementRule(revision.AcknowledgementRule, task.AcknowledgementRule),
                    DueDayOffset = EnsureDueDayOffset(revision.DueDayOffset),
                    Rationale = NormalizeOptionalText(revision.Rationale, 1000)
                };

                if (IsNoOp(task, mappedRevision))
                {
                    continue;
                }

                revisions.Add(mappedRevision);
            }

            return revisions;
        }

        internal static string NormalizeSummary(string summary)
        {
            return NormalizeOptionalText(summary, 1000) ??
                   "Journey personalisation proposal generated for facilitator review.";
        }

        private static Guid ParseJourneyTaskId(string value)
        {
            if (!Guid.TryParse(value, out var journeyTaskId) || journeyTaskId == Guid.Empty)
            {
                throw new InvalidOperationException("Groq returned an invalid journey task identifier.");
            }

            return journeyTaskId;
        }

        private static bool IsNoOp(JourneyTask task, GroqJourneyTaskPersonalisationRevision revision)
        {
            return task.Title == revision.Title &&
                   task.Description == revision.Description &&
                   task.Category == revision.Category &&
                   task.AssignmentTarget == revision.AssignmentTarget &&
                   task.AcknowledgementRule == revision.AcknowledgementRule &&
                   task.DueDayOffset == revision.DueDayOffset;
        }

        private static string NormalizeRequiredText(string value, string fallback, int maxLength)
        {
            var normalizedValue = string.IsNullOrWhiteSpace(value) ? fallback : value.Trim();
            if (string.IsNullOrWhiteSpace(normalizedValue))
            {
                throw new InvalidOperationException("Groq returned an empty required field.");
            }

            return normalizedValue.Length <= maxLength
                ? normalizedValue
                : normalizedValue[..maxLength];
        }

        private static string NormalizeOptionalText(string value, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            var normalizedValue = value.Trim();
            return normalizedValue.Length <= maxLength
                ? normalizedValue
                : normalizedValue[..maxLength];
        }

        private static int EnsureDueDayOffset(int value)
        {
            if (value < JourneyTask.MinDueDayOffset)
            {
                throw new InvalidOperationException("Groq returned a negative due-day offset.");
            }

            return value;
        }

        private static OnboardingTaskCategory ParseCategory(string value, OnboardingTaskCategory fallback)
        {
            return string.IsNullOrWhiteSpace(value)
                ? fallback
                : Enum.TryParse(value, true, out OnboardingTaskCategory parsedValue)
                    ? parsedValue
                    : throw new InvalidOperationException("Groq returned an unsupported onboarding task category.");
        }

        private static OnboardingTaskAssignmentTarget ParseAssignmentTarget(
            string value,
            OnboardingTaskAssignmentTarget fallback)
        {
            return string.IsNullOrWhiteSpace(value)
                ? fallback
                : Enum.TryParse(value, true, out OnboardingTaskAssignmentTarget parsedValue)
                    ? parsedValue
                    : throw new InvalidOperationException("Groq returned an unsupported assignment target.");
        }

        private static OnboardingTaskAcknowledgementRule ParseAcknowledgementRule(
            string value,
            OnboardingTaskAcknowledgementRule fallback)
        {
            return string.IsNullOrWhiteSpace(value)
                ? fallback
                : Enum.TryParse(value, true, out OnboardingTaskAcknowledgementRule parsedValue)
                    ? parsedValue
                    : throw new InvalidOperationException("Groq returned an unsupported acknowledgement rule.");
        }
    }
}
