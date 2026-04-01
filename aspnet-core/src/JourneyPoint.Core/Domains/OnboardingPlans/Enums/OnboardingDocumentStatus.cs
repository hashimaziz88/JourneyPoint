namespace JourneyPoint.Domains.OnboardingPlans.Enums
{
    /// <summary>
    /// Represents the extraction lifecycle for an uploaded onboarding document.
    /// </summary>
    public enum OnboardingDocumentStatus
    {
        Uploaded = 1,
        Extracting = 2,
        ReadyForReview = 3,
        Applied = 4,
        Failed = 5
    }
}
