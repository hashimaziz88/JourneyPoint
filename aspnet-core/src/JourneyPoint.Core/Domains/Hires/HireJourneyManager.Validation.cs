using System;
using System.Linq;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Domains.Hires
{
    /// <summary>
    /// Provides validation and lookup helpers that keep the hire journey aggregate consistent.
    /// </summary>
    public partial class HireJourneyManager
    {
        private static void AddTaskToJourney(Journey journey, JourneyTask task)
        {
            EnsureJourney(journey);

            if (task == null)
            {
                throw new ArgumentNullException(nameof(task));
            }

            EnsureMatchingTenant(journey.TenantId, task.TenantId, nameof(task));
            EnsureUniqueTaskOrder(journey, task.ModuleOrderIndex, task.TaskOrderIndex, task.Id);

            if (!journey.Tasks.Any(existingTask => existingTask.Id == task.Id))
            {
                journey.Tasks.Add(task);
            }
        }

        private static void EnsureDraftJourneyForHire(Hire hire, Journey journey)
        {
            EnsureJourneyForHire(hire, journey);

            if (journey.Status != JourneyStatus.Draft)
            {
                throw new InvalidOperationException("Only draft journeys can be changed through draft review rules.");
            }
        }

        private static void EnsureJourneyForHire(Hire hire, Journey journey)
        {
            EnsureHire(hire);
            EnsureJourney(journey);
            EnsureMatchingTenant(hire.TenantId, journey.TenantId, nameof(journey));

            if (journey.HireId != hire.Id)
            {
                throw new InvalidOperationException("Journey does not belong to the specified hire.");
            }
        }

        private static void EnsureSourceModule(OnboardingModule sourceModule, Guid planId, int tenantId)
        {
            if (sourceModule == null)
            {
                throw new ArgumentNullException(nameof(sourceModule));
            }

            EnsureMatchingTenant(tenantId, sourceModule.TenantId, nameof(sourceModule));

            if (sourceModule.OnboardingPlanId != planId)
            {
                throw new InvalidOperationException("Template module does not belong to the expected onboarding plan.");
            }
        }

        private static void EnsureSourceTask(
            OnboardingTask sourceTask,
            OnboardingModule sourceModule,
            int tenantId)
        {
            if (sourceTask == null)
            {
                throw new ArgumentNullException(nameof(sourceTask));
            }

            EnsureMatchingTenant(tenantId, sourceTask.TenantId, nameof(sourceTask));

            if (sourceTask.OnboardingModuleId != sourceModule.Id)
            {
                throw new InvalidOperationException("Template task does not belong to the expected onboarding module.");
            }
        }

        private static void EnsureUniqueTaskOrder(
            Journey journey,
            int moduleOrderIndex,
            int taskOrderIndex,
            Guid journeyTaskId)
        {
            var normalizedModuleOrder = EnsureModuleOrderIndex(moduleOrderIndex);
            var normalizedTaskOrder = EnsureTaskOrderIndex(taskOrderIndex);

            if (journey.Tasks.Any(existingTask =>
                    existingTask.Id != journeyTaskId &&
                    existingTask.ModuleOrderIndex == normalizedModuleOrder &&
                    existingTask.TaskOrderIndex == normalizedTaskOrder))
            {
                throw new InvalidOperationException("Journey task order must be unique within the same module snapshot.");
            }
        }

        private static void EnsureNoJourneyAssigned(Hire hire)
        {
            if (hire.Journey != null)
            {
                throw new InvalidOperationException("Hire already has a journey assigned.");
            }
        }

        private static void EnsurePublishedPlan(OnboardingPlan onboardingPlan)
        {
            if (onboardingPlan == null)
            {
                throw new ArgumentNullException(nameof(onboardingPlan));
            }

            if (onboardingPlan.Status != OnboardingPlanStatus.Published)
            {
                throw new InvalidOperationException("Only published onboarding plans can generate hire journeys.");
            }
        }

        private static void EnsureHire(Hire hire)
        {
            if (hire == null)
            {
                throw new ArgumentNullException(nameof(hire));
            }
        }

        private static void EnsureJourney(Journey journey)
        {
            if (journey == null)
            {
                throw new ArgumentNullException(nameof(journey));
            }
        }

        private static void EnsureTenantId(int tenantId)
        {
            if (tenantId <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(tenantId), "Tenant ownership is required.");
            }
        }

        private static void EnsureMatchingPlan(Guid expectedPlanId, Guid actualPlanId)
        {
            if (expectedPlanId != actualPlanId)
            {
                throw new InvalidOperationException("Hire and journey generation must use the same onboarding plan.");
            }
        }

        private static void EnsureMatchingTenant(int expectedTenantId, int actualTenantId, string memberName)
        {
            if (actualTenantId != expectedTenantId)
            {
                throw new InvalidOperationException(
                    $"{memberName} does not belong to the same tenant as the hire aggregate.");
            }
        }

        private static DateTime EnsureStartDate(DateTime startDate)
        {
            if (startDate == default)
            {
                throw new ArgumentOutOfRangeException(nameof(startDate), "Hire start date is required.");
            }

            return startDate.Date;
        }

        private static long EnsureUserId(long value, string parameterName)
        {
            if (value <= 0)
            {
                throw new ArgumentOutOfRangeException(parameterName, "User reference must be greater than zero.");
            }

            return value;
        }

        private static long? NormalizeOptionalUserId(long? value, string parameterName)
        {
            if (!value.HasValue)
            {
                return null;
            }

            return EnsureUserId(value.Value, parameterName);
        }

        private static string NormalizeRequiredText(string value, string parameterName, int maxLength)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(value, parameterName);

            var trimmedValue = value.Trim();

            if (trimmedValue.Length > maxLength)
            {
                throw new ArgumentException($"Value cannot exceed {maxLength} characters.", parameterName);
            }

            return trimmedValue;
        }

        private static string NormalizeOptionalText(string value, string parameterName, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            return NormalizeRequiredText(value, parameterName, maxLength);
        }

        private static string NormalizeRequiredEmail(string emailAddress)
        {
            var normalizedEmail = NormalizeRequiredText(
                emailAddress,
                nameof(emailAddress),
                Hire.MaxEmailAddressLength);

            return normalizedEmail.ToLowerInvariant();
        }

        private static int EnsureModuleOrderIndex(int value)
        {
            if (value < JourneyTask.MinModuleOrderIndex)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(value),
                    "Module order must be greater than zero.");
            }

            return value;
        }

        private static int EnsureTaskOrderIndex(int value)
        {
            if (value < JourneyTask.MinTaskOrderIndex)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(value),
                    "Task order must be greater than zero.");
            }

            return value;
        }

        private static DateTime CalculateDueOn(DateTime startDate, int dueDayOffset)
        {
            if (dueDayOffset < JourneyTask.MinDueDayOffset)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(dueDayOffset),
                    "Due day offset cannot be negative.");
            }

            return EnsureStartDate(startDate).AddDays(dueDayOffset);
        }
    }
}
