using System;
using Abp.Domain.Services;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Domains.Hires
{
    /// <summary>
    /// Encapsulates aggregate rules for hires, journeys, and journey-task copies.
    /// </summary>
    public partial class HireJourneyManager : DomainService
    {
        /// <summary>
        /// Creates a new hire linked to one published onboarding plan.
        /// </summary>
        public Hire CreateHire(
            int tenantId,
            OnboardingPlan onboardingPlan,
            string fullName,
            string emailAddress,
            string roleTitle,
            string department,
            DateTime startDate,
            long? managerUserId,
            long? platformUserId = null)
        {
            EnsureTenantId(tenantId);
            EnsurePublishedPlan(onboardingPlan);
            EnsureMatchingTenant(tenantId, onboardingPlan.TenantId, nameof(onboardingPlan));

            return new Hire
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                OnboardingPlanId = onboardingPlan.Id,
                FullName = NormalizeRequiredText(fullName, nameof(fullName), Hire.MaxFullNameLength),
                EmailAddress = NormalizeRequiredEmail(emailAddress),
                RoleTitle = NormalizeOptionalText(roleTitle, nameof(roleTitle), Hire.MaxRoleTitleLength),
                Department = NormalizeOptionalText(department, nameof(department), Hire.MaxDepartmentLength),
                StartDate = EnsureStartDate(startDate),
                ManagerUserId = NormalizeOptionalUserId(managerUserId, nameof(managerUserId)),
                PlatformUserId = NormalizeOptionalUserId(platformUserId, nameof(platformUserId)),
                Status = HireLifecycleState.PendingActivation,
                WelcomeNotificationStatus = WelcomeNotificationStatus.Pending
            };
        }

        /// <summary>
        /// Assigns the created platform account to an existing hire.
        /// </summary>
        public void AssignPlatformUser(Hire hire, long platformUserId)
        {
            EnsureHire(hire);
            hire.PlatformUserId = EnsureUserId(platformUserId, nameof(platformUserId));
        }

        /// <summary>
        /// Creates the draft journey linked to one hire and source onboarding plan.
        /// </summary>
        public Journey CreateDraftJourney(Hire hire, OnboardingPlan onboardingPlan)
        {
            EnsureHire(hire);
            EnsurePublishedPlan(onboardingPlan);
            EnsureMatchingTenant(hire.TenantId, onboardingPlan.TenantId, nameof(onboardingPlan));
            EnsureMatchingPlan(hire.OnboardingPlanId, onboardingPlan.Id);
            EnsureNoJourneyAssigned(hire);

            var journey = new Journey
            {
                Id = Guid.NewGuid(),
                TenantId = hire.TenantId,
                HireId = hire.Id,
                OnboardingPlanId = onboardingPlan.Id,
                Status = JourneyStatus.Draft
            };

            hire.Journey = journey;
            return journey;
        }

        /// <summary>
        /// Copies one template task into a journey draft while preserving source linkage.
        /// </summary>
        public JourneyTask AddTaskCopyFromTemplate(
            Hire hire,
            Journey journey,
            OnboardingModule sourceModule,
            OnboardingTask sourceTask)
        {
            EnsureDraftJourneyForHire(hire, journey);
            EnsureSourceModule(sourceModule, journey.OnboardingPlanId, hire.TenantId);
            EnsureSourceTask(sourceTask, sourceModule, hire.TenantId);

            var journeyTask = new JourneyTask
            {
                Id = Guid.NewGuid(),
                TenantId = hire.TenantId,
                JourneyId = journey.Id,
                SourceOnboardingTaskId = sourceTask.Id,
                SourceOnboardingModuleId = sourceModule.Id,
                // Copy template values so future template edits never mutate existing journeys.
                ModuleTitle = sourceModule.Name,
                ModuleOrderIndex = sourceModule.OrderIndex,
                TaskOrderIndex = sourceTask.OrderIndex,
                Title = sourceTask.Title,
                Description = sourceTask.Description,
                Category = sourceTask.Category,
                AssignmentTarget = sourceTask.AssignmentTarget,
                AcknowledgementRule = sourceTask.AcknowledgementRule,
                DueDayOffset = sourceTask.DueDayOffset,
                DueOn = CalculateDueOn(hire.StartDate, sourceTask.DueDayOffset),
                Status = JourneyTaskStatus.Pending
            };

            AddTaskToJourney(journey, journeyTask);
            return journeyTask;
        }

        /// <summary>
        /// Transitions a draft journey and hire into the active lifecycle state.
        /// </summary>
        public void ActivateJourney(Hire hire, Journey journey)
        {
            EnsureDraftJourneyForHire(hire, journey);

            if (journey.Tasks.Count == 0)
            {
                throw new InvalidOperationException("A journey must contain at least one task before activation.");
            }

            var activationTime = DateTime.UtcNow;
            journey.Status = JourneyStatus.Active;
            journey.ActivatedAt = activationTime;
            journey.PausedAt = null;

            hire.Status = HireLifecycleState.Active;
            hire.ActivatedAt = activationTime;
        }

        /// <summary>
        /// Pauses one active journey without changing hire ownership or task snapshots.
        /// </summary>
        public void PauseJourney(Hire hire, Journey journey)
        {
            EnsureJourneyForHire(hire, journey);

            if (journey.Status != JourneyStatus.Active)
            {
                throw new InvalidOperationException("Only active journeys can be paused.");
            }

            journey.Status = JourneyStatus.Paused;
            journey.PausedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Completes one journey and marks the hire onboarding lifecycle as completed.
        /// </summary>
        public void CompleteJourney(Hire hire, Journey journey)
        {
            EnsureJourneyForHire(hire, journey);

            if (journey.Status != JourneyStatus.Active && journey.Status != JourneyStatus.Paused)
            {
                throw new InvalidOperationException("Only active or paused journeys can be completed.");
            }

            var completionTime = DateTime.UtcNow;
            journey.Status = JourneyStatus.Completed;
            journey.CompletedAt = completionTime;
            journey.PausedAt = null;

            hire.Status = HireLifecycleState.Completed;
            hire.CompletedAt = completionTime;
        }

        /// <summary>
        /// Marks a hire as exited while preserving the existing journey for audit and reporting.
        /// </summary>
        public void ExitHire(Hire hire, Journey journey = null)
        {
            EnsureHire(hire);

            if (hire.Status == HireLifecycleState.Exited)
            {
                throw new InvalidOperationException("Hire is already marked as exited.");
            }

            var exitTime = DateTime.UtcNow;
            hire.Status = HireLifecycleState.Exited;
            hire.ExitedAt = exitTime;

            if (journey != null)
            {
                EnsureJourneyForHire(hire, journey);

                if (journey.Status == JourneyStatus.Active)
                {
                    journey.Status = JourneyStatus.Paused;
                    journey.PausedAt = exitTime;
                }
            }
        }
    }
}
