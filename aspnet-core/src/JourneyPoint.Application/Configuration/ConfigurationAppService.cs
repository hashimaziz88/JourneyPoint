using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using JourneyPoint.Configuration.Dto;

namespace JourneyPoint.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : JourneyPointAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
