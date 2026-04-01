namespace JourneyPoint.Domains.Engagement.Enums
{
    /// <summary>
    /// Defines the lifecycle states for a durable at-risk intervention record.
    /// </summary>
    public enum AtRiskFlagStatus
    {
        /// <summary>
        /// The hire is currently at risk and the flag has not yet been acknowledged.
        /// </summary>
        Active = 1,

        /// <summary>
        /// A facilitator has acknowledged the risk and the intervention remains open.
        /// </summary>
        Acknowledged = 2,

        /// <summary>
        /// The at-risk episode has been resolved and remains in history.
        /// </summary>
        Resolved = 3
    }
}
