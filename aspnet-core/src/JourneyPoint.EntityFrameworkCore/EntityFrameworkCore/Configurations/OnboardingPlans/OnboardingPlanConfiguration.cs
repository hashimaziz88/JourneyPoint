using JourneyPoint.Domains.OnboardingPlans;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.OnboardingPlans
{
    /// <summary>
    /// Configures persistence-only rules for onboarding plans.
    /// </summary>
    internal sealed class OnboardingPlanConfiguration : IEntityTypeConfiguration<OnboardingPlan>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for the onboarding plan aggregate root.
        /// </summary>
        public void Configure(EntityTypeBuilder<OnboardingPlan> builder)
        {
            builder.ToTable("OnboardingPlans");

            builder.Property(plan => plan.Id)
                .ValueGeneratedNever();

            builder.Property(plan => plan.Status)
                .HasConversion<int>()
                .IsRequired();

            builder.HasMany(plan => plan.Modules)
                .WithOne(module => module.OnboardingPlan)
                .HasForeignKey(module => module.OnboardingPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(plan => plan.Documents)
                .WithOne(document => document.OnboardingPlan)
                .HasForeignKey(document => document.OnboardingPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(plan => plan.TenantId);
            builder.HasIndex(plan => new { plan.TenantId, plan.Status });
        }
    }
}
