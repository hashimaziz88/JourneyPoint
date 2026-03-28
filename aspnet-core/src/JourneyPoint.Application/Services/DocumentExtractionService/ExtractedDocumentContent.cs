using System.Collections.Generic;

namespace JourneyPoint.Application.Services.DocumentExtractionService
{
    /// <summary>
    /// Represents extracted text and image content derived from one uploaded source document.
    /// </summary>
    public class ExtractedDocumentContent
    {
        /// <summary>
        /// Gets or sets the extracted text content when available.
        /// </summary>
        public string TextContent { get; set; }

        /// <summary>
        /// Gets or sets the extracted image payloads when visual review or OCR is required.
        /// </summary>
        public List<DocumentImageContent> Images { get; set; } = new List<DocumentImageContent>();
    }
}
