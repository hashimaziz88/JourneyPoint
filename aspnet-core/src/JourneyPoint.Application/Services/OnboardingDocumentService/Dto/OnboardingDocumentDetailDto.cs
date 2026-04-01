using System;
using System.Collections.Generic;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Application.Services.OnboardingDocumentService.Dto
{
    /// <summary>
    /// Represents one uploaded document and its extracted task proposals.
    /// </summary>
    public class OnboardingDocumentDetailDto
    {
        public Guid Id { get; set; }

        public Guid PlanId { get; set; }

        public string PlanName { get; set; }

        public string FileName { get; set; }

        public string ContentType { get; set; }

        public long FileSizeBytes { get; set; }

        public OnboardingDocumentStatus Status { get; set; }

        public int ExtractedTaskCount { get; set; }

        public int AcceptedTaskCount { get; set; }

        public int AppliedTaskCount { get; set; }

        public string FailureReason { get; set; }

        public DateTime CreationTime { get; set; }

        public DateTime? ExtractionCompletedTime { get; set; }

        public List<DocumentModuleOptionDto> AvailableModules { get; set; } = new();

        public List<ExtractedTaskProposalDto> Proposals { get; set; } = new();
    }
}
