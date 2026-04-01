using System.Threading.Tasks;
using JourneyPoint.Application.Services.DocumentExtractionService.Dto;

namespace JourneyPoint.Application.Services.DocumentExtractionService
{
    /// <summary>
    /// Extracts text or image payloads from uploaded onboarding source documents.
    /// </summary>
    public interface IDocumentContentExtractionService
    {
        /// <summary>
        /// Extracts available text or image content from one document payload.
        /// </summary>
        Task<ExtractedDocumentContent> ExtractAsync(string fileName, string contentType, byte[] content);
    }
}
