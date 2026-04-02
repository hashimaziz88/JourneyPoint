using System;
using System.Collections.Generic;

namespace JourneyPoint.Application.Services.OnboardingPlanService.Dto
{
    /// <summary>
    /// Carries AI-enhanced proposals for all modules and tasks in a draft plan.
    /// Returned to the facilitator for review before applying.
    /// </summary>
    public class PlanEnhancementProposalDto
    {
        /// <summary>Gets or sets the plan identifier.</summary>
        public Guid PlanId { get; set; }

        /// <summary>Gets or sets the AI model used for enhancement.</summary>
        public string ModelName { get; set; }

        /// <summary>Gets or sets the enhanced module proposals.</summary>
        public List<EnhancedModuleProposalDto> Modules { get; set; } = new();
    }

    /// <summary>
    /// AI-enhanced content for one module and its tasks.
    /// </summary>
    public class EnhancedModuleProposalDto
    {
        /// <summary>Gets or sets the module identifier.</summary>
        public Guid ModuleId { get; set; }

        /// <summary>Gets or sets the original module name.</summary>
        public string OriginalName { get; set; }

        /// <summary>Gets or sets the AI-enhanced module name.</summary>
        public string EnhancedName { get; set; }

        /// <summary>Gets or sets the original module description.</summary>
        public string OriginalDescription { get; set; }

        /// <summary>Gets or sets the AI-enhanced module description.</summary>
        public string EnhancedDescription { get; set; }

        /// <summary>Gets or sets the enhanced task proposals.</summary>
        public List<EnhancedTaskProposalDto> Tasks { get; set; } = new();
    }

    /// <summary>
    /// AI-enhanced content for one task.
    /// </summary>
    public class EnhancedTaskProposalDto
    {
        /// <summary>Gets or sets the task identifier.</summary>
        public Guid TaskId { get; set; }

        /// <summary>Gets or sets the original task title.</summary>
        public string OriginalTitle { get; set; }

        /// <summary>Gets or sets the AI-enhanced task title.</summary>
        public string EnhancedTitle { get; set; }

        /// <summary>Gets or sets the original task description.</summary>
        public string OriginalDescription { get; set; }

        /// <summary>Gets or sets the AI-enhanced task description.</summary>
        public string EnhancedDescription { get; set; }
    }

    /// <summary>
    /// Request to apply AI-enhanced proposals to the plan's modules and tasks.
    /// The facilitator selects which module/task proposals to accept.
    /// </summary>
    public class ApplyPlanEnhancementRequest
    {
        /// <summary>Gets or sets the plan identifier to apply enhancements to.</summary>
        public Guid PlanId { get; set; }

        /// <summary>Gets or sets the list of module enhancements to apply.</summary>
        public List<ApplyModuleEnhancement> Modules { get; set; } = new();
    }

    /// <summary>
    /// One module enhancement selection to apply. Carries the accepted enhanced content.
    /// </summary>
    public class ApplyModuleEnhancement
    {
        /// <summary>Gets or sets the module identifier.</summary>
        public Guid ModuleId { get; set; }

        /// <summary>Gets or sets a value indicating whether to apply the enhanced module name/description.</summary>
        public bool ApplyModuleContent { get; set; }

        /// <summary>Gets or sets the accepted enhanced module name (only applied when ApplyModuleContent is true).</summary>
        public string EnhancedName { get; set; }

        /// <summary>Gets or sets the accepted enhanced module description (only applied when ApplyModuleContent is true).</summary>
        public string EnhancedDescription { get; set; }

        /// <summary>Gets or sets the task enhancements to apply for this module.</summary>
        public List<ApplyTaskEnhancement> Tasks { get; set; } = new();
    }

    /// <summary>
    /// One task enhancement to apply within a module.
    /// </summary>
    public class ApplyTaskEnhancement
    {
        /// <summary>Gets or sets the task identifier.</summary>
        public Guid TaskId { get; set; }

        /// <summary>Gets or sets the accepted enhanced task title.</summary>
        public string EnhancedTitle { get; set; }

        /// <summary>Gets or sets the accepted enhanced task description.</summary>
        public string EnhancedDescription { get; set; }
    }
}
