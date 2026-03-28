using System.ComponentModel.DataAnnotations;

namespace JourneyPoint.Application.Services.MarkdownImportService.Dto
{
    /// <summary>
    /// Defines the input required to preview a document-backed onboarding import.
    /// </summary>
    public class PreviewMarkdownImportRequest
    {
        /// <summary>
        /// Gets or sets the raw text content to parse when the source is text-based.
        /// </summary>
        public string MarkdownContent { get; set; }

        /// <summary>
        /// Gets or sets the optional source file name used for fallback naming.
        /// </summary>
        [MaxLength(255)]
        public string SourceFileName { get; set; }

        /// <summary>
        /// Gets or sets the optional source content type used for document extraction.
        /// </summary>
        [MaxLength(200)]
        public string SourceContentType { get; set; }

        /// <summary>
        /// Gets or sets the optional base64-encoded file content used for PDF or image import.
        /// </summary>
        public string Base64Content { get; set; }
    }
}
