using JourneyPoint.Domains.Wellness;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JourneyPoint.EntityFrameworkCore.Configurations.Wellness
{
    /// <summary>
    /// Configures persistence rules for wellness check-in questions and answers.
    /// </summary>
    internal sealed class WellnessQuestionConfiguration : IEntityTypeConfiguration<WellnessQuestion>
    {
        /// <summary>
        /// Applies Entity Framework Core configuration for wellness questions.
        /// </summary>
        public void Configure(EntityTypeBuilder<WellnessQuestion> builder)
        {
            builder.ToTable("WellnessQuestions");

            builder.Property(q => q.Id)
                .ValueGeneratedNever();

            builder.Property(q => q.QuestionText)
                .HasMaxLength(WellnessQuestion.MaxQuestionTextLength)
                .IsRequired();

            builder.Property(q => q.AnswerText)
                .HasMaxLength(WellnessQuestion.MaxAnswerTextLength);

            builder.Property(q => q.AiSuggestedAnswer)
                .HasMaxLength(WellnessQuestion.MaxAiSuggestedAnswerLength);

            builder.HasIndex(q => q.TenantId);
            builder.HasIndex(q => q.WellnessCheckInId);
            builder.HasIndex(q => new { q.WellnessCheckInId, q.OrderIndex });
        }
    }
}
