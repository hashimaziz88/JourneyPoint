namespace JourneyPoint.Domains.Hires.Enums
{
    /// <summary>
    /// Defines the lifecycle states for an enrolled hire.
    /// </summary>
    public enum HireLifecycleState
    {
        PendingActivation = 1,
        Active = 2,
        Completed = 3,
        Exited = 4
    }
}
