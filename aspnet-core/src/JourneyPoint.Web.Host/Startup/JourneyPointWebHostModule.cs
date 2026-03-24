using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using JourneyPoint.Configuration;

namespace JourneyPoint.Web.Host.Startup
{
    [DependsOn(
       typeof(JourneyPointWebCoreModule))]
    public class JourneyPointWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public JourneyPointWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(JourneyPointWebHostModule).GetAssembly());
        }
    }
}
