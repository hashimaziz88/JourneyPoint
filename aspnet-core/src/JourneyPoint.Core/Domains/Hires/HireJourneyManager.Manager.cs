using System;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Domains.Hires
{
    /// <summary>
    /// Encapsulates manager-owned task completion rules for active journeys.
    /// </summary>
    public partial class HireJourneyManager
    {
        /// <summary>
        /// Completes one manager-assigned task for the current manager.
        /// </summary>
        public void CompleteManagerTask(
            Hire hire,
            Journey journey,
            JourneyTask journeyTask,
            long managerUserId)
        {
            EnsureManagerTaskOwnership(hire, journey, journeyTask, managerUserId);
            EnsurePendingTask(journeyTask);

            var completionTime = DateTime.UtcNow;
            journeyTask.Status = JourneyTaskStatus.Completed;
            journeyTask.CompletedAt = completionTime;
            journeyTask.CompletedByUserId = managerUserId;
        }

        private static void EnsureManagerTaskOwnership(
            Hire hire,
            Journey journey,
            JourneyTask journeyTask,
            long managerUserId)
        {
            EnsureJourneyTaskForJourney(journey, journeyTask);
            EnsureJourneyForHire(hire, journey);
            EnsureActiveJourney(journey);

            if (hire.ManagerUserId != EnsureUserId(managerUserId, nameof(managerUserId)))
            {
                throw new InvalidOperationException("Task does not belong to the current manager.");
            }

            if (journeyTask.AssignmentTarget != OnboardingTaskAssignmentTarget.Manager)
            {
                throw new InvalidOperationException("Task is not assigned to a manager.");
            }
        }
    }
}
