using System.Threading.Tasks;

namespace JourneyPoint.Application.Services.NotificationService
{
    /// <summary>
    /// Defines notification delivery for tenant-scoped hire welcome messages.
    /// </summary>
    public interface IWelcomeNotificationService
    {
        /// <summary>
        /// Sends one welcome-notification attempt and returns a recoverable outcome.
        /// </summary>
        Task<WelcomeNotificationDispatchResult> SendAsync(WelcomeNotificationMessage message);
    }
}
