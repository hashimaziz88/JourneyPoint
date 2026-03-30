using System.Linq;
using Microsoft.EntityFrameworkCore;
using JourneyPoint.MultiTenancy;

namespace JourneyPoint.EntityFrameworkCore.Seed.Tenants
{
    /// <summary>
    /// Seeds and validates the repository-standard JourneyPoint demo tenants.
    /// </summary>
    public class DemoTenantSeedOrchestrator
    {
        private readonly JourneyPointDbContext _context;

        /// <summary>
        /// Initializes the demo tenant seed orchestrator.
        /// </summary>
        public DemoTenantSeedOrchestrator(JourneyPointDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Creates the Boxfusion and DeptDemo demo tenants with their seed data.
        /// </summary>
        public void Create()
        {
            var boxfusionTenant = EnsureTenant("boxfusion", "Boxfusion");
            new TenantRoleAndUserBuilder(_context, boxfusionTenant.Id).Create();
            new BoxfusionDemoDataBuilder(_context, boxfusionTenant).Create();

            var deptDemoTenant = EnsureTenant("deptdemo", "DeptDemo");
            new TenantRoleAndUserBuilder(_context, deptDemoTenant.Id).Create();
            new DeptDemoDataBuilder(_context, deptDemoTenant).Create();

            new DemoSeedValidator(_context).Validate();
        }

        private Tenant EnsureTenant(string tenancyName, string name)
        {
            var tenant = _context.Tenants
                .IgnoreQueryFilters()
                .SingleOrDefault(existingTenant => existingTenant.TenancyName == tenancyName);

            if (tenant == null)
            {
                tenant = new Tenant(tenancyName, name);
                _context.Tenants.Add(tenant);
                _context.SaveChanges();
                return tenant;
            }

            tenant.Name = name;
            _context.SaveChanges();
            return tenant;
        }
    }
}
