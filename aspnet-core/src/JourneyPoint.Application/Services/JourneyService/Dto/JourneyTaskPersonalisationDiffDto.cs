using System;
using System.Collections.Generic;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Returns one diff-ready AI revision for one existing journey task.
    /// </summary>
    public class JourneyTaskPersonalisationDiffDto
    {
        /// <summary>
        /// Gets or sets the journey task id.
        /// </summary>
        public Guid JourneyTaskId { get; set; }

        /// <summary>
        /// Gets or sets the copied module title.
        /// </summary>
        public string ModuleTitle { get; set; }

        /// <summary>
        /// Gets or sets the copied task order index.
        /// </summary>
        public int TaskOrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the task snapshot timestamp used for stale-apply protection.
        /// </summary>
        public DateTime BaselineSnapshotAt { get; set; }

        /// <summary>
        /// Gets or sets the current task title.
        /// </summary>
        public string CurrentTitle { get; set; }

        /// <summary>
        /// Gets or sets the current task description.
        /// </summary>
        public string CurrentDescription { get; set; }

        /// <summary>
        /// Gets or sets the current task category.
        /// </summary>
        public OnboardingTaskCategory CurrentCategory { get; set; }

        /// <summary>
        /// Gets or sets the current task assignment target.
        /// </summary>
        public OnboardingTaskAssignmentTarget CurrentAssignmentTarget { get; set; }

        /// <summary>
        /// Gets or sets the current acknowledgement rule.
        /// </summary>
        public OnboardingTaskAcknowledgementRule CurrentAcknowledgementRule { get; set; }

        /// <summary>
        /// Gets or sets the current due-day offset.
        /// </summary>
        public int CurrentDueDayOffset { get; set; }

        /// <summary>
        /// Gets or sets the current due date.
        /// </summary>
        public DateTime CurrentDueOn { get; set; }

        /// <summary>
        /// Gets or sets the proposed task title.
        /// </summary>
        public string ProposedTitle { get; set; }

        /// <summary>
        /// Gets or sets the proposed task description.
        /// </summary>
        public string ProposedDescription { get; set; }

        /// <summary>
        /// Gets or sets the proposed task category.
        /// </summary>
        public OnboardingTaskCategory ProposedCategory { get; set; }

        /// <summary>
        /// Gets or sets the proposed task assignment target.
        /// </summary>
        public OnboardingTaskAssignmentTarget ProposedAssignmentTarget { get; set; }

        /// <summary>
        /// Gets or sets the proposed acknowledgement rule.
        /// </summary>
        public OnboardingTaskAcknowledgementRule ProposedAcknowledgementRule { get; set; }

        /// <summary>
        /// Gets or sets the proposed due-day offset.
        /// </summary>
        public int ProposedDueDayOffset { get; set; }

        /// <summary>
        /// Gets or sets the proposed due date.
        /// </summary>
        public DateTime ProposedDueOn { get; set; }

        /// <summary>
        /// Gets or sets the AI rationale for the revision.
        /// </summary>
        public string Rationale { get; set; }

        /// <summary>
        /// Gets or sets the field names that would change if the revision is applied.
        /// </summary>
        public IReadOnlyList<string> ChangedFields { get; set; }
    }
}
