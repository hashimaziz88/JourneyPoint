using System.Threading.Tasks;
using Abp.Application.Services;
using JourneyPoint.Authorization.Accounts.Dto;

namespace JourneyPoint.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
