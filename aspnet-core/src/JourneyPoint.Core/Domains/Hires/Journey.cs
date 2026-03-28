using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Domains.Hires
{
    /// <summary>
    /// Represents the hire-specific copy of a published onboarding plan.
    /// </summary>
    public class Journey : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public Journey()
        {
            Tasks = new Collection<JourneyTask>();
        }

        public int TenantId { get; set; }

        public Guid HireId { get; set; }

        [ForeignKey(nameof(HireId))]
        public virtual Hire Hire { get; set; }

        public Guid OnboardingPlanId { get; set; }

        [ForeignKey(nameof(OnboardingPlanId))]
        public virtual OnboardingPlan OnboardingPlan { get; set; }

        public JourneyStatus Status { get; set; }

        public DateTime? ActivatedAt { get; set; }

        public DateTime? PausedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        public virtual ICollection<JourneyTask> Tasks { get; set; }
    }
}
