using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using JourneyPoint.Domains.Hires;

namespace JourneyPoint.Domains.Engagement
{
    /// <summary>
    /// Represents one durable at-risk intervention record for a hire journey.
    /// </summary>
    public class AtRiskFlag : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public const int MaxAcknowledgementNotesLength = 2000;
        public const int MaxResolutionNotesLength = 2000;

        public int TenantId { get; set; }

        public Guid HireId { get; set; }

        [ForeignKey(nameof(HireId))]
        public virtual Hire Hire { get; set; }

        public Guid JourneyId { get; set; }

        [ForeignKey(nameof(JourneyId))]
        public virtual Journey Journey { get; set; }

        public DateTime RaisedAt { get; set; }

        public EngagementClassification ClassificationAtRaise { get; set; }

        public AtRiskFlagStatus Status { get; set; }

        public long? AcknowledgedByUserId { get; set; }

        public DateTime? AcknowledgedAt { get; set; }

        [MaxLength(MaxAcknowledgementNotesLength)]
        public string AcknowledgementNotes { get; set; }

        public long? ResolvedByUserId { get; set; }

        public DateTime? ResolvedAt { get; set; }

        public AtRiskResolutionType? ResolutionType { get; set; }

        [MaxLength(MaxResolutionNotesLength)]
        public string ResolutionNotes { get; set; }
    }
}
