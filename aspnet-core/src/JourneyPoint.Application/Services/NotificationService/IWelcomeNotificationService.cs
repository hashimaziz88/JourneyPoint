using System.Threading.Tasks;
using JourneyPoint.Application.Services.NotificationService.Dto;

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
