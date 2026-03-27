using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using JourneyPoint.MultiTenancy;

namespace JourneyPoint.Sessions.Dto
{
    [AutoMapFrom(typeof(Tenant))]
    /// <summary>
    /// Describes the current tenant context returned with session information.
    /// </summary>
    public class TenantLoginInfoDto : EntityDto
    {
        public string TenancyName { get; set; }

        public string Name { get; set; }
    }
}
