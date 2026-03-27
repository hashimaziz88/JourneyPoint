using System.ComponentModel.DataAnnotations;

namespace JourneyPoint.Application.Services.MarkdownImportService.Dto
{
    /// <summary>
    /// Defines the input required to preview a structured markdown onboarding import.
    /// </summary>
    public class PreviewMarkdownImportRequest
    {
        /// <summary>
        /// Gets or sets the raw markdown content to parse.
        /// </summary>
        [Required]
        public string MarkdownContent { get; set; }

        /// <summary>
        /// Gets or sets the optional source file name used for fallback naming.
        /// </summary>
        [MaxLength(255)]
        public string SourceFileName { get; set; }
    }
}
