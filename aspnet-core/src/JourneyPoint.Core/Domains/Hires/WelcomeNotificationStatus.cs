namespace JourneyPoint.Domains.Hires
{
    /// <summary>
    /// Represents the recoverable delivery state for the hire welcome notification.
    /// </summary>
    public enum WelcomeNotificationStatus
    {
        /// <summary>
        /// Welcome delivery has not yet succeeded or failed.
        /// </summary>
        Pending = 0,

        /// <summary>
        /// Welcome delivery completed successfully.
        /// </summary>
        Sent = 1,

        /// <summary>
        /// Welcome delivery failed, but the facilitator can retry later.
        /// </summary>
        FailedRecoverable = 2
    }
}
