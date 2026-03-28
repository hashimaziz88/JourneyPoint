namespace JourneyPoint.Domains.OnboardingPlans
{
    /// <summary>
    /// Represents the facilitator review state for an extracted task proposal.
    /// </summary>
    public enum ExtractedTaskReviewStatus
    {
        Pending = 1,
        Accepted = 2,
        Rejected = 3,
        Applied = 4
    }
}
