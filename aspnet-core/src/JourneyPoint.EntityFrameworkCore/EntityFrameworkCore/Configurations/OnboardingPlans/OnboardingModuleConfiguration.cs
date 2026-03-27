using JourneyPoint.Domains.OnboardingPlans;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.OnboardingPlans
{
    /// <summary>
    /// Configures persistence-only rules for onboarding modules.
    /// </summary>
    internal sealed class OnboardingModuleConfiguration : IEntityTypeConfiguration<OnboardingModule>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for onboarding modules.
        /// </summary>
        public void Configure(EntityTypeBuilder<OnboardingModule> builder)
        {
            builder.ToTable("OnboardingModules");

            builder.Property(module => module.Id)
                .ValueGeneratedNever();

            builder.HasMany(module => module.Tasks)
                .WithOne(task => task.OnboardingModule)
                .HasForeignKey(task => task.OnboardingModuleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(module => module.TenantId);
            builder.HasIndex(module => module.OnboardingPlanId);
            builder.HasIndex(module => new { module.OnboardingPlanId, module.OrderIndex })
                .IsUnique();
        }
    }
}
