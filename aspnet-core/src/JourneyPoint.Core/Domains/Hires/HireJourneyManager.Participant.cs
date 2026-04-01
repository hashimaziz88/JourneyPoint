using System;
using JourneyPoint.Domains.Hires.Enums;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Domains.Hires
{
    /// <summary>
    /// Encapsulates participant acknowledgement and completion rules for active journeys.
    /// </summary>
    public partial class HireJourneyManager
    {
        /// <summary>
        /// Records acknowledgement for one enrolee-owned active journey task.
        /// </summary>
        public void AcknowledgeEnroleeTask(
            Hire hire,
            Journey journey,
            JourneyTask journeyTask,
            long enroleeUserId)
        {
            EnsureEnroleeTaskOwnership(hire, journey, journeyTask, enroleeUserId);
            EnsurePendingTask(journeyTask);

            if (journeyTask.AcknowledgementRule != OnboardingTaskAcknowledgementRule.Required)
            {
                throw new InvalidOperationException("This task does not require acknowledgement.");
            }

            if (journeyTask.AcknowledgedAt.HasValue)
            {
                throw new InvalidOperationException("Task is already acknowledged.");
            }

            journeyTask.AcknowledgedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Completes one enrolee-owned active journey task after validation succeeds.
        /// </summary>
        public void CompleteEnroleeTask(
            Hire hire,
            Journey journey,
            JourneyTask journeyTask,
            long enroleeUserId)
        {
            EnsureEnroleeTaskOwnership(hire, journey, journeyTask, enroleeUserId);
            EnsurePendingTask(journeyTask);
            EnsureAcknowledgementSatisfied(journeyTask);

            var completionTime = DateTime.UtcNow;
            journeyTask.Status = JourneyTaskStatus.Completed;
            journeyTask.CompletedAt = completionTime;
            journeyTask.CompletedByUserId = enroleeUserId;
        }

        private static void EnsureEnroleeTaskOwnership(
            Hire hire,
            Journey journey,
            JourneyTask journeyTask,
            long enroleeUserId)
        {
            EnsureJourneyTaskForJourney(journey, journeyTask);
            EnsureJourneyForHire(hire, journey);
            EnsureActiveJourney(journey);

            if (hire.PlatformUserId != EnsureUserId(enroleeUserId, nameof(enroleeUserId)))
            {
                throw new InvalidOperationException("Task does not belong to the current enrolee.");
            }

            if (journeyTask.AssignmentTarget != OnboardingTaskAssignmentTarget.Enrolee)
            {
                throw new InvalidOperationException("Task is not assigned to an enrolee.");
            }
        }

        private static void EnsureActiveJourney(Journey journey)
        {
            if (journey.Status != JourneyStatus.Active)
            {
                throw new InvalidOperationException("Only active journeys allow participant task execution.");
            }
        }

        private static void EnsureAcknowledgementSatisfied(JourneyTask journeyTask)
        {
            if (journeyTask.AcknowledgementRule == OnboardingTaskAcknowledgementRule.Required &&
                !journeyTask.AcknowledgedAt.HasValue)
            {
                throw new InvalidOperationException(
                    "Task acknowledgement is required before completion.");
            }
        }
    }
}
