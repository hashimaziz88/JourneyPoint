namespace JourneyPoint.Domains.Wellness.Enums
{
    /// <summary>
    /// Tracks the completion lifecycle of one scheduled wellness check-in.
    /// </summary>
    public enum WellnessCheckInStatus
    {
        /// <summary>Check-in is scheduled but the hire has not yet started it.</summary>
        Pending = 1,

        /// <summary>Check-in has been opened and is partially answered by the hire.</summary>
        InProgress = 2,

        /// <summary>All questions have been answered and the check-in is submitted.</summary>
        Completed = 3,
    }
}
