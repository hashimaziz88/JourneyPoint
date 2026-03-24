using Abp.Authorization;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Authorization.Users;

namespace JourneyPoint.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
