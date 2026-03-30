using JourneyPoint.Domains.Audit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.Audit
{
    /// <summary>
    /// Configures persistence-only rules for AI workflow audit records.
    /// </summary>
    internal sealed class GenerationLogConfiguration : IEntityTypeConfiguration<GenerationLog>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for generation logs.
        /// </summary>
        public void Configure(EntityTypeBuilder<GenerationLog> builder)
        {
            builder.ToTable("GenerationLogs");

            builder.Property(log => log.Id)
                .ValueGeneratedNever();

            builder.Property(log => log.WorkflowType)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(log => log.Status)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(log => log.ModelName)
                .HasMaxLength(GenerationLog.MaxModelNameLength)
                .IsRequired();

            builder.Property(log => log.PromptSummary)
                .HasMaxLength(GenerationLog.MaxPromptSummaryLength)
                .IsRequired();

            builder.Property(log => log.ResponseSummary)
                .HasMaxLength(GenerationLog.MaxResponseSummaryLength);

            builder.Property(log => log.FailureReason)
                .HasMaxLength(GenerationLog.MaxFailureReasonLength);

            builder.HasOne(log => log.Hire)
                .WithMany()
                .HasForeignKey(log => log.HireId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(log => log.Journey)
                .WithMany()
                .HasForeignKey(log => log.JourneyId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(log => log.OnboardingPlan)
                .WithMany()
                .HasForeignKey(log => log.OnboardingPlanId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(log => log.OnboardingDocument)
                .WithMany()
                .HasForeignKey(log => log.OnboardingDocumentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(log => log.TenantId);
            builder.HasIndex(log => new { log.TenantId, log.WorkflowType });
            builder.HasIndex(log => new { log.TenantId, log.Status });
            builder.HasIndex(log => log.HireId);
            builder.HasIndex(log => log.JourneyId);
            builder.HasIndex(log => log.OnboardingPlanId);
            builder.HasIndex(log => log.OnboardingDocumentId);
            builder.HasIndex(log => log.CompletedAt);
        }
    }
}
