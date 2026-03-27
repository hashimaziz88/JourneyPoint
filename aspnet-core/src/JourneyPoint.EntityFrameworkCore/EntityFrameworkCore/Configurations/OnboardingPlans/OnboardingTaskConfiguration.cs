using JourneyPoint.Domains.OnboardingPlans;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.OnboardingPlans
{
    /// <summary>
    /// Configures persistence-only rules for onboarding tasks.
    /// </summary>
    internal sealed class OnboardingTaskConfiguration : IEntityTypeConfiguration<OnboardingTask>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for onboarding task templates.
        /// </summary>
        public void Configure(EntityTypeBuilder<OnboardingTask> builder)
        {
            builder.ToTable("OnboardingTasks");

            builder.Property(task => task.Id)
                .ValueGeneratedNever();

            builder.Property(task => task.Category)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(task => task.AssignmentTarget)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(task => task.AcknowledgementRule)
                .HasConversion<int>()
                .IsRequired();

            builder.HasIndex(task => task.TenantId);
            builder.HasIndex(task => task.OnboardingModuleId);
            builder.HasIndex(task => new { task.OnboardingModuleId, task.OrderIndex })
                .IsUnique();
        }
    }
}
