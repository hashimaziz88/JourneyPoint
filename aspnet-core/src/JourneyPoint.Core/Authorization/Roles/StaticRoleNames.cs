using System;
using System.Collections.Generic;

namespace JourneyPoint.Authorization.Roles
{
    public static class StaticRoleNames
    {
        public static class Host
        {
            public const string Admin = "Admin";
        }

        public static class Tenants
        {
            public const string Admin = "Admin";
            public const string TenantAdmin = "TenantAdmin";
            public const string Facilitator = "Facilitator";
            public const string Manager = "Manager";
            public const string Enrolee = "Enrolee";

            private static readonly IReadOnlyList<string> StaticRoleNamesList =
                new[]
                {
                    Admin,
                    Facilitator,
                    Manager,
                    Enrolee
                };

            public static IReadOnlyList<string> GetStaticRoleNames()
            {
                return StaticRoleNamesList;
            }

            public static string GetDisplayName(string roleName)
            {
                return NormalizeForClient(roleName);
            }

            public static bool IsTenantAdmin(string roleName)
            {
                return string.Equals(roleName, Admin, StringComparison.OrdinalIgnoreCase)
                    || string.Equals(roleName, TenantAdmin, StringComparison.OrdinalIgnoreCase);
            }

            public static string NormalizeForClient(string roleName)
            {
                return IsTenantAdmin(roleName)
                    ? TenantAdmin
                    : roleName;
            }

            public static int GetClientSortOrder(string roleName)
            {
                switch (NormalizeForClient(roleName))
                {
                    case TenantAdmin:
                        return 0;
                    case Facilitator:
                        return 1;
                    case Manager:
                        return 2;
                    case Enrolee:
                        return 3;
                    default:
                        return 99;
                }
            }
        }
    }
}
