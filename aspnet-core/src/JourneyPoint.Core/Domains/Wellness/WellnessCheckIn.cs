using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Wellness.Enums;

namespace JourneyPoint.Domains.Wellness
{
    /// <summary>
    /// Represents one scheduled wellness check-in for a hire, containing AI-generated questions
    /// and the hire's responses.
    /// </summary>
    public class WellnessCheckIn : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        /// <summary>Maximum length of the AI-generated insight summary.</summary>
        public const int MaxInsightSummaryLength = 2000;

        /// <summary>
        /// Gets or sets the tenant this check-in belongs to.
        /// </summary>
        public int TenantId { get; set; }

        /// <summary>
        /// Gets or sets the hire this check-in is scheduled for.
        /// </summary>
        public Guid HireId { get; set; }

        /// <summary>
        /// Gets or sets the navigation property to the hire.
        /// </summary>
        [ForeignKey(nameof(HireId))]
        public virtual Hire Hire { get; set; }

        /// <summary>
        /// Gets or sets the journey associated with this check-in.
        /// </summary>
        public Guid JourneyId { get; set; }

        /// <summary>
        /// Gets or sets the navigation property to the journey.
        /// </summary>
        [ForeignKey(nameof(JourneyId))]
        public virtual Journey Journey { get; set; }

        /// <summary>
        /// Gets or sets the milestone period this check-in covers.
        /// </summary>
        public WellnessCheckInPeriod Period { get; set; }

        /// <summary>
        /// Gets or sets the lifecycle status of this check-in.
        /// </summary>
        public WellnessCheckInStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the date on which this check-in is due (based on hire start date + offset).
        /// </summary>
        public DateTime ScheduledDate { get; set; }

        /// <summary>
        /// Gets or sets the UTC time the hire submitted this check-in.
        /// </summary>
        public DateTime? SubmittedAt { get; set; }

        /// <summary>
        /// Gets or sets the AI-generated insight summary for managers and facilitators
        /// to review once the check-in is completed.
        /// </summary>
        public string InsightSummary { get; set; }

        /// <summary>
        /// Gets or sets the ordered collection of AI-generated wellness questions.
        /// </summary>
        public virtual ICollection<WellnessQuestion> Questions { get; set; }

        /// <summary>
        /// Initializes a new instance of <see cref="WellnessCheckIn"/>.
        /// </summary>
        public WellnessCheckIn()
        {
            Questions = new Collection<WellnessQuestion>();
        }
    }
}
