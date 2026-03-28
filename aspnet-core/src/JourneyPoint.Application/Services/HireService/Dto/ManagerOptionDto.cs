namespace JourneyPoint.Application.Services.HireService.Dto
{
    /// <summary>
    /// Returns one manager option for facilitator hire enrolment.
    /// </summary>
    public class ManagerOptionDto
    {
        /// <summary>
        /// Gets or sets the manager user id.
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// Gets or sets the manager display name.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets or sets the manager email address.
        /// </summary>
        public string EmailAddress { get; set; }
    }
}
