using System;
using System.ComponentModel.DataAnnotations;

namespace JourneyPoint.Application.Services.HireService.Dto
{
    /// <summary>
    /// Captures the data required to enrol a hire and provision their platform account.
    /// </summary>
    public class CreateHireRequest
    {
        /// <summary>
        /// Gets or sets the published onboarding plan selected for the hire.
        /// </summary>
        [Required]
        public Guid OnboardingPlanId { get; set; }

        /// <summary>
        /// Gets or sets the hire first name.
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the hire last name.
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the hire email address used for account creation.
        /// </summary>
        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string EmailAddress { get; set; }

        /// <summary>
        /// Gets or sets the optional hire role title.
        /// </summary>
        [MaxLength(200)]
        public string RoleTitle { get; set; }

        /// <summary>
        /// Gets or sets the optional hire department.
        /// </summary>
        [MaxLength(200)]
        public string Department { get; set; }

        /// <summary>
        /// Gets or sets the onboarding start date used for hire activation timing.
        /// </summary>
        [Required]
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Gets or sets the optional manager user id associated to the hire.
        /// </summary>
        public long? ManagerUserId { get; set; }
    }
}
