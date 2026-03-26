using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Auditing;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Sessions.Dto;

namespace JourneyPoint.Sessions
{
    public class SessionAppService : JourneyPointAppServiceBase, ISessionAppService
    {
        [DisableAuditing]
        public async Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations()
        {
            var output = new GetCurrentLoginInformationsOutput
            {
                Application = new ApplicationInfoDto
                {
                    Version = AppVersionHelper.Version,
                    ReleaseDate = AppVersionHelper.ReleaseDate,
                    Features = new Dictionary<string, bool>()
                }
            };

            if (AbpSession.TenantId.HasValue)
            {
                output.Tenant = ObjectMapper.Map<TenantLoginInfoDto>(await GetCurrentTenantAsync());
            }

            if (AbpSession.UserId.HasValue)
            {
                var currentUser = await GetCurrentUserAsync();
                var roleNames = (await UserManager.GetRolesAsync(currentUser))
                    .Select(StaticRoleNames.Tenants.NormalizeForClient)
                    .Distinct()
                    .OrderBy(StaticRoleNames.Tenants.GetClientSortOrder)
                    .ThenBy(roleName => roleName)
                    .ToArray();

                var user = ObjectMapper.Map<UserLoginInfoDto>(currentUser);
                user.RoleNames = roleNames;
                user.PrimaryRoleName = roleNames.FirstOrDefault();

                output.User = user;
            }

            return output;
        }
    }
}
