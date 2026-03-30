using System.Collections.Generic;

namespace JourneyPoint.Application.Services.EngagementService.Dto
{
    /// <summary>
    /// Returns one ordered pipeline column and its hire cards.
    /// </summary>
    public class PipelineColumnDto
    {
        public string ColumnKey { get; set; }

        public string ColumnTitle { get; set; }

        public int OrderIndex { get; set; }

        public List<PipelineHireCardDto> Hires { get; set; } = new();
    }
}
