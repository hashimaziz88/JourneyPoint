using JourneyPoint.Domains.Wellness;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.Wellness
{
    /// <summary>
    /// Configures persistence rules for hire wellness check-ins.
    /// </summary>
    internal sealed class WellnessCheckInConfiguration : IEntityTypeConfiguration<WellnessCheckIn>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for wellness check-ins.
        /// </summary>
        public void Configure(EntityTypeBuilder<WellnessCheckIn> builder)
        {
            builder.ToTable("WellnessCheckIns");

            builder.Property(c => c.Id)
                .ValueGeneratedNever();

            builder.Property(c => c.Period)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(c => c.Status)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(c => c.InsightSummary)
                .HasMaxLength(WellnessCheckIn.MaxInsightSummaryLength);

            builder.HasOne(c => c.Hire)
                .WithMany()
                .HasForeignKey(c => c.HireId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.Journey)
                .WithMany()
                .HasForeignKey(c => c.JourneyId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(c => c.Questions)
                .WithOne(q => q.WellnessCheckIn)
                .HasForeignKey(q => q.WellnessCheckInId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(c => c.TenantId);
            builder.HasIndex(c => c.HireId);
            builder.HasIndex(c => c.JourneyId);
            builder.HasIndex(c => new { c.HireId, c.Period }).IsUnique();
            builder.HasIndex(c => new { c.TenantId, c.Status });
        }
    }
}
