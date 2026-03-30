using JourneyPoint.Domains.Engagement;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.Engagement
{
    /// <summary>
    /// Configures persistence-only rules for append-only engagement snapshots.
    /// </summary>
    internal sealed class EngagementSnapshotConfiguration : IEntityTypeConfiguration<EngagementSnapshot>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for engagement snapshots.
        /// </summary>
        public void Configure(EntityTypeBuilder<EngagementSnapshot> builder)
        {
            builder.ToTable("EngagementSnapshots");

            builder.Property(snapshot => snapshot.Id)
                .ValueGeneratedNever();

            builder.Property(snapshot => snapshot.Classification)
                .HasConversion<int>()
                .IsRequired();

            builder.HasOne(snapshot => snapshot.Hire)
                .WithMany()
                .HasForeignKey(snapshot => snapshot.HireId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(snapshot => snapshot.Journey)
                .WithMany()
                .HasForeignKey(snapshot => snapshot.JourneyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(snapshot => snapshot.TenantId);
            builder.HasIndex(snapshot => new { snapshot.TenantId, snapshot.HireId, snapshot.ComputedAt });
            builder.HasIndex(snapshot => new { snapshot.TenantId, snapshot.JourneyId, snapshot.ComputedAt });
            builder.HasIndex(snapshot => new { snapshot.TenantId, snapshot.Classification });
        }
    }
}
