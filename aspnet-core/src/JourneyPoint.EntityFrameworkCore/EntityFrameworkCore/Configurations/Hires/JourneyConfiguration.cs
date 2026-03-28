using JourneyPoint.Domains.Hires;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.Hires
{
    /// <summary>
    /// Configures persistence-only rules for hire-specific onboarding journeys.
    /// </summary>
    internal sealed class JourneyConfiguration : IEntityTypeConfiguration<Journey>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for journeys.
        /// </summary>
        public void Configure(EntityTypeBuilder<Journey> builder)
        {
            builder.ToTable("Journeys");

            builder.Property(journey => journey.Id)
                .ValueGeneratedNever();

            builder.Property(journey => journey.Status)
                .HasConversion<int>()
                .IsRequired();

            builder.HasOne(journey => journey.Hire)
                .WithOne(hire => hire.Journey)
                .HasForeignKey<Journey>(journey => journey.HireId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(journey => journey.OnboardingPlan)
                .WithMany()
                .HasForeignKey(journey => journey.OnboardingPlanId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(journey => journey.Tasks)
                .WithOne(task => task.Journey)
                .HasForeignKey(task => task.JourneyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(journey => journey.TenantId);
            builder.HasIndex(journey => journey.OnboardingPlanId);
            builder.HasIndex(journey => journey.HireId)
                .IsUnique();
            builder.HasIndex(journey => new { journey.TenantId, journey.Status });
        }
    }
}
