namespace JourneyPoint.Domains.Hires.Enums
{
    /// <summary>
    /// Defines the lifecycle states for a hire-specific onboarding journey.
    /// </summary>
    public enum JourneyStatus
    {
        Draft = 1,
        Active = 2,
        Paused = 3,
        Completed = 4
    }
}
