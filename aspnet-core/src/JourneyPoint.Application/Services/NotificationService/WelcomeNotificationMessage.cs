namespace JourneyPoint.Application.Services.NotificationService
{
    /// <summary>
    /// Carries the transient credentials and addressing data needed for one welcome-notification attempt.
    /// </summary>
    public class WelcomeNotificationMessage
    {
        /// <summary>
        /// Gets or sets the tenant display or tenancy name.
        /// </summary>
        public string TenantName { get; set; }

        /// <summary>
        /// Gets or sets the recipient display name.
        /// </summary>
        public string RecipientName { get; set; }

        /// <summary>
        /// Gets or sets the recipient email address.
        /// </summary>
        public string RecipientEmailAddress { get; set; }

        /// <summary>
        /// Gets or sets the provisioned platform user name.
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets the transient temporary password used for the first login message.
        /// </summary>
        public string TemporaryPassword { get; set; }
    }
}
