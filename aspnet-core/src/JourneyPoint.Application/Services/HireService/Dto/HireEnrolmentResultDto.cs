using System;
using JourneyPoint.Domains.Hires;

namespace JourneyPoint.Application.Services.HireService.Dto
{
    /// <summary>
    /// Returns the persisted hire and welcome-notification outcome after enrolment.
    /// </summary>
    public class HireEnrolmentResultDto
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
        /// Gets or sets the created platform user id.
        /// </summary>
        public long PlatformUserId { get; set; }

        /// <summary>
        /// Gets or sets the optional manager user id.
        /// </summary>
        public long? ManagerUserId { get; set; }

        /// <summary>
        /// Gets or sets the hire full name.
        /// </summary>
        public string FullName { get; set; }

        /// <summary>
        /// Gets or sets the hire email address.
        /// </summary>
        public string EmailAddress { get; set; }

        /// <summary>
        /// Gets or sets the optional hire role title.
        /// </summary>
        public string RoleTitle { get; set; }

        /// <summary>
        /// Gets or sets the optional hire department.
        /// </summary>
        public string Department { get; set; }

        /// <summary>
        /// Gets or sets the onboarding start date.
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Gets or sets the current hire lifecycle state.
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
        /// Gets or sets the safe failure summary for recoverable welcome delivery issues.
        /// </summary>
        public string WelcomeNotificationFailureReason { get; set; }
    }
}
