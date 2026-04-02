using System;
using System.Collections.Generic;
using JourneyPoint.Domains.Wellness.Enums;

namespace JourneyPoint.Application.Services.WellnessService.Dto
{
    /// <summary>
    /// Summary item returned when listing check-ins for a hire.
    /// </summary>
    public class WellnessCheckInSummaryDto
    {
        /// <summary>Gets or sets the check-in identifier.</summary>
        public Guid Id { get; set; }

        /// <summary>Gets or sets the milestone period.</summary>
        public WellnessCheckInPeriod Period { get; set; }

        /// <summary>Gets or sets a human-readable period label.</summary>
        public string PeriodLabel { get; set; }

        /// <summary>Gets or sets the current status of this check-in.</summary>
        public WellnessCheckInStatus Status { get; set; }

        /// <summary>Gets or sets the scheduled date for this check-in.</summary>
        public DateTime ScheduledDate { get; set; }

        /// <summary>Gets or sets when the hire submitted this check-in, if completed.</summary>
        public DateTime? SubmittedAt { get; set; }

        /// <summary>Gets or sets the number of answered questions.</summary>
        public int AnsweredCount { get; set; }

        /// <summary>Gets or sets the total number of questions.</summary>
        public int TotalCount { get; set; }
    }

    /// <summary>
    /// Full check-in detail returned to the hire for answering, or to facilitators/managers for review.
    /// </summary>
    public class WellnessCheckInDetailDto
    {
        /// <summary>Gets or sets the check-in identifier.</summary>
        public Guid Id { get; set; }

        /// <summary>Gets or sets the hire identifier.</summary>
        public Guid HireId { get; set; }

        /// <summary>Gets or sets the hire's full name.</summary>
        public string HireFullName { get; set; }

        /// <summary>Gets or sets the milestone period.</summary>
        public WellnessCheckInPeriod Period { get; set; }

        /// <summary>Gets or sets a human-readable period label.</summary>
        public string PeriodLabel { get; set; }

        /// <summary>Gets or sets the current status of this check-in.</summary>
        public WellnessCheckInStatus Status { get; set; }

        /// <summary>Gets or sets the scheduled date for this check-in.</summary>
        public DateTime ScheduledDate { get; set; }

        /// <summary>Gets or sets when the hire submitted this check-in, if completed.</summary>
        public DateTime? SubmittedAt { get; set; }

        /// <summary>Gets or sets the AI-generated insight summary for completed check-ins.</summary>
        public string InsightSummary { get; set; }

        /// <summary>Gets or sets the ordered list of questions and answers.</summary>
        public List<WellnessQuestionDto> Questions { get; set; } = new();
    }

    /// <summary>
    /// One wellness question with the hire's current answer state.
    /// </summary>
    public class WellnessQuestionDto
    {
        /// <summary>Gets or sets the question identifier.</summary>
        public Guid Id { get; set; }

        /// <summary>Gets or sets the 1-based display order.</summary>
        public int OrderIndex { get; set; }

        /// <summary>Gets or sets the AI-generated question text.</summary>
        public string QuestionText { get; set; }

        /// <summary>Gets or sets the hire's current answer text.</summary>
        public string AnswerText { get; set; }

        /// <summary>Gets or sets the AI-suggested draft answer, if generated.</summary>
        public string AiSuggestedAnswer { get; set; }

        /// <summary>Gets or sets a value indicating whether this question has been answered.</summary>
        public bool IsAnswered { get; set; }
    }

    /// <summary>
    /// Request to save one answer for a wellness question.
    /// </summary>
    public class SaveWellnessAnswerRequest
    {
        /// <summary>Gets or sets the wellness check-in identifier.</summary>
        public Guid CheckInId { get; set; }

        /// <summary>Gets or sets the wellness question identifier.</summary>
        public Guid QuestionId { get; set; }

        /// <summary>Gets or sets the hire's answer text.</summary>
        public string AnswerText { get; set; }
    }

    /// <summary>
    /// Request to submit an entire wellness check-in.
    /// </summary>
    public class SubmitWellnessCheckInRequest
    {
        /// <summary>Gets or sets the wellness check-in identifier to submit.</summary>
        public Guid CheckInId { get; set; }
    }

    /// <summary>
    /// Request to generate an AI answer suggestion for one wellness question.
    /// </summary>
    public class GenerateWellnessAnswerSuggestionRequest
    {
        /// <summary>Gets or sets the wellness check-in identifier.</summary>
        public Guid CheckInId { get; set; }

        /// <summary>Gets or sets the wellness question identifier.</summary>
        public Guid QuestionId { get; set; }
    }

    /// <summary>
    /// Wellness tracker overview for one hire, returned to facilitators and managers.
    /// </summary>
    public class HireWellnessOverviewDto
    {
        /// <summary>Gets or sets the hire identifier.</summary>
        public Guid HireId { get; set; }

        /// <summary>Gets or sets the hire's full name.</summary>
        public string HireFullName { get; set; }

        /// <summary>Gets or sets the summary items for all scheduled check-ins.</summary>
        public List<WellnessCheckInSummaryDto> CheckIns { get; set; } = new();

        /// <summary>Gets or sets the number of completed check-ins.</summary>
        public int CompletedCount { get; set; }

        /// <summary>Gets or sets the total number of scheduled check-ins.</summary>
        public int TotalCount { get; set; }
    }
}
