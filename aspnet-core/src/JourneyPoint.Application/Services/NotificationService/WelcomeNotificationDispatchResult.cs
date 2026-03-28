using System;

namespace JourneyPoint.Application.Services.NotificationService
{
    /// <summary>
    /// Describes the outcome of one welcome-notification attempt.
    /// </summary>
    public class WelcomeNotificationDispatchResult
    {
        /// <summary>
        /// Gets or sets a value indicating whether the delivery succeeded.
        /// </summary>
        public bool Succeeded { get; set; }

        /// <summary>
        /// Gets or sets the attempted delivery timestamp.
        /// </summary>
        public DateTime AttemptedAt { get; set; }

        /// <summary>
        /// Gets or sets the successful delivery timestamp when available.
        /// </summary>
        public DateTime? SentAt { get; set; }

        /// <summary>
        /// Gets or sets the safe failure summary when the delivery did not succeed.
        /// </summary>
        public string FailureReason { get; set; }
    }
}
