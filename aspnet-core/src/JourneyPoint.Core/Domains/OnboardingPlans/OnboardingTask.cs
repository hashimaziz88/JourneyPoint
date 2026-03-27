using System;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace JourneyPoint.Domains.OnboardingPlans
{
    /// <summary>
    /// Represents a reusable template task inside an onboarding module.
    /// </summary>
    public class OnboardingTask : FullAuditedEntity<long>, IMustHaveTenant
    {
        public const int MaxTitleLength = 200;
        public const int MaxDescriptionLength = 4000;
        public const int MaxCategoryLength = 100;

        protected OnboardingTask()
        {
        }

        public OnboardingTask(
            string title,
            string description,
            string category,
            int orderIndex,
            int dueDayOffset,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule)
        {
            UpdateDetails(
                title,
                description,
                category,
                orderIndex,
                dueDayOffset,
                assignmentTarget,
                acknowledgementRule);
        }

        public int TenantId { get; set; }

        public long OnboardingModuleId { get; protected set; }

        public virtual OnboardingModule OnboardingModule { get; protected set; }

        public string Title { get; protected set; }

        public string Description { get; protected set; }

        public string Category { get; protected set; }

        public int OrderIndex { get; protected set; }

        public int DueDayOffset { get; protected set; }

        public OnboardingTaskAssignmentTarget AssignmentTarget { get; protected set; }

        public OnboardingTaskAcknowledgementRule AcknowledgementRule { get; protected set; }

        internal void AttachToModule(OnboardingModule onboardingModule)
        {
            if (onboardingModule == null)
            {
                throw new ArgumentNullException(nameof(onboardingModule));
            }

            if (TenantId != default && TenantId != onboardingModule.TenantId)
            {
                throw new InvalidOperationException("Template task tenant ownership must match the parent module.");
            }

            if (OnboardingModuleId != default && OnboardingModuleId != onboardingModule.Id && OnboardingModule != onboardingModule)
            {
                throw new InvalidOperationException("Template task is already attached to a different module.");
            }

            TenantId = onboardingModule.TenantId;
            OnboardingModule = onboardingModule;
            OnboardingModuleId = onboardingModule.Id;
        }

        internal void UpdateDetails(
            string title,
            string description,
            string category,
            int orderIndex,
            int dueDayOffset,
            OnboardingTaskAssignmentTarget assignmentTarget,
            OnboardingTaskAcknowledgementRule acknowledgementRule)
        {
            ValidateTitle(title);
            ValidateDescription(description);
            ValidateCategory(category);
            ValidateOrderIndex(orderIndex);
            ValidateDueDayOffset(dueDayOffset);

            Title = title.Trim();
            Description = description.Trim();
            Category = category.Trim();
            OrderIndex = orderIndex;
            DueDayOffset = dueDayOffset;
            AssignmentTarget = assignmentTarget;
            AcknowledgementRule = acknowledgementRule;
        }

        private static void ValidateTitle(string title)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(title);

            if (title.Trim().Length > MaxTitleLength)
            {
                throw new ArgumentException($"Task title cannot exceed {MaxTitleLength} characters.", nameof(title));
            }
        }

        private static void ValidateDescription(string description)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(description);

            if (description.Trim().Length > MaxDescriptionLength)
            {
                throw new ArgumentException($"Task description cannot exceed {MaxDescriptionLength} characters.", nameof(description));
            }
        }

        private static void ValidateCategory(string category)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(category);

            if (category.Trim().Length > MaxCategoryLength)
            {
                throw new ArgumentException($"Task category cannot exceed {MaxCategoryLength} characters.", nameof(category));
            }
        }

        private static void ValidateOrderIndex(int orderIndex)
        {
            if (orderIndex < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(orderIndex), "Task order must be greater than zero.");
            }
        }

        private static void ValidateDueDayOffset(int dueDayOffset)
        {
            if (dueDayOffset < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(dueDayOffset), "Due day offset cannot be negative.");
            }
        }
    }
}
