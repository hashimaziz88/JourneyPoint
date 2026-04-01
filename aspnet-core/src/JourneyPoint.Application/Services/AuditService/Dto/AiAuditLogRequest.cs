using System;
using JourneyPoint.Domains.Audit;
using JourneyPoint.Domains.Audit.Enums;

namespace JourneyPoint.Application.Services.AuditService.Dto
{
    /// <summary>
    /// Carries the metadata required to persist one AI workflow audit record.
    /// </summary>
    public class AiAuditLogRequest
    {
        /// <summary>
        /// Gets or sets the tenant that owns the audited workflow.
        /// </summary>
        public int TenantId { get; set; }

        /// <summary>
        /// Gets or sets the workflow type.
        /// </summary>
        public GenerationLogWorkflowType WorkflowType { get; set; }

        /// <summary>
        /// Gets or sets the workflow status.
        /// </summary>
        public GenerationLogStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the optional hire identifier.
        /// </summary>
        public Guid? HireId { get; set; }

        /// <summary>
        /// Gets or sets the optional journey identifier.
        /// </summary>
        public Guid? JourneyId { get; set; }

        /// <summary>
        /// Gets or sets the optional onboarding plan identifier.
        /// </summary>
        public Guid? OnboardingPlanId { get; set; }

        /// <summary>
        /// Gets or sets the optional onboarding document identifier.
        /// </summary>
        public Guid? OnboardingDocumentId { get; set; }

        /// <summary>
        /// Gets or sets the AI model name.
        /// </summary>
        public string ModelName { get; set; }

        /// <summary>
        /// Gets or sets a safe prompt summary.
        /// </summary>
        public string PromptSummary { get; set; }

        /// <summary>
        /// Gets or sets a safe response summary.
        /// </summary>
        public string ResponseSummary { get; set; }

        /// <summary>
        /// Gets or sets a safe failure reason when the workflow does not succeed.
        /// </summary>
        public string FailureReason { get; set; }

        /// <summary>
        /// Gets or sets the number of proposed or added tasks.
        /// </summary>
        public int TasksAdded { get; set; }

        /// <summary>
        /// Gets or sets the number of revised tasks.
        /// </summary>
        public int TasksRevised { get; set; }

        /// <summary>
        /// Gets or sets the workflow start time.
        /// </summary>
        public DateTime StartedAt { get; set; }

        /// <summary>
        /// Gets or sets the workflow completion time.
        /// </summary>
        public DateTime CompletedAt { get; set; }
    }
}
