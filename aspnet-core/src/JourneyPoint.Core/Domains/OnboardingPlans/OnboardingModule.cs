using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace JourneyPoint.Domains.OnboardingPlans
{
    /// <summary>
    /// Represents an ordered phase inside a reusable onboarding plan.
    /// </summary>
    public class OnboardingModule : FullAuditedEntity<long>, IMustHaveTenant
    {
        public const int MaxNameLength = 200;
        public const int MaxDescriptionLength = 2000;

        protected OnboardingModule()
        {
            Tasks = new Collection<OnboardingTask>();
        }

        public OnboardingModule(string name, string description, int orderIndex)
            : this()
        {
            UpdateDetails(name, description, orderIndex);
        }

        public int TenantId { get; set; }

        public long OnboardingPlanId { get; protected set; }

        public virtual OnboardingPlan OnboardingPlan { get; protected set; }

        public string Name { get; protected set; }

        public string Description { get; protected set; }

        public int OrderIndex { get; protected set; }

        public virtual ICollection<OnboardingTask> Tasks { get; protected set; }

        internal void AttachToPlan(OnboardingPlan onboardingPlan)
        {
            if (onboardingPlan == null)
            {
                throw new ArgumentNullException(nameof(onboardingPlan));
            }

            if (TenantId != default && TenantId != onboardingPlan.TenantId)
            {
                throw new InvalidOperationException("Module tenant ownership must match the parent plan.");
            }

            if (OnboardingPlanId != default && OnboardingPlanId != onboardingPlan.Id && OnboardingPlan != onboardingPlan)
            {
                throw new InvalidOperationException("Module is already attached to a different plan.");
            }

            TenantId = onboardingPlan.TenantId;
            OnboardingPlan = onboardingPlan;
            OnboardingPlanId = onboardingPlan.Id;
        }

        internal void UpdateDetails(string name, string description, int orderIndex)
        {
            ValidateName(name);
            ValidateDescription(description);
            ValidateOrderIndex(orderIndex);

            Name = name.Trim();
            Description = description.Trim();
            OrderIndex = orderIndex;
        }

        internal void AddTask(OnboardingTask task)
        {
            if (task == null)
            {
                throw new ArgumentNullException(nameof(task));
            }

            if (Tasks.Any(existingTask => existingTask.OrderIndex == task.OrderIndex && existingTask != task))
            {
                throw new InvalidOperationException("Task order must be unique within a module.");
            }

            task.AttachToModule(this);

            if (!Tasks.Contains(task))
            {
                Tasks.Add(task);
            }
        }

        internal void UpdateTask(
            long taskId,
            string title,
            string description,
            string category,
            int orderIndex,
            int dueDayOffset,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule)
        {
            var task = FindTask(taskId);

            if (Tasks.Any(existingTask => existingTask.Id != taskId && existingTask.OrderIndex == orderIndex))
            {
                throw new InvalidOperationException("Task order must be unique within a module.");
            }

            task.UpdateDetails(
                title,
                description,
                category,
                orderIndex,
                dueDayOffset,
                assignmentTarget,
                acknowledgementRule);
        }

        internal void RemoveTask(long taskId)
        {
            var task = FindTask(taskId);
            Tasks.Remove(task);
        }

        internal OnboardingTask FindTask(long taskId)
        {
            var task = Tasks.SingleOrDefault(existingTask => existingTask.Id == taskId);

            if (task == null)
            {
                throw new InvalidOperationException($"Task {taskId} was not found in module {Id}.");
            }

            return task;
        }

        private static void ValidateName(string name)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(name);

            if (name.Trim().Length > MaxNameLength)
            {
                throw new ArgumentException($"Module name cannot exceed {MaxNameLength} characters.", nameof(name));
            }
        }

        private static void ValidateDescription(string description)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(description);

            if (description.Trim().Length > MaxDescriptionLength)
            {
                throw new ArgumentException($"Module description cannot exceed {MaxDescriptionLength} characters.", nameof(description));
            }
        }

        private static void ValidateOrderIndex(int orderIndex)
        {
            if (orderIndex < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(orderIndex), "Module order must be greater than zero.");
            }
        }
    }
}
