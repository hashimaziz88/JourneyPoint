using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using JourneyPoint.EntityFrameworkCore;
using JourneyPoint.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace JourneyPoint.Web.Tests
{
    [DependsOn(
        typeof(JourneyPointWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class JourneyPointWebTestModule : AbpModule
    {
        public JourneyPointWebTestModule(JourneyPointEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(JourneyPointWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(JourneyPointWebMvcModule).Assembly);
        }
    }
}