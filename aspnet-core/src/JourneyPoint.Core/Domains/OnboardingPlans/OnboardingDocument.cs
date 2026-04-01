using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Domains.OnboardingPlans
{
    /// <summary>
    /// Represents one uploaded document used to enrich a saved onboarding plan.
    /// </summary>
    public class OnboardingDocument : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public const int MaxFileNameLength = 260;
        public const int MaxStoragePathLength = 500;
        public const int MaxContentTypeLength = 200;
        public const int MaxFailureReasonLength = 2000;

        public OnboardingDocument()
        {
            ExtractedTasks = new Collection<ExtractedTask>();
        }

        public int TenantId { get; set; }

        public Guid OnboardingPlanId { get; set; }

        [ForeignKey(nameof(OnboardingPlanId))]
        public virtual OnboardingPlan OnboardingPlan { get; set; }

        [Required]
        [MaxLength(MaxFileNameLength)]
        public string FileName { get; set; }

        [Required]
        [MaxLength(MaxStoragePathLength)]
        public string StoragePath { get; set; }

        [Required]
        [MaxLength(MaxContentTypeLength)]
        public string ContentType { get; set; }

        [Range(0, long.MaxValue)]
        public long FileSizeBytes { get; set; }

        public OnboardingDocumentStatus Status { get; set; }

        [Range(0, int.MaxValue)]
        public int ExtractedTaskCount { get; set; }

        [Range(0, int.MaxValue)]
        public int AcceptedTaskCount { get; set; }

        [MaxLength(MaxFailureReasonLength)]
        public string FailureReason { get; set; }

        public DateTime? ExtractionCompletedTime { get; set; }

        public virtual ICollection<ExtractedTask> ExtractedTasks { get; set; }
    }
}
