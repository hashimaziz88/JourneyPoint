using Abp.Application.Services;
using JourneyPoint.MultiTenancy.Dto;

namespace JourneyPoint.MultiTenancy
{
    /// <summary>
    /// Defines application service operations for host-level tenant management.
    /// </summary>
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}
