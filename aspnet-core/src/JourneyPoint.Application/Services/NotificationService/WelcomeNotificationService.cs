using System;
using System.IO;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Abp.Dependency;
using JourneyPoint.Application.Services.NotificationService.Dto;
using JourneyPoint.Configuration;
using Microsoft.Extensions.Options;

namespace JourneyPoint.Application.Services.NotificationService
{
    /// <summary>
    /// Sends onboarding welcome notifications through the configured mail provider.
    /// </summary>
    public class WelcomeNotificationService : IWelcomeNotificationService, ITransientDependency
    {
        private readonly MailOptions _mailOptions;

        /// <summary>
        /// Initializes the service with the configured mail options.
        /// </summary>
        public WelcomeNotificationService(IOptions<MailOptions> mailOptions)
        {
            _mailOptions = mailOptions?.Value ?? new MailOptions();
        }

        /// <summary>
        /// Sends one welcome-notification attempt and returns a recoverable result for the hire workflow.
        /// </summary>
        public async Task<WelcomeNotificationDispatchResult> SendAsync(WelcomeNotificationMessage message)
        {
            var attemptedAt = DateTime.UtcNow;

            try
            {
                ValidateMessage(message);

                if (!_mailOptions.Enabled)
                {
                    return CreateFailureResult(attemptedAt, "Mail delivery is disabled.");
                }

                using var mailMessage = BuildMailMessage(message);
                using var smtpClient = BuildSmtpClient();
                await smtpClient.SendMailAsync(mailMessage);

                return new WelcomeNotificationDispatchResult
                {
                    Succeeded = true,
                    AttemptedAt = attemptedAt,
                    SentAt = attemptedAt
                };
            }
            catch (Exception exception)
            {
                return CreateFailureResult(attemptedAt, exception.Message);
            }
        }

        private MailMessage BuildMailMessage(WelcomeNotificationMessage message)
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress(_mailOptions.FromAddress, _mailOptions.FromDisplayName),
                Subject = "Welcome to JourneyPoint",
                Body = BuildBody(message),
                IsBodyHtml = false
            };

            mailMessage.To.Add(new MailAddress(message.RecipientEmailAddress, message.RecipientName));
            return mailMessage;
        }

        private SmtpClient BuildSmtpClient()
        {
            var smtpClient = new SmtpClient();
            if (UsesPickupDirectory())
            {
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory;
                smtpClient.PickupDirectoryLocation = ResolvePickupDirectory();
                return smtpClient;
            }

            smtpClient.Host = _mailOptions.SmtpHost;
            smtpClient.Port = _mailOptions.SmtpPort;
            smtpClient.EnableSsl = _mailOptions.UseSsl;

            if (!string.IsNullOrWhiteSpace(_mailOptions.UserName))
            {
                smtpClient.Credentials = new System.Net.NetworkCredential(
                    _mailOptions.UserName,
                    _mailOptions.Password ?? string.Empty);
            }

            return smtpClient;
        }

        private static WelcomeNotificationDispatchResult CreateFailureResult(DateTime attemptedAt, string failureReason)
        {
            return new WelcomeNotificationDispatchResult
            {
                Succeeded = false,
                AttemptedAt = attemptedAt,
                FailureReason = TruncateFailureReason(failureReason)
            };
        }

        private static void ValidateMessage(WelcomeNotificationMessage message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            if (string.IsNullOrWhiteSpace(message.RecipientEmailAddress))
            {
                throw new InvalidOperationException("Recipient email address is required.");
            }

            if (string.IsNullOrWhiteSpace(message.UserName))
            {
                throw new InvalidOperationException("User name is required for welcome delivery.");
            }

            if (string.IsNullOrWhiteSpace(message.TemporaryPassword))
            {
                throw new InvalidOperationException("Temporary password is required for welcome delivery.");
            }
        }

        private static string BuildBody(WelcomeNotificationMessage message)
        {
            var builder = new StringBuilder();
            builder.AppendLine($"Hello {message.RecipientName},");
            builder.AppendLine();
            builder.AppendLine($"Welcome to {message.TenantName ?? "JourneyPoint"}.");
            builder.AppendLine("Your account has been created with the following temporary credentials:");
            builder.AppendLine($"Username: {message.UserName}");
            builder.AppendLine($"Temporary password: {message.TemporaryPassword}");
            builder.AppendLine();
            builder.AppendLine("Please sign in and change your password as soon as possible.");
            return builder.ToString();
        }

        private static string TruncateFailureReason(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return "Welcome notification delivery failed.";
            }

            return value.Length <= 500
                ? value
                : value.Substring(0, 500);
        }

        private bool UsesPickupDirectory()
        {
            return string.Equals(_mailOptions.Provider, "PickupDirectory", StringComparison.OrdinalIgnoreCase)
                && !string.IsNullOrWhiteSpace(_mailOptions.PickupDirectory);
        }

        private string ResolvePickupDirectory()
        {
            var pickupDirectory = _mailOptions.PickupDirectory;
            if (Path.IsPathRooted(pickupDirectory))
            {
                Directory.CreateDirectory(pickupDirectory);
                return pickupDirectory;
            }

            var absolutePath = Path.Combine(AppContext.BaseDirectory, pickupDirectory);
            Directory.CreateDirectory(absolutePath);
            return absolutePath;
        }
    }
}
