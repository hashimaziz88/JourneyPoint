using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace JourneyPoint.Controllers
{
    public abstract class JourneyPointControllerBase: AbpController
    {
        protected JourneyPointControllerBase()
        {
            LocalizationSourceName = JourneyPointConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
