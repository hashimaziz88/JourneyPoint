using System;
using System.Collections.Generic;

namespace JourneyPoint.Authorization.Roles
{
    public static class JourneyPointTenantRolePermissionDefaults
    {
        private static readonly IReadOnlyDictionary<string, string[]> GrantedPermissionsByRole =
            new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase)
            {
                [StaticRoleNames.Tenants.Facilitator] = new[]
                {
                    PermissionNames.Pages_JourneyPoint,
                    PermissionNames.Pages_JourneyPoint_Facilitator
                },
                [StaticRoleNames.Tenants.Manager] = new[]
                {
                    PermissionNames.Pages_JourneyPoint,
                    PermissionNames.Pages_JourneyPoint_Manager
                },
                [StaticRoleNames.Tenants.Enrolee] = new[]
                {
                    PermissionNames.Pages_JourneyPoint,
                    PermissionNames.Pages_JourneyPoint_Enrolee
                }
            };

        public static IReadOnlyList<string> GetDefaultGrantedPermissions(string roleName)
        {
            if (GrantedPermissionsByRole.TryGetValue(roleName, out var permissions))
            {
                return permissions;
            }

            return Array.Empty<string>();
        }
    }
}
