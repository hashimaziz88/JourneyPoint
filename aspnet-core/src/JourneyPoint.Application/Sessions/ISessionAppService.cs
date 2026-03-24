using System.Threading.Tasks;
using Abp.Application.Services;
using JourneyPoint.Sessions.Dto;

namespace JourneyPoint.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
