using Abp.Application.Services;
using JourneyPoint.MultiTenancy.Dto;

namespace JourneyPoint.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

