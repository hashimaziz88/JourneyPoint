using System;
using System.ComponentModel.DataAnnotations;

namespace JourneyPoint.Application.Services.OnboardingDocumentService.Dto
{
    /// <summary>
    /// Represents one request to upload a plan-level enrichment document.
    /// </summary>
    public class CreateOnboardingDocumentUploadRequest
    {
        [Required]
        public Guid PlanId { get; set; }

        [Required]
        [MaxLength(260)]
        public string FileName { get; set; }

        [Required]
        [MaxLength(200)]
        public string ContentType { get; set; }

        [Required]
        public string Base64Content { get; set; }
    }
}
