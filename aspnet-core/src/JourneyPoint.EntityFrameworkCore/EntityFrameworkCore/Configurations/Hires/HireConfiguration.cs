using JourneyPoint.Domains.Hires;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.Hires
{
    /// <summary>
    /// Configures persistence-only rules for enrolled hires.
    /// </summary>
    internal sealed class HireConfiguration : IEntityTypeConfiguration<Hire>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for the hire aggregate root.
        /// </summary>
        public void Configure(EntityTypeBuilder<Hire> builder)
        {
            builder.ToTable("Hires");

            builder.Property(hire => hire.Id)
                .ValueGeneratedNever();

            builder.Property(hire => hire.Status)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(hire => hire.WelcomeNotificationStatus)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(hire => hire.WelcomeNotificationFailureReason)
                .HasMaxLength(Hire.MaxWelcomeNotificationFailureReasonLength);

            builder.HasOne(hire => hire.OnboardingPlan)
                .WithMany()
                .HasForeignKey(hire => hire.OnboardingPlanId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(hire => hire.Journey)
                .WithOne(journey => journey.Hire)
                .HasForeignKey<Journey>(journey => journey.HireId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(hire => hire.TenantId);
            builder.HasIndex(hire => hire.OnboardingPlanId);
            builder.HasIndex(hire => hire.PlatformUserId);
            builder.HasIndex(hire => hire.ManagerUserId);
            builder.HasIndex(hire => new { hire.TenantId, hire.Status });
            builder.HasIndex(hire => new { hire.TenantId, hire.WelcomeNotificationStatus });
            builder.HasIndex(hire => new { hire.TenantId, hire.EmailAddress });
        }
    }
}
