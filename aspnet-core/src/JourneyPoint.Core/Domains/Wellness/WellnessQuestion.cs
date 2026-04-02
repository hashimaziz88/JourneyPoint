using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace JourneyPoint.Domains.Wellness
{
    /// <summary>
    /// Represents one AI-generated question inside a wellness check-in, with the hire's answer.
    /// </summary>
    public class WellnessQuestion : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        /// <summary>Maximum length for the question text.</summary>
        public const int MaxQuestionTextLength = 1000;

        /// <summary>Maximum length for the hire's answer text.</summary>
        public const int MaxAnswerTextLength = 3000;

        /// <summary>Maximum length for the AI-suggested answer text.</summary>
        public const int MaxAiSuggestedAnswerLength = 3000;

        /// <summary>
        /// Gets or sets the tenant this question belongs to.
        /// </summary>
        public int TenantId { get; set; }

        /// <summary>
        /// Gets or sets the wellness check-in this question belongs to.
        /// </summary>
        public Guid WellnessCheckInId { get; set; }

        /// <summary>
        /// Gets or sets the navigation property to the parent check-in.
        /// </summary>
        [ForeignKey(nameof(WellnessCheckInId))]
        public virtual WellnessCheckIn WellnessCheckIn { get; set; }

        /// <summary>
        /// Gets or sets the 1-based display order of this question within the check-in.
        /// </summary>
        [Range(1, int.MaxValue)]
        public int OrderIndex { get; set; }

        /// <summary>
        /// Gets or sets the AI-generated question text shown to the hire.
        /// </summary>
        [Required]
        [MaxLength(MaxQuestionTextLength)]
        public string QuestionText { get; set; }

        /// <summary>
        /// Gets or sets the hire's free-text answer to this question.
        /// </summary>
        [MaxLength(MaxAnswerTextLength)]
        public string AnswerText { get; set; }

        /// <summary>
        /// Gets or sets the AI-suggested draft answer generated on hire request.
        /// </summary>
        [MaxLength(MaxAiSuggestedAnswerLength)]
        public string AiSuggestedAnswer { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the hire has answered this question.
        /// </summary>
        public bool IsAnswered { get; set; }
    }
}
