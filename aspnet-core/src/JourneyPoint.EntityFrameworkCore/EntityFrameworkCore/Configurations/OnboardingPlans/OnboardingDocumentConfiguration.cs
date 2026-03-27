using JourneyPoint.Domains.OnboardingPlans;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.OnboardingPlans
{
    /// <summary>
    /// Configures persistence-only rules for onboarding enrichment documents.
    /// </summary>
    internal sealed class OnboardingDocumentConfiguration : IEntityTypeConfiguration<OnboardingDocument>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for onboarding documents.
        /// </summary>
        public void Configure(EntityTypeBuilder<OnboardingDocument> builder)
        {
            builder.ToTable("OnboardingDocuments");

            builder.Property(document => document.Id)
                .ValueGeneratedNever();

            builder.Property(document => document.Status)
                .HasConversion<int>()
                .IsRequired();

            builder.HasOne(document => document.OnboardingPlan)
                .WithMany(plan => plan.Documents)
                .HasForeignKey(document => document.OnboardingPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(document => document.ExtractedTasks)
                .WithOne(task => task.OnboardingDocument)
                .HasForeignKey(task => task.OnboardingDocumentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(document => document.TenantId);
            builder.HasIndex(document => document.OnboardingPlanId);
            builder.HasIndex(document => new { document.OnboardingPlanId, document.Status });
        }
    }
}
