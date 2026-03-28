using System.Threading.Tasks;
using Abp.Application.Services;
using JourneyPoint.Sessions.Dto;

namespace JourneyPoint.Sessions
{
    /// <summary>
    /// Exposes session-context operations for the current authenticated user.
    /// </summary>
    public interface ISessionAppService : IApplicationService
    {
        /// <summary>
        /// Returns the current application, tenant, and user login context.
        /// </summary>
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
