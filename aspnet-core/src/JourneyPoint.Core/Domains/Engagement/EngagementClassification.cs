namespace JourneyPoint.Domains.Engagement
{
    /// <summary>
    /// Represents the engagement bands shown in facilitator intelligence views.
    /// </summary>
    public enum EngagementClassification
    {
        /// <summary>
        /// The hire is progressing within the healthy engagement range.
        /// </summary>
        Healthy = 1,

        /// <summary>
        /// The hire needs facilitator attention but is not yet at risk.
        /// </summary>
        NeedsAttention = 2,

        /// <summary>
        /// The hire has fallen into the at-risk engagement range.
        /// </summary>
        AtRisk = 3
    }
}
