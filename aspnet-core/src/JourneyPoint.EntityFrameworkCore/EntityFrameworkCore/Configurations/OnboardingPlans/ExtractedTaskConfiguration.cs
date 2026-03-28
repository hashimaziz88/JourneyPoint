using JourneyPoint.Domains.OnboardingPlans;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.OnboardingPlans
{
    /// <summary>
    /// Configures persistence-only rules for extracted onboarding task proposals.
    /// </summary>
    internal sealed class ExtractedTaskConfiguration : IEntityTypeConfiguration<ExtractedTask>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for extracted task proposals.
        /// </summary>
        public void Configure(EntityTypeBuilder<ExtractedTask> builder)
        {
            builder.ToTable("ExtractedTasks");

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

            builder.Property(task => task.ReviewStatus)
                .HasConversion<int>()
                .IsRequired();

            builder.HasIndex(task => task.TenantId);
            builder.HasIndex(task => task.OnboardingDocumentId);
            builder.HasIndex(task => new { task.OnboardingDocumentId, task.ReviewStatus });
            builder.HasIndex(task => task.SuggestedModuleId);
        }
    }
}
