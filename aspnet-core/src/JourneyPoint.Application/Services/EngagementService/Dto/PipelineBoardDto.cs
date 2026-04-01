using System;
using System.Collections.Generic;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Engagement.Enums;

namespace JourneyPoint.Application.Services.EngagementService.Dto
{
    /// <summary>
    /// Returns the full facilitator pipeline payload for one tenant.
    /// </summary>
    public class PipelineBoardDto
    {
        public DateTime GeneratedAt { get; set; }

        public string Keyword { get; set; }

        public EngagementClassification? ClassificationFilter { get; set; }

        public List<PipelineColumnDto> Columns { get; set; } = new();
    }
}
