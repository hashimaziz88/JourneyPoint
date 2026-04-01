using System.ComponentModel.DataAnnotations;

namespace JourneyPoint.Application.Services.DocumentExtractionService.Dto
{
    /// <summary>
    /// Represents one base64-encoded image passed to backend document normalization.
    /// </summary>
    public class DocumentImageContent
    {
        /// <summary>
        /// Gets or sets the MIME type for the encoded image.
        /// </summary>
        [Required]
        [MaxLength(200)]
        public string MimeType { get; set; }

        /// <summary>
        /// Gets or sets the base64-encoded image payload.
        /// </summary>
        [Required]
        public string Base64Content { get; set; }
    }
}
