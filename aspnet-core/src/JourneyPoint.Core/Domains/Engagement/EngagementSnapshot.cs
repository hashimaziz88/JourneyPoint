using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using JourneyPoint.Domains.Engagement.Enums;
using JourneyPoint.Domains.Hires;

namespace JourneyPoint.Domains.Engagement
{
    /// <summary>
    /// Represents one append-only engagement score calculation for a hire journey.
    /// </summary>
    public class EngagementSnapshot : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public const decimal MinPercentageValue = 0m;
        public const decimal MaxPercentageValue = 100m;
        public const int MinCountValue = 0;

        public int TenantId { get; set; }

        public Guid HireId { get; set; }

        [ForeignKey(nameof(HireId))]
        public virtual Hire Hire { get; set; }

        public Guid JourneyId { get; set; }

        [ForeignKey(nameof(JourneyId))]
        public virtual Journey Journey { get; set; }

        [Range(typeof(decimal), "0", "100")]
        public decimal CompletionRate { get; set; }

        [Range(MinCountValue, int.MaxValue)]
        public int DaysSinceLastActivity { get; set; }

        [Range(MinCountValue, int.MaxValue)]
        public int OverdueTaskCount { get; set; }

        [Range(typeof(decimal), "0", "100")]
        public decimal CompositeScore { get; set; }

        public EngagementClassification Classification { get; set; }

        public DateTime ComputedAt { get; set; }
    }
}
