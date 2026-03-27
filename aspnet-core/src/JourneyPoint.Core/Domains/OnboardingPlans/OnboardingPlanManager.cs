using System;
using System.Linq;
using Abp.Domain.Services;

namespace JourneyPoint.Domains.OnboardingPlans
{
    /// <summary>
    /// Encapsulates aggregate rules for onboarding plans, modules, and template tasks.
    /// </summary>
    public class OnboardingPlanManager : DomainService
    {
        /// <summary>
        /// Creates a new draft onboarding plan for a tenant.
        /// </summary>
        public OnboardingPlan CreatePlan(int tenantId, string name, string description, string targetAudience, int durationDays)
        {
            if (tenantId <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(tenantId), "Tenant ownership is required.");
            }

            return new OnboardingPlan
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Name = NormalizeRequiredText(name, nameof(name), OnboardingPlan.MaxNameLength),
                Description = NormalizeRequiredText(description, nameof(description), OnboardingPlan.MaxDescriptionLength),
                TargetAudience = NormalizeRequiredText(targetAudience, nameof(targetAudience), OnboardingPlan.MaxTargetAudienceLength),
                DurationDays = EnsureDurationDays(durationDays),
                Status = OnboardingPlanStatus.Draft
            };
        }

        /// <summary>
        /// Updates editable draft plan metadata.
        /// </summary>
        public void UpdatePlanDetails(OnboardingPlan plan, string name, string description, string targetAudience, int durationDays)
        {
            EnsurePlan(plan);
            EnsureDraft(plan);

            plan.Name = NormalizeRequiredText(name, nameof(name), OnboardingPlan.MaxNameLength);
            plan.Description = NormalizeRequiredText(description, nameof(description), OnboardingPlan.MaxDescriptionLength);
            plan.TargetAudience = NormalizeRequiredText(targetAudience, nameof(targetAudience), OnboardingPlan.MaxTargetAudienceLength);
            plan.DurationDays = EnsureDurationDays(durationDays);
        }

        /// <summary>
        /// Creates a new onboarding module.
        /// </summary>
        public OnboardingModule CreateModule(string name, string description, int orderIndex)
        {
            return new OnboardingModule
            {
                Id = Guid.NewGuid(),
                Name = NormalizeRequiredText(name, nameof(name), OnboardingModule.MaxNameLength),
                Description = NormalizeRequiredText(description, nameof(description), OnboardingModule.MaxDescriptionLength),
                OrderIndex = EnsureModuleOrderIndex(orderIndex)
            };
        }

        /// <summary>
        /// Adds a module to a draft onboarding plan.
        /// </summary>
        public void AddModule(OnboardingPlan plan, OnboardingModule module)
        {
            EnsurePlan(plan);
            EnsureDraft(plan);

            if (module == null)
            {
                throw new ArgumentNullException(nameof(module));
            }

            EnsureUniqueModuleOrder(plan, module.OrderIndex, module.Id);

            module.TenantId = plan.TenantId;
            module.OnboardingPlanId = plan.Id;

            if (!plan.Modules.Any(existingModule => existingModule.Id == module.Id))
            {
                plan.Modules.Add(module);
            }
        }

        /// <summary>
        /// Updates an existing module inside a draft plan.
        /// </summary>
        public void UpdateModule(OnboardingPlan plan, Guid moduleId, string name, string description, int orderIndex)
        {
            EnsurePlan(plan);
            EnsureDraft(plan);

            var module = FindModule(plan, moduleId);
            EnsureTenantOwnership(plan.TenantId, module.TenantId, nameof(module));
            EnsureUniqueModuleOrder(plan, orderIndex, moduleId);

            module.Name = NormalizeRequiredText(name, nameof(name), OnboardingModule.MaxNameLength);
            module.Description = NormalizeRequiredText(description, nameof(description), OnboardingModule.MaxDescriptionLength);
            module.OrderIndex = EnsureModuleOrderIndex(orderIndex);
        }

        /// <summary>
        /// Removes a module from a draft plan.
        /// </summary>
        public void RemoveModule(OnboardingPlan plan, Guid moduleId)
        {
            EnsurePlan(plan);
            EnsureDraft(plan);

            plan.Modules.Remove(FindModule(plan, moduleId));
        }

        /// <summary>
        /// Creates a new reusable onboarding task.
        /// </summary>
        public OnboardingTask CreateTask(
            string title,
            string description,
            OnboardingTaskCategory category,
            int orderIndex,
            int dueDayOffset,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule)
        {
            return new OnboardingTask
            {
                Id = Guid.NewGuid(),
                Title = NormalizeRequiredText(title, nameof(title), OnboardingTask.MaxTitleLength),
                Description = NormalizeRequiredText(description, nameof(description), OnboardingTask.MaxDescriptionLength),
                Category = category,
                OrderIndex = EnsureTaskOrderIndex(orderIndex),
                DueDayOffset = EnsureDueDayOffset(dueDayOffset),
                AssignmentTarget = assignmentTarget,
                AcknowledgementRule = acknowledgementRule
            };
        }

        /// <summary>
        /// Adds a task to a module within a draft plan.
        /// </summary>
        public void AddTask(OnboardingPlan plan, Guid moduleId, OnboardingTask task)
        {
            EnsurePlan(plan);
            EnsureDraft(plan);

            if (task == null)
            {
                throw new ArgumentNullException(nameof(task));
            }

            var module = FindModule(plan, moduleId);
            EnsureTenantOwnership(plan.TenantId, module.TenantId, nameof(module));
            EnsureUniqueTaskOrder(module, task.OrderIndex, task.Id);

            task.TenantId = plan.TenantId;
            task.OnboardingModuleId = module.Id;

            if (!module.Tasks.Any(existingTask => existingTask.Id == task.Id))
            {
                module.Tasks.Add(task);
            }
        }

        /// <summary>
        /// Adds a reviewed extraction task to a published onboarding plan without mutating existing journeys.
        /// </summary>
        public void AddReviewedTaskToPublishedPlan(OnboardingPlan plan, Guid moduleId, OnboardingTask task)
        {
            EnsurePlan(plan);

            if (plan.Status != OnboardingPlanStatus.Published)
            {
                throw new InvalidOperationException("Reviewed document tasks can be added only to published plans.");
            }

            if (task == null)
            {
                throw new ArgumentNullException(nameof(task));
            }

            var module = FindModule(plan, moduleId);
            EnsureTenantOwnership(plan.TenantId, module.TenantId, nameof(module));
            EnsureUniqueTaskOrder(module, task.OrderIndex, task.Id);

            task.TenantId = plan.TenantId;
            task.OnboardingModuleId = module.Id;

            if (!module.Tasks.Any(existingTask => existingTask.Id == task.Id))
            {
                module.Tasks.Add(task);
            }
        }

        /// <summary>
        /// Updates a task in a draft plan module.
        /// </summary>
        public void UpdateTask(
            OnboardingPlan plan,
            Guid moduleId,
            Guid taskId,
            string title,
            string description,
            OnboardingTaskCategory category,
            int orderIndex,
            int dueDayOffset,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule)
        {
            EnsurePlan(plan);
            EnsureDraft(plan);

            var module = FindModule(plan, moduleId);
            EnsureTenantOwnership(plan.TenantId, module.TenantId, nameof(module));
            EnsureUniqueTaskOrder(module, orderIndex, taskId);

            var task = FindTask(module, taskId);
            EnsureTenantOwnership(plan.TenantId, task.TenantId, nameof(task));

            task.Title = NormalizeRequiredText(title, nameof(title), OnboardingTask.MaxTitleLength);
            task.Description = NormalizeRequiredText(description, nameof(description), OnboardingTask.MaxDescriptionLength);
            task.Category = category;
            task.OrderIndex = EnsureTaskOrderIndex(orderIndex);
            task.DueDayOffset = EnsureDueDayOffset(dueDayOffset);
            task.AssignmentTarget = assignmentTarget;
            task.AcknowledgementRule = acknowledgementRule;
        }

        /// <summary>
        /// Removes a task from a draft plan module.
        /// </summary>
        public void RemoveTask(OnboardingPlan plan, Guid moduleId, Guid taskId)
        {
            EnsurePlan(plan);
            EnsureDraft(plan);

            var module = FindModule(plan, moduleId);
            EnsureTenantOwnership(plan.TenantId, module.TenantId, nameof(module));
            module.Tasks.Remove(FindTask(module, taskId));
        }

        /// <summary>
        /// Publishes a draft plan once it has at least one module and each module has at least one task.
        /// </summary>
        public void Publish(OnboardingPlan plan)
        {
            EnsurePlan(plan);

            if (plan.Status != OnboardingPlanStatus.Draft)
            {
                throw new InvalidOperationException("Only draft plans can be published.");
            }

            if (!plan.Modules.Any())
            {
                throw new InvalidOperationException("A published plan must contain at least one module.");
            }

            EnsureConsistentTenantOwnership(plan);

            if (plan.Modules.Any(module => !module.Tasks.Any()))
            {
                throw new InvalidOperationException("Every published module must contain at least one task.");
            }

            plan.Status = OnboardingPlanStatus.Published;
        }

        /// <summary>
        /// Archives an onboarding plan.
        /// </summary>
        public void Archive(OnboardingPlan plan)
        {
            EnsurePlan(plan);

            if (plan.Status == OnboardingPlanStatus.Archived)
            {
                throw new InvalidOperationException("Plan is already archived.");
            }

            plan.Status = OnboardingPlanStatus.Archived;
        }

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

        private static void EnsureUniqueModuleOrder(OnboardingPlan plan, int orderIndex, Guid moduleId)
        {
            var normalizedOrderIndex = EnsureModuleOrderIndex(orderIndex);

            if (plan.Modules.Any(existingModule => existingModule.Id != moduleId && existingModule.OrderIndex == normalizedOrderIndex))
            {
                throw new InvalidOperationException("Module order must be unique within a plan.");
            }
        }

        private static void EnsureUniqueTaskOrder(OnboardingModule module, int orderIndex, Guid taskId)
        {
            var normalizedOrderIndex = EnsureTaskOrderIndex(orderIndex);

            if (module.Tasks.Any(existingTask => existingTask.Id != taskId && existingTask.OrderIndex == normalizedOrderIndex))
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
                throw new InvalidOperationException($"{memberName} does not belong to the same tenant as the onboarding plan.");
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
                throw new InvalidOperationException("Plan structure can be changed only while the plan is in draft.");
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
                throw new ArgumentOutOfRangeException(nameof(value), "Duration days must be greater than zero.");
            }

            return value;
        }

        private static int EnsureModuleOrderIndex(int value)
        {
            if (value < OnboardingModule.MinOrderIndex)
            {
                throw new ArgumentOutOfRangeException(nameof(value), "Module order must be greater than zero.");
            }

            return value;
        }

        private static int EnsureTaskOrderIndex(int value)
        {
            if (value < OnboardingTask.MinOrderIndex)
            {
                throw new ArgumentOutOfRangeException(nameof(value), "Task order must be greater than zero.");
            }

            return value;
        }

        private static int EnsureDueDayOffset(int value)
        {
            if (value < OnboardingTask.MinDueDayOffset)
            {
                throw new ArgumentOutOfRangeException(nameof(value), "Due day offset cannot be negative.");
            }

            return value;
        }
    }
}
