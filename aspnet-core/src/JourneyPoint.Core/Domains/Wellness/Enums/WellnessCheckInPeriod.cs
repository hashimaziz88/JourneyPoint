namespace JourneyPoint.Domains.Wellness.Enums
{
    /// <summary>
    /// Identifies the scheduled milestone period for one wellness check-in.
    /// </summary>
    public enum WellnessCheckInPeriod
    {
        /// <summary>Day 1 of onboarding — first check-in.</summary>
        Day1 = 1,

        /// <summary>Day 2 of onboarding — second check-in.</summary>
        Day2 = 2,

        /// <summary>End of week 1 (day 7) — third check-in.</summary>
        Week1 = 3,

        /// <summary>Month 1 (day 30) — first monthly check-in.</summary>
        Month1 = 4,

        /// <summary>Month 2 (day 60) — second monthly check-in.</summary>
        Month2 = 5,

        /// <summary>Month 3 (day 90) — third monthly check-in.</summary>
        Month3 = 6,

        /// <summary>Month 4 (day 120) — fourth monthly check-in.</summary>
        Month4 = 7,

        /// <summary>Month 5 (day 150) — fifth monthly check-in.</summary>
        Month5 = 8,

        /// <summary>Month 6 (day 180) — sixth monthly check-in.</summary>
        Month6 = 9,
    }
}
