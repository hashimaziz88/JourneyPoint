using System;
using System.Linq;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Domains.OnboardingPlans
{
    /// <summary>
    /// Provides validation and lookup helpers that keep onboarding plan aggregates consistent.
    /// </summary>
    public partial class OnboardingPlanManager
    {
        private static OnboardingModule FindModule(OnboardingPlan plan, Guid moduleId)
        {
            var module = plan.Modules.SingleOrDefault(existingModule => existingModule.Id == moduleId);

            if (module == null)
            {
                throw new InvalidOperationException($"Module {moduleId} was not found in plan {plan.Id}.");
            }

            return module;
        }

        private static OnboardingTask FindTask(OnboardingModule module, Guid taskId)
        {
            var task = module.Tasks.SingleOrDefault(existingTask => existingTask.Id == taskId);

            if (task == null)
            {
                throw new InvalidOperationException($"Task {taskId} was not found in module {module.Id}.");
            }

            return task;
        }

        private static void AddTaskToModule(OnboardingPlan plan, OnboardingModule module, OnboardingTask task)
        {
            if (task == null)
            {
                throw new ArgumentNullException(nameof(task));
            }

            EnsureTenantOwnership(plan.TenantId, module.TenantId, nameof(module));
            EnsureUniqueTaskOrder(module, task.OrderIndex, task.Id);

            task.TenantId = plan.TenantId;
            task.OnboardingModuleId = module.Id;

            if (!module.Tasks.Any(existingTask => existingTask.Id == task.Id))
            {
                module.Tasks.Add(task);
            }
        }

        private static void EnsureUniqueModuleOrder(OnboardingPlan plan, int orderIndex, Guid moduleId)
        {
            var normalizedOrderIndex = EnsureModuleOrderIndex(orderIndex);

            if (plan.Modules.Any(existingModule =>
                    existingModule.Id != moduleId &&
                    existingModule.OrderIndex == normalizedOrderIndex))
            {
                throw new InvalidOperationException("Module order must be unique within a plan.");
            }
        }

        private static void EnsureUniqueTaskOrder(OnboardingModule module, int orderIndex, Guid taskId)
        {
            var normalizedOrderIndex = EnsureTaskOrderIndex(orderIndex);

            if (module.Tasks.Any(existingTask =>
                    existingTask.Id != taskId &&
                    existingTask.OrderIndex == normalizedOrderIndex))
            {
                throw new InvalidOperationException("Task order must be unique within a module.");
            }
        }

        private static void EnsureConsistentTenantOwnership(OnboardingPlan plan)
        {
            foreach (var module in plan.Modules)
            {
                EnsureTenantOwnership(plan.TenantId, module.TenantId, nameof(module));

                foreach (var task in module.Tasks)
                {
                    EnsureTenantOwnership(plan.TenantId, task.TenantId, nameof(task));
                }
            }
        }

        private static void EnsureTenantOwnership(int expectedTenantId, int actualTenantId, string memberName)
        {
            if (actualTenantId != 0 && actualTenantId != expectedTenantId)
            {
                throw new InvalidOperationException(
                    $"{memberName} does not belong to the same tenant as the onboarding plan.");
            }
        }

        private static void EnsurePlan(OnboardingPlan plan)
        {
            if (plan == null)
            {
                throw new ArgumentNullException(nameof(plan));
            }
        }

        private static void EnsureDraft(OnboardingPlan plan)
        {
            if (plan.Status != OnboardingPlanStatus.Draft)
            {
                throw new InvalidOperationException(
                    "Plan structure can be changed only while the plan is in draft.");
            }
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

        private static int EnsureDurationDays(int value)
        {
            if (value < OnboardingPlan.MinDurationDays)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(value),
                    "Duration days must be greater than zero.");
            }

            return value;
        }

        private static int EnsureModuleOrderIndex(int value)
        {
            if (value < OnboardingModule.MinOrderIndex)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(value),
                    "Module order must be greater than zero.");
            }

            return value;
        }

        private static int EnsureTaskOrderIndex(int value)
        {
            if (value < OnboardingTask.MinOrderIndex)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(value),
                    "Task order must be greater than zero.");
            }

            return value;
        }

        private static int EnsureDueDayOffset(int value)
        {
            if (value < OnboardingTask.MinDueDayOffset)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(value),
                    "Due day offset cannot be negative.");
            }

            return value;
        }
    }
}
