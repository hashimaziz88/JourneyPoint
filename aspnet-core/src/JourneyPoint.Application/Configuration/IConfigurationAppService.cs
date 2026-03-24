using System.Threading.Tasks;
using JourneyPoint.Configuration.Dto;

namespace JourneyPoint.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
