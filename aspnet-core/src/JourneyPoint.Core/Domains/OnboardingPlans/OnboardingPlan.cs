using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace JourneyPoint.Domains.OnboardingPlans
{
    /// <summary>
    /// Represents a reusable onboarding plan aggregate owned by a single tenant.
    /// </summary>
    public class OnboardingPlan : FullAuditedEntity<long>, IMustHaveTenant
    {
        public const int MaxNameLength = 200;
        public const int MaxDescriptionLength = 4000;
        public const int MaxTargetAudienceLength = 200;

        protected OnboardingPlan()
        {
            Modules = new Collection<OnboardingModule>();
        }

        public OnboardingPlan(int tenantId, string name, string description, string targetAudience, int durationDays)
            : this()
        {
            if (tenantId <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(tenantId), "Tenant ownership is required.");
            }

            TenantId = tenantId;
            Status = OnboardingPlanStatus.Draft;

            UpdateDetails(name, description, targetAudience, durationDays);
        }

        public int TenantId { get; set; }

        public string Name { get; protected set; }

        public string Description { get; protected set; }

        public string TargetAudience { get; protected set; }

        public int DurationDays { get; protected set; }

        public OnboardingPlanStatus Status { get; protected set; }

        public virtual ICollection<OnboardingModule> Modules { get; protected set; }

        /// <summary>
        /// Updates the editable plan metadata while the plan remains in draft.
        /// </summary>
        public void UpdateDetails(string name, string description, string targetAudience, int durationDays)
        {
            EnsureDraftStructureMutationAllowed();
            ValidateName(name);
            ValidateDescription(description);
            ValidateTargetAudience(targetAudience);
            ValidateDurationDays(durationDays);

            Name = name.Trim();
            Description = description.Trim();
            TargetAudience = targetAudience.Trim();
            DurationDays = durationDays;
        }

        /// <summary>
        /// Adds a new ordered module to the draft onboarding plan.
        /// </summary>
        public void AddModule(OnboardingModule module)
        {
            EnsureDraftStructureMutationAllowed();

            if (module == null)
            {
                throw new ArgumentNullException(nameof(module));
            }

            if (Modules.Any(existingModule => existingModule.OrderIndex == module.OrderIndex && existingModule != module))
            {
                throw new InvalidOperationException("Module order must be unique within a plan.");
            }

            module.AttachToPlan(this);

            if (!Modules.Contains(module))
            {
                Modules.Add(module);
            }
        }

        /// <summary>
        /// Updates the metadata and order of an existing module while the plan is in draft.
        /// </summary>
        public void UpdateModule(long moduleId, string name, string description, int orderIndex)
        {
            EnsureDraftStructureMutationAllowed();

            if (Modules.Any(existingModule => existingModule.Id != moduleId && existingModule.OrderIndex == orderIndex))
            {
                throw new InvalidOperationException("Module order must be unique within a plan.");
            }

            FindModule(moduleId).UpdateDetails(name, description, orderIndex);
        }

        /// <summary>
        /// Removes a module from the draft onboarding plan.
        /// </summary>
        public void RemoveModule(long moduleId)
        {
            EnsureDraftStructureMutationAllowed();

            var module = FindModule(moduleId);
            Modules.Remove(module);
        }

        /// <summary>
        /// Adds a new ordered template task to a module in the draft onboarding plan.
        /// </summary>
        public void AddTask(long moduleId, OnboardingTask task)
        {
            EnsureDraftStructureMutationAllowed();
            FindModule(moduleId).AddTask(task);
        }

        /// <summary>
        /// Updates an existing template task within a module while the plan is in draft.
        /// </summary>
        public void UpdateTask(
            long moduleId,
            long taskId,
            string title,
            string description,
            string category,
            int orderIndex,
            int dueDayOffset,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule)
        {
            EnsureDraftStructureMutationAllowed();

            FindModule(moduleId).UpdateTask(
                taskId,
                title,
                description,
                category,
                orderIndex,
                dueDayOffset,
                assignmentTarget,
                acknowledgementRule);
        }

        /// <summary>
        /// Removes a template task from a module while the plan is in draft.
        /// </summary>
        public void RemoveTask(long moduleId, long taskId)
        {
            EnsureDraftStructureMutationAllowed();
            FindModule(moduleId).RemoveTask(taskId);
        }

        /// <summary>
        /// Publishes the onboarding plan once at least one module and task exist.
        /// </summary>
        public void Publish()
        {
            if (Status != OnboardingPlanStatus.Draft)
            {
                throw new InvalidOperationException("Only draft plans can be published.");
            }

            if (!Modules.Any())
            {
                throw new InvalidOperationException("A published plan must contain at least one module.");
            }

            if (Modules.Any(module => !module.Tasks.Any()))
            {
                throw new InvalidOperationException("Every published module must contain at least one task.");
            }

            Status = OnboardingPlanStatus.Published;
        }

        /// <summary>
        /// Archives the onboarding plan so it can no longer be edited or newly published.
        /// </summary>
        public void Archive()
        {
            if (Status == OnboardingPlanStatus.Archived)
            {
                throw new InvalidOperationException("Plan is already archived.");
            }

            Status = OnboardingPlanStatus.Archived;
        }

        internal OnboardingModule FindModule(long moduleId)
        {
            var module = Modules.SingleOrDefault(existingModule => existingModule.Id == moduleId);

            if (module == null)
            {
                throw new InvalidOperationException($"Module {moduleId} was not found in plan {Id}.");
            }

            return module;
        }

        private void EnsureDraftStructureMutationAllowed()
        {
            if (Status != OnboardingPlanStatus.Draft)
            {
                throw new InvalidOperationException("Plan structure can be changed only while the plan is in draft.");
            }
        }

        private static void ValidateName(string name)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(name);

            if (name.Trim().Length > MaxNameLength)
            {
                throw new ArgumentException($"Plan name cannot exceed {MaxNameLength} characters.", nameof(name));
            }
        }

        private static void ValidateDescription(string description)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(description);

            if (description.Trim().Length > MaxDescriptionLength)
            {
                throw new ArgumentException($"Plan description cannot exceed {MaxDescriptionLength} characters.", nameof(description));
            }
        }

        private static void ValidateTargetAudience(string targetAudience)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(targetAudience);

            if (targetAudience.Trim().Length > MaxTargetAudienceLength)
            {
                throw new ArgumentException($"Target audience cannot exceed {MaxTargetAudienceLength} characters.", nameof(targetAudience));
            }
        }

        private static void ValidateDurationDays(int durationDays)
        {
            if (durationDays < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(durationDays), "Duration days must be greater than zero.");
            }
        }
    }
}
