using System;
using System.Collections.Generic;

namespace JourneyPoint.Application.Services.OnboardingPlanService.Dto
{
    /// <summary>
    /// Represents one ordered onboarding module in the plan builder contract.
    /// </summary>
    public class OnboardingModuleDto
    {
        public OnboardingModuleDto()
        {
            Tasks = new List<OnboardingTaskDto>();
        }

        /// <summary>
        /// Gets or sets the module identifier.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the module name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the module description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the plan-local module order index.
        /// </summary>
        public int OrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the ordered task collection inside the module.
        /// </summary>
        public List<OnboardingTaskDto> Tasks { get; set; }
    }
}
