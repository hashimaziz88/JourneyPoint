using System;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;

namespace JourneyPoint.Application.Services.HireService.Dto
{
    /// <summary>
    /// Returns one hire row for facilitator list views.
    /// </summary>
    public class HireListItemDto
    {
        /// <summary>
        /// Gets or sets the hire id.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the source onboarding plan id.
        /// </summary>
        public Guid OnboardingPlanId { get; set; }

        /// <summary>
        /// Gets or sets the source onboarding plan name.
        /// </summary>
        public string OnboardingPlanName { get; set; }

        /// <summary>
        /// Gets or sets the optional journey id.
        /// </summary>
        public Guid? JourneyId { get; set; }

        /// <summary>
        /// Gets or sets the optional current journey lifecycle state.
        /// </summary>
        public JourneyStatus? JourneyStatus { get; set; }

        /// <summary>
        /// Gets or sets the hire full name.
        /// </summary>
        public string FullName { get; set; }

        /// <summary>
        /// Gets or sets the hire email address.
        /// </summary>
        public string EmailAddress { get; set; }

        /// <summary>
        /// Gets or sets the optional role title.
        /// </summary>
        public string RoleTitle { get; set; }

        /// <summary>
        /// Gets or sets the optional department.
        /// </summary>
        public string Department { get; set; }

        /// <summary>
        /// Gets or sets the onboarding start date.
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Gets or sets the hire lifecycle state.
        /// </summary>
        public HireLifecycleState Status { get; set; }

        /// <summary>
        /// Gets or sets the welcome-notification delivery state.
        /// </summary>
        public WelcomeNotificationStatus WelcomeNotificationStatus { get; set; }
    }
}
