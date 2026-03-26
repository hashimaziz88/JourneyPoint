using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;

namespace JourneyPoint.Authorization
{
    public class JourneyPointAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            var journeyPoint = context.CreatePermission(
                PermissionNames.Pages_JourneyPoint,
                L("JourneyPoint"),
                multiTenancySides: MultiTenancySides.Tenant
            );
            journeyPoint.CreateChildPermission(PermissionNames.Pages_JourneyPoint_TenantAdmin, L("TenantAdmin"));
            journeyPoint.CreateChildPermission(PermissionNames.Pages_JourneyPoint_Facilitator, L("Facilitator"));
            journeyPoint.CreateChildPermission(PermissionNames.Pages_JourneyPoint_Manager, L("Manager"));
            journeyPoint.CreateChildPermission(PermissionNames.Pages_JourneyPoint_Enrolee, L("Enrolee"));

            context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            context.CreatePermission(PermissionNames.Pages_Users_Activation, L("UsersActivation"));
            context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, JourneyPointConsts.LocalizationSourceName);
        }
    }
}
