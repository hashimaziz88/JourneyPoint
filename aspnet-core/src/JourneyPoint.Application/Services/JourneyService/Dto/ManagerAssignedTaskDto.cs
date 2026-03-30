using System;
using JourneyPoint.Domains.Hires;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Represents one manager-assigned task for a direct report.
    /// </summary>
    public class ManagerAssignedTaskDto
    {
        public Guid JourneyTaskId { get; set; }

        public Guid JourneyId { get; set; }

        public Guid HireId { get; set; }

        public string HireFullName { get; set; }

        public string RoleTitle { get; set; }

        public string Department { get; set; }

        public string ModuleTitle { get; set; }

        public int ModuleOrderIndex { get; set; }

        public int TaskOrderIndex { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public DateTime DueOn { get; set; }

        public JourneyTaskStatus Status { get; set; }

        public DateTime? CompletedAt { get; set; }

        public bool IsOverdue { get; set; }

        public bool IsPersonalised { get; set; }

        public DateTime? PersonalisedAt { get; set; }

        public bool CanComplete { get; set; }
    }
}
