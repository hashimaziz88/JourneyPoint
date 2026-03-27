using Abp.Zero.EntityFrameworkCore;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.EntityFrameworkCore
{
    /// <summary>
    /// Entity Framework Core database context for JourneyPoint persistence.
    /// </summary>
    public class JourneyPointDbContext : AbpZeroDbContext<Tenant, Role, User, JourneyPointDbContext>
    {
        /// <summary>
        /// Gets or sets the reusable onboarding plans persisted for tenants.
        /// </summary>
        public DbSet<OnboardingPlan> OnboardingPlans { get; set; }

        /// <summary>
        /// Gets or sets the onboarding modules persisted for reusable plans.
        /// </summary>
        public DbSet<OnboardingModule> OnboardingModules { get; set; }

        /// <summary>
        /// Gets or sets the reusable onboarding tasks persisted for modules.
        /// </summary>
        public DbSet<OnboardingTask> OnboardingTasks { get; set; }

        public JourneyPointDbContext(DbContextOptions<JourneyPointDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(JourneyPointDbContext).Assembly);
        }
    }
}
