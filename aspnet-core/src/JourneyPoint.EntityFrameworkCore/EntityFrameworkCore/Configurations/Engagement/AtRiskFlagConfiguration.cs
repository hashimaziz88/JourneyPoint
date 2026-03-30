using JourneyPoint.Domains.Engagement;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.Engagement
{
    /// <summary>
    /// Configures persistence-only rules for durable at-risk intervention records.
    /// </summary>
    internal sealed class AtRiskFlagConfiguration : IEntityTypeConfiguration<AtRiskFlag>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for at-risk flags.
        /// </summary>
        public void Configure(EntityTypeBuilder<AtRiskFlag> builder)
        {
            builder.ToTable("AtRiskFlags");

            builder.Property(flag => flag.Id)
                .ValueGeneratedNever();

            builder.Property(flag => flag.ClassificationAtRaise)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(flag => flag.Status)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(flag => flag.ResolutionType)
                .HasConversion<int?>();

            builder.Property(flag => flag.AcknowledgementNotes)
                .HasMaxLength(AtRiskFlag.MaxAcknowledgementNotesLength);

            builder.Property(flag => flag.ResolutionNotes)
                .HasMaxLength(AtRiskFlag.MaxResolutionNotesLength);

            builder.HasOne(flag => flag.Hire)
                .WithMany()
                .HasForeignKey(flag => flag.HireId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(flag => flag.Journey)
                .WithMany()
                .HasForeignKey(flag => flag.JourneyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(flag => flag.TenantId);
            builder.HasIndex(flag => new { flag.TenantId, flag.Status });
            builder.HasIndex(flag => new { flag.TenantId, flag.RaisedAt });
            builder.HasIndex(flag => new { flag.TenantId, flag.HireId, flag.Status });
            builder.HasIndex(flag => flag.JourneyId);
            builder.HasIndex(flag => new { flag.TenantId, flag.HireId })
                .IsUnique()
                .HasFilter("\"Status\" <> 3");
        }
    }
}
