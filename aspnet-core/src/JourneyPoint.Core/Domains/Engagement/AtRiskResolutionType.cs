namespace JourneyPoint.Domains.Engagement
{
    /// <summary>
    /// Classifies how one at-risk episode was resolved.
    /// </summary>
    public enum AtRiskResolutionType
    {
        /// <summary>
        /// A facilitator manually resolved the flag after intervention.
        /// </summary>
        ManualFacilitatorResolution = 1,

        /// <summary>
        /// The hire returned to the healthy range through later engagement activity.
        /// </summary>
        AutomaticHealthyRecovery = 2,

        /// <summary>
        /// The hire exited the onboarding flow before the risk episode was otherwise cleared.
        /// </summary>
        HireExited = 3
    }
}
