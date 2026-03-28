using JourneyPoint.Domains.Hires;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.Hires
{
    /// <summary>
    /// Configures persistence-only rules for copied journey tasks.
    /// </summary>
    internal sealed class JourneyTaskConfiguration : IEntityTypeConfiguration<JourneyTask>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for journey tasks.
        /// </summary>
        public void Configure(EntityTypeBuilder<JourneyTask> builder)
        {
            builder.ToTable("JourneyTasks");

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

            builder.Property(task => task.Status)
                .HasConversion<int>()
                .IsRequired();

            builder.HasOne(task => task.Journey)
                .WithMany(journey => journey.Tasks)
                .HasForeignKey(task => task.JourneyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(task => task.SourceOnboardingTask)
                .WithMany()
                .HasForeignKey(task => task.SourceOnboardingTaskId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(task => task.SourceOnboardingModule)
                .WithMany()
                .HasForeignKey(task => task.SourceOnboardingModuleId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(task => task.TenantId);
            builder.HasIndex(task => task.JourneyId);
            builder.HasIndex(task => task.SourceOnboardingTaskId);
            builder.HasIndex(task => task.SourceOnboardingModuleId);
            builder.HasIndex(task => new { task.JourneyId, task.ModuleOrderIndex, task.TaskOrderIndex })
                .IsUnique();
            builder.HasIndex(task => new { task.JourneyId, task.Status });
            builder.HasIndex(task => new { task.JourneyId, task.AssignmentTarget });
        }
    }
}
