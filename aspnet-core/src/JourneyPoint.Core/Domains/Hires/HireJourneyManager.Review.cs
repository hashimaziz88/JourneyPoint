using System;
using JourneyPoint.Domains.Hires.Enums;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Domains.Hires
{
    /// <summary>
    /// Encapsulates draft-review rules for facilitator changes to generated journey tasks.
    /// </summary>
    public partial class HireJourneyManager
    {
        /// <summary>
        /// Adds one facilitator-authored task to a draft journey without template linkage.
        /// </summary>
        public JourneyTask AddFacilitatorTaskToDraft(
            Hire hire,
            Journey journey,
            string moduleTitle,
            int moduleOrderIndex,
            int taskOrderIndex,
            string title,
            string description,
            OnboardingTaskCategory category,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule,
            int dueDayOffset)
        {
            EnsureDraftJourneyForHire(hire, journey);

            var journeyTask = new JourneyTask
            {
                Id = Guid.NewGuid(),
                TenantId = hire.TenantId,
                JourneyId = journey.Id,
                Status = JourneyTaskStatus.Pending
            };

            ApplyDraftTaskSnapshot(
                hire,
                journey,
                journeyTask,
                moduleTitle,
                moduleOrderIndex,
                taskOrderIndex,
                title,
                description,
                category,
                assignmentTarget,
                acknowledgementRule,
                dueDayOffset);

            AddTaskToJourney(journey, journeyTask);
            return journeyTask;
        }

        /// <summary>
        /// Updates one draft journey task snapshot without mutating the source template.
        /// </summary>
        public void UpdateDraftTask(
            Hire hire,
            Journey journey,
            JourneyTask journeyTask,
            string moduleTitle,
            int moduleOrderIndex,
            int taskOrderIndex,
            string title,
            string description,
            OnboardingTaskCategory category,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule,
            int dueDayOffset)
        {
            EnsureDraftJourneyTaskForHire(hire, journey, journeyTask);

            ApplyDraftTaskSnapshot(
                hire,
                journey,
                journeyTask,
                moduleTitle,
                moduleOrderIndex,
                taskOrderIndex,
                title,
                description,
                category,
                assignmentTarget,
                acknowledgementRule,
                dueDayOffset);
        }

        /// <summary>
        /// Removes one pending task from a draft journey during facilitator review.
        /// </summary>
        public void RemovePendingDraftTask(Hire hire, Journey journey, JourneyTask journeyTask)
        {
            EnsureDraftJourneyTaskForHire(hire, journey, journeyTask);
            EnsurePendingTask(journeyTask);

            journey.Tasks.Remove(journeyTask);
        }

        private static void ApplyDraftTaskSnapshot(
            Hire hire,
            Journey journey,
            JourneyTask journeyTask,
            string moduleTitle,
            int moduleOrderIndex,
            int taskOrderIndex,
            string title,
            string description,
            OnboardingTaskCategory category,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule,
            int dueDayOffset)
        {
            var normalizedModuleOrderIndex = EnsureModuleOrderIndex(moduleOrderIndex);
            var normalizedTaskOrderIndex = EnsureTaskOrderIndex(taskOrderIndex);
            var normalizedDueDayOffset = EnsureDueDayOffset(dueDayOffset);

            EnsureUniqueTaskOrder(journey, normalizedModuleOrderIndex, normalizedTaskOrderIndex, journeyTask.Id);

            // Update only copied snapshot fields so source template records remain unchanged.
            journeyTask.ModuleTitle = NormalizeRequiredText(
                moduleTitle,
                nameof(moduleTitle),
                JourneyTask.MaxModuleTitleLength);
            journeyTask.ModuleOrderIndex = normalizedModuleOrderIndex;
            journeyTask.TaskOrderIndex = normalizedTaskOrderIndex;
            journeyTask.Title = NormalizeRequiredText(title, nameof(title), JourneyTask.MaxTitleLength);
            journeyTask.Description = NormalizeRequiredText(
                description,
                nameof(description),
                JourneyTask.MaxDescriptionLength);
            journeyTask.Category = category;
            journeyTask.AssignmentTarget = assignmentTarget;
            journeyTask.AcknowledgementRule = acknowledgementRule;
            journeyTask.DueDayOffset = normalizedDueDayOffset;
            journeyTask.DueOn = CalculateDueOn(hire.StartDate, normalizedDueDayOffset);
        }

        private static void EnsureDraftJourneyTaskForHire(Hire hire, Journey journey, JourneyTask journeyTask)
        {
            EnsureDraftJourneyForHire(hire, journey);
            EnsureJourneyTaskForJourney(journey, journeyTask);
        }

        private static void EnsureJourneyTaskForJourney(Journey journey, JourneyTask journeyTask)
        {
            EnsureJourney(journey);

            if (journeyTask == null)
            {
                throw new ArgumentNullException(nameof(journeyTask));
            }

            EnsureMatchingTenant(journey.TenantId, journeyTask.TenantId, nameof(journeyTask));

            if (journeyTask.JourneyId != journey.Id)
            {
                throw new InvalidOperationException("Journey task does not belong to the specified journey.");
            }
        }

        private static void EnsurePendingTask(JourneyTask journeyTask)
        {
            if (journeyTask.Status != JourneyTaskStatus.Pending)
            {
                throw new InvalidOperationException("Only pending draft tasks can be removed.");
            }
        }

        private static int EnsureDueDayOffset(int value)
        {
            if (value < JourneyTask.MinDueDayOffset)
            {
                throw new ArgumentOutOfRangeException(nameof(value), "Due day offset cannot be negative.");
            }

            return value;
        }
    }
}
