using System.Collections.Generic;

namespace JourneyPoint.Application.Services.JourneyService.Dto
{
    /// <summary>
    /// Returns one module section for the signed-in enrolee dashboard.
    /// </summary>
    public class EnroleeJourneyModuleGroupDto
    {
        /// <summary>
        /// Gets or sets the stable dashboard grouping key.
        /// </summary>
        public string ModuleKey { get; set; }

        /// <summary>
        /// Gets or sets the copied module title.
        /// </summary>
        public string ModuleTitle { get; set; }

        /// <summary>
        /// Gets or sets the copied module order index.
        /// </summary>
        public int ModuleOrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the total task count in this module.
        /// </summary>
        public int TotalTaskCount { get; set; }

        /// <summary>
        /// Gets or sets the completed task count in this module.
        /// </summary>
        public int CompletedTaskCount { get; set; }

        /// <summary>
        /// Gets or sets the pending task count in this module.
        /// </summary>
        public int PendingTaskCount { get; set; }

        /// <summary>
        /// Gets or sets the ordered task summaries in this module.
        /// </summary>
        public IReadOnlyList<EnroleeJourneyTaskListItemDto> Tasks { get; set; }
    }
}
