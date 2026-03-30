using System;
using JourneyPoint.Domains.Engagement;

namespace JourneyPoint.Application.Services.EngagementService.Dto
{
    /// <summary>
    /// Returns one durable at-risk intervention record.
    /// </summary>
    public class AtRiskFlagDto
    {
        public Guid Id { get; set; }

        public Guid HireId { get; set; }

        public Guid JourneyId { get; set; }

        public AtRiskFlagStatus Status { get; set; }

        public DateTime RaisedAt { get; set; }

        public EngagementClassification ClassificationAtRaise { get; set; }

        public long? AcknowledgedByUserId { get; set; }

        public string AcknowledgedByDisplayName { get; set; }

        public DateTime? AcknowledgedAt { get; set; }

        public string AcknowledgementNotes { get; set; }

        public long? ResolvedByUserId { get; set; }

        public string ResolvedByDisplayName { get; set; }

        public DateTime? ResolvedAt { get; set; }

        public AtRiskResolutionType? ResolutionType { get; set; }

        public string ResolutionNotes { get; set; }
    }
}
