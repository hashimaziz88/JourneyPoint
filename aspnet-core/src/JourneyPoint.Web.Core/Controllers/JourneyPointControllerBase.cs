using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace JourneyPoint.Controllers
{
    /// <summary>
    /// Base controller for all JourneyPoint API controllers, providing localization and identity error helpers.
    /// </summary>
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
