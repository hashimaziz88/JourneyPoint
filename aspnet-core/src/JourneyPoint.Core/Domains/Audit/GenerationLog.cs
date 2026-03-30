using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Domains.Audit
{
    /// <summary>
    /// Records one append-only AI extraction or personalisation workflow execution.
    /// </summary>
    public class GenerationLog : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public const int MaxModelNameLength = 200;
        public const int MaxPromptSummaryLength = 4000;
        public const int MaxResponseSummaryLength = 4000;
        public const int MaxFailureReasonLength = 1000;

        public int TenantId { get; set; }

        public GenerationLogWorkflowType WorkflowType { get; set; }

        public GenerationLogStatus Status { get; set; }

        public Guid? HireId { get; set; }

        [ForeignKey(nameof(HireId))]
        public virtual Hire Hire { get; set; }

        public Guid? JourneyId { get; set; }

        [ForeignKey(nameof(JourneyId))]
        public virtual Journey Journey { get; set; }

        public Guid? OnboardingPlanId { get; set; }

        [ForeignKey(nameof(OnboardingPlanId))]
        public virtual OnboardingPlan OnboardingPlan { get; set; }

        public Guid? OnboardingDocumentId { get; set; }

        [ForeignKey(nameof(OnboardingDocumentId))]
        public virtual OnboardingDocument OnboardingDocument { get; set; }

        [Required]
        [MaxLength(MaxModelNameLength)]
        public string ModelName { get; set; }

        [Required]
        [MaxLength(MaxPromptSummaryLength)]
        public string PromptSummary { get; set; }

        [MaxLength(MaxResponseSummaryLength)]
        public string ResponseSummary { get; set; }

        [MaxLength(MaxFailureReasonLength)]
        public string FailureReason { get; set; }

        public int TasksAdded { get; set; }

        public int TasksRevised { get; set; }

        public DateTime StartedAt { get; set; }

        public DateTime CompletedAt { get; set; }

        public long DurationMilliseconds { get; set; }
    }
}
