using System;
using JourneyPoint.Domains.Hires.Enums;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Domains.Hires
{
    /// <summary>
    /// Encapsulates selective-apply rules for AI-personalised journey task revisions.
    /// </summary>
    public partial class HireJourneyManager
    {
        /// <summary>
        /// Applies one facilitator-approved AI revision to one pending journey task snapshot.
        /// </summary>
        public void ApplyPersonalisedTaskRevision(
            Hire hire,
            Journey journey,
            JourneyTask journeyTask,
            DateTime baselineSnapshotAt,
            string title,
            string description,
            OnboardingTaskCategory category,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule,
            int dueDayOffset)
        {
            EnsurePersonalisationEligibleTaskForHire(hire, journey, journeyTask);
            EnsureMatchingBaselineSnapshot(journeyTask, baselineSnapshotAt);

            journeyTask.Title = NormalizeRequiredText(title, nameof(title), JourneyTask.MaxTitleLength);
            journeyTask.Description = NormalizeRequiredText(
                description,
                nameof(description),
                JourneyTask.MaxDescriptionLength);
            journeyTask.Category = category;
            journeyTask.AssignmentTarget = assignmentTarget;
            journeyTask.AcknowledgementRule = acknowledgementRule;
            journeyTask.DueDayOffset = EnsureDueDayOffset(dueDayOffset);
            journeyTask.DueOn = CalculateDueOn(hire.StartDate, journeyTask.DueDayOffset);
            journeyTask.PersonalisedAt = DateTime.UtcNow;
        }

        private static void EnsurePersonalisationEligibleTaskForHire(Hire hire, Journey journey, JourneyTask journeyTask)
        {
            EnsureJourneyTaskForJourney(journey, journeyTask);
            EnsureHire(hire);
            EnsureMatchingTenant(hire.TenantId, journey.TenantId, nameof(journey));

            if (journey.HireId != hire.Id)
            {
                throw new InvalidOperationException("Journey does not belong to the specified hire.");
            }

            if (journey.Status != JourneyStatus.Draft)
            {
                throw new InvalidOperationException("Only non-activated draft journeys can accept personalisation changes.");
            }

            EnsurePendingTask(journeyTask);
        }

        private static void EnsureMatchingBaselineSnapshot(JourneyTask journeyTask, DateTime baselineSnapshotAt)
        {
            var currentSnapshotAt = GetSnapshotTimestamp(journeyTask);
            var normalizedBaseline = NormalizeSnapshotTimestamp(baselineSnapshotAt);

            if (currentSnapshotAt != normalizedBaseline)
            {
                throw new InvalidOperationException(
                    "Journey task changed after the personalisation diff was generated. Request a fresh proposal before applying changes.");
            }
        }

        private static DateTime GetSnapshotTimestamp(JourneyTask journeyTask)
        {
            return NormalizeSnapshotTimestamp(journeyTask.LastModificationTime ?? journeyTask.CreationTime);
        }

        private static DateTime NormalizeSnapshotTimestamp(DateTime value)
        {
            return value.Kind switch
            {
                DateTimeKind.Utc => value,
                DateTimeKind.Local => value.ToUniversalTime(),
                _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
            };
        }
    }
}
