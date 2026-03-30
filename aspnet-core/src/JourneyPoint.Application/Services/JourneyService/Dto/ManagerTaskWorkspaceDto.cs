using System.Collections.Generic;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Returns the current manager workspace for direct-report task execution.
    /// </summary>
    public class ManagerTaskWorkspaceDto
    {
        public int DirectReportCount { get; set; }

        public int TotalTaskCount { get; set; }

        public int PendingTaskCount { get; set; }

        public int CompletedTaskCount { get; set; }

        public int OverdueTaskCount { get; set; }

        public List<ManagerDirectReportTaskGroupDto> DirectReports { get; set; } = new();
    }
}
