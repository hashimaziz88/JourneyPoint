using System;

namespace JourneyPoint.Application.Services.OnboardingDocumentService.Dto
{
    /// <summary>
    /// Represents one existing module that extracted proposals can target.
    /// </summary>
    public class DocumentModuleOptionDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int OrderIndex { get; set; }
    }
}
