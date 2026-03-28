using System;

namespace JourneyPoint.Domains.Hires
{
    /// <summary>
    /// Provides welcome-notification state transitions for the hire aggregate.
    /// </summary>
    public partial class HireJourneyManager
    {
        /// <summary>
        /// Resets the hire welcome-notification state to pending.
        /// </summary>
        public void MarkWelcomeNotificationPending(Hire hire)
        {
            EnsureHire(hire);

            hire.WelcomeNotificationStatus = WelcomeNotificationStatus.Pending;
            hire.WelcomeNotificationLastAttemptedAt = null;
            hire.WelcomeNotificationSentAt = null;
            hire.WelcomeNotificationFailureReason = null;
        }

        /// <summary>
        /// Marks the hire welcome-notification state as sent.
        /// </summary>
        public void MarkWelcomeNotificationSent(Hire hire, DateTime sentAt)
        {
            EnsureHire(hire);

            var normalizedTimestamp = NormalizeNotificationTimestamp(sentAt);
            hire.WelcomeNotificationStatus = WelcomeNotificationStatus.Sent;
            hire.WelcomeNotificationLastAttemptedAt = normalizedTimestamp;
            hire.WelcomeNotificationSentAt = normalizedTimestamp;
            hire.WelcomeNotificationFailureReason = null;
        }

        /// <summary>
        /// Marks the hire welcome-notification state as failed but recoverable.
        /// </summary>
        public void MarkWelcomeNotificationFailed(Hire hire, DateTime attemptedAt, string failureReason)
        {
            EnsureHire(hire);

            hire.WelcomeNotificationStatus = WelcomeNotificationStatus.FailedRecoverable;
            hire.WelcomeNotificationLastAttemptedAt = NormalizeNotificationTimestamp(attemptedAt);
            hire.WelcomeNotificationSentAt = null;
            hire.WelcomeNotificationFailureReason = NormalizeFailureReason(failureReason);
        }

        /// <summary>
        /// Ensures the hire can receive a reissued welcome notification without disrupting an active onboarding account.
        /// </summary>
        public void EnsureWelcomeNotificationCanBeResent(Hire hire)
        {
            EnsureHire(hire);

            if (hire.Status != HireLifecycleState.PendingActivation)
            {
                throw new InvalidOperationException(
                    "Welcome notifications can only be resent while the hire is pending activation.");
            }

            if (!hire.PlatformUserId.HasValue)
            {
                throw new InvalidOperationException(
                    "A platform account must exist before the welcome notification can be resent.");
            }
        }

        private static DateTime NormalizeNotificationTimestamp(DateTime value)
        {
            return value == default ? DateTime.UtcNow : value;
        }

        private static string NormalizeFailureReason(string value)
        {
            var normalizedValue = NormalizeOptionalText(
                value,
                nameof(value),
                Hire.MaxWelcomeNotificationFailureReasonLength);

            return string.IsNullOrWhiteSpace(normalizedValue)
                ? "Welcome notification delivery failed."
                : normalizedValue;
        }
    }
}
