using Abp.Zero.EntityFrameworkCore;
using JourneyPoint.Authorization.Roles;
using JourneyPoint.Authorization.Users;
using JourneyPoint.Domains.Hires;
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

        /// <summary>
        /// Gets or sets uploaded onboarding documents persisted for published plans.
        /// </summary>
        public DbSet<OnboardingDocument> OnboardingDocuments { get; set; }

        /// <summary>
        /// Gets or sets extracted task proposals persisted for facilitator review.
        /// </summary>
        public DbSet<ExtractedTask> ExtractedTasks { get; set; }

        /// <summary>
        /// Gets or sets tenant-scoped hires enrolled into published onboarding plans.
        /// </summary>
        public DbSet<Hire> Hires { get; set; }

        /// <summary>
        /// Gets or sets hire-specific onboarding journeys generated from plan templates.
        /// </summary>
        public DbSet<Journey> Journeys { get; set; }

        /// <summary>
        /// Gets or sets copied journey tasks persisted per hire journey.
        /// </summary>
        public DbSet<JourneyTask> JourneyTasks { get; set; }

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
