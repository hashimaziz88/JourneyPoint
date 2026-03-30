using System;
using System.Collections.Generic;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Groups manager-assigned tasks for one direct report.
    /// </summary>
    public class ManagerDirectReportTaskGroupDto
    {
        public Guid HireId { get; set; }

        public Guid JourneyId { get; set; }

        public string HireFullName { get; set; }

        public string RoleTitle { get; set; }

        public string Department { get; set; }

        public int PendingTaskCount { get; set; }

        public int CompletedTaskCount { get; set; }

        public List<ManagerAssignedTaskDto> Tasks { get; set; } = new();
    }
}
