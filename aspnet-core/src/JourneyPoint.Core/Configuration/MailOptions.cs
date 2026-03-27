namespace JourneyPoint.Configuration
{
    /// <summary>
    /// Defines configurable settings for outbound mail delivery.
    /// </summary>
    public class MailOptions
    {
        public bool Enabled { get; set; }

        public string Provider { get; set; } = "Smtp";

        public string FromAddress { get; set; } = "no-reply@journeypoint.local";

        public string FromDisplayName { get; set; } = "JourneyPoint";

        public string SmtpHost { get; set; }

        public int SmtpPort { get; set; } = 1025;

        public bool UseSsl { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string PickupDirectory { get; set; }
    }
}
