namespace JourneyPoint.Domains.Audit.Enums
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
        Personalisation = 2,

        /// <summary>
        /// Records one wellness check-in question generation run.
        /// </summary>
        WellnessQuestionGeneration = 3,

        /// <summary>
        /// Records one wellness answer AI suggestion run.
        /// </summary>
        WellnessAnswerSuggestion = 4,

        /// <summary>
        /// Records one onboarding plan modules and tasks AI enhancement run.
        /// </summary>
        PlanEnhancement = 5
    }
}
