using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.OnboardingPlanService.Dto
{
    /// <summary>
    /// Defines module input used during onboarding plan create and update operations.
    /// </summary>
    public class UpsertOnboardingModuleDto
    {
        public UpsertOnboardingModuleDto()
        {
            Tasks = new List<UpsertOnboardingTaskDto>();
        }

        /// <summary>
        /// Gets or sets the optional module identifier for existing draft modules.
        /// </summary>
        public Guid? Id { get; set; }

        /// <summary>
        /// Gets or sets the module name.
        /// </summary>
        [Required]
        [MaxLength(OnboardingModule.MaxNameLength)]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the module description.
        /// </summary>
        [Required]
        [MaxLength(OnboardingModule.MaxDescriptionLength)]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the plan-local order index.
        /// </summary>
        [Range(OnboardingModule.MinOrderIndex, int.MaxValue)]
        public int OrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the ordered task collection for the module.
        /// </summary>
        public List<UpsertOnboardingTaskDto> Tasks { get; set; }
    }
}
