namespace JourneyPoint.Application.Services.MarkdownImportService.Dto
{
    /// <summary>
    /// Represents one parser warning returned during markdown preview.
    /// </summary>
    public class MarkdownImportWarningDto
    {
        /// <summary>
        /// Gets or sets the machine-readable warning code.
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// Gets or sets the human-readable warning message.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Gets or sets the optional line number associated with the warning.
        /// </summary>
        public int? LineNumber { get; set; }

        /// <summary>
        /// Gets or sets the optional section label associated with the warning.
        /// </summary>
        public string SectionName { get; set; }
    }
}
