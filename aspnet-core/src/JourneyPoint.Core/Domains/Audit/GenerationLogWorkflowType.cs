namespace JourneyPoint.Domains.Audit
{
    /// <summary>
    /// Identifies the AI workflow recorded by one generation log entry.
    /// </summary>
    public enum GenerationLogWorkflowType
    {
        /// <summary>
        /// Records one onboarding-document extraction or proposal-generation run.
        /// </summary>
        Extraction = 1,

        /// <summary>
        /// Records one hire-journey personalisation run.
        /// </summary>
        Personalisation = 2
    }
}
