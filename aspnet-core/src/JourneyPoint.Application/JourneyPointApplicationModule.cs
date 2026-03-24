using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using JourneyPoint.Authorization;

namespace JourneyPoint
{
    [DependsOn(
        typeof(JourneyPointCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class JourneyPointApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<JourneyPointAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(JourneyPointApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
