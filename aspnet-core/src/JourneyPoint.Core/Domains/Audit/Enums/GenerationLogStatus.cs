namespace JourneyPoint.Domains.Audit.Enums
{
    /// <summary>
    /// Describes the outcome of one AI workflow execution.
    /// </summary>
    public enum GenerationLogStatus
    {
        /// <summary>
        /// The workflow completed successfully.
        /// </summary>
        Succeeded = 1,

        /// <summary>
        /// The workflow failed before a usable result was produced.
        /// </summary>
        Failed = 2
    }
}
