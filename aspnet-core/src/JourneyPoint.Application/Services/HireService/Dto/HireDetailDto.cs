using System;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;

namespace JourneyPoint.Application.Services.HireService.Dto
{
    /// <summary>
    /// Returns full hire detail for facilitator review screens.
    /// </summary>
    public class HireDetailDto
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
        /// Gets or sets the optional platform user id.
        /// </summary>
        public long? PlatformUserId { get; set; }

        /// <summary>
        /// Gets or sets the optional platform user display name.
        /// </summary>
        public string PlatformUserDisplayName { get; set; }

        /// <summary>
        /// Gets or sets the optional manager user id.
        /// </summary>
        public long? ManagerUserId { get; set; }

        /// <summary>
        /// Gets or sets the optional manager display name.
        /// </summary>
        public string ManagerDisplayName { get; set; }

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

        /// <summary>
        /// Gets or sets the last attempted welcome-notification timestamp.
        /// </summary>
        public DateTime? WelcomeNotificationLastAttemptedAt { get; set; }

        /// <summary>
        /// Gets or sets the successful welcome-notification timestamp.
        /// </summary>
        public DateTime? WelcomeNotificationSentAt { get; set; }

        /// <summary>
        /// Gets or sets the safe failure summary when welcome delivery is recoverably failed.
        /// </summary>
        public string WelcomeNotificationFailureReason { get; set; }

        /// <summary>
        /// Gets or sets the activation timestamp when applicable.
        /// </summary>
        public DateTime? ActivatedAt { get; set; }

        /// <summary>
        /// Gets or sets the completion timestamp when applicable.
        /// </summary>
        public DateTime? CompletedAt { get; set; }

        /// <summary>
        /// Gets or sets the exit timestamp when applicable.
        /// </summary>
        public DateTime? ExitedAt { get; set; }

        /// <summary>
        /// Gets or sets the optional journey summary for the hire.
        /// </summary>
        public HireJourneySummaryDto Journey { get; set; }
    }
}
