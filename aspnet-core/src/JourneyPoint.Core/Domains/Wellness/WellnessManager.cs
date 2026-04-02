using System;
using System.Collections.Generic;
using Abp.Domain.Services;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Wellness.Enums;

namespace JourneyPoint.Domains.Wellness
{
    /// <summary>
    /// Encapsulates aggregate rules for wellness check-in scheduling, question assignment,
    /// answer capture, and submission lifecycle.
    /// </summary>
    public class WellnessManager : DomainService
    {
        /// <summary>
        /// Determines the set of wellness check-in periods appropriate for the given journey
        /// duration and returns them ordered by scheduled date offset.
        /// </summary>
        public IReadOnlyList<(WellnessCheckInPeriod Period, int DayOffset)> GetScheduledPeriods(int durationDays)
        {
            if (durationDays <= 0)
            {
                throw new ArgumentException("Duration must be positive.", nameof(durationDays));
            }

            var periods = new List<(WellnessCheckInPeriod, int)>
            {
                (WellnessCheckInPeriod.Day1, 0),
                (WellnessCheckInPeriod.Day2, 1),
                (WellnessCheckInPeriod.Week1, 6),
            };

            var monthOffsets = new[]
            {
                (WellnessCheckInPeriod.Month1, 29),
                (WellnessCheckInPeriod.Month2, 59),
                (WellnessCheckInPeriod.Month3, 89),
                (WellnessCheckInPeriod.Month4, 119),
                (WellnessCheckInPeriod.Month5, 149),
                (WellnessCheckInPeriod.Month6, 179),
            };

            foreach (var (period, offset) in monthOffsets)
            {
                if (offset < durationDays)
                {
                    periods.Add((period, offset));
                }
            }

            return periods.AsReadOnly();
        }

        /// <summary>
        /// Creates a new wellness check-in for a hire at the given period milestone.
        /// </summary>
        public WellnessCheckIn CreateCheckIn(
            Hire hire,
            Journey journey,
            WellnessCheckInPeriod period,
            int dayOffset)
        {
            ArgumentNullException.ThrowIfNull(hire);
            ArgumentNullException.ThrowIfNull(journey);

            return new WellnessCheckIn
            {
                Id = Guid.NewGuid(),
                TenantId = hire.TenantId,
                HireId = hire.Id,
                JourneyId = journey.Id,
                Period = period,
                Status = WellnessCheckInStatus.Pending,
                ScheduledDate = hire.StartDate.AddDays(dayOffset).Date
            };
        }

        /// <summary>
        /// Adds AI-generated questions to an existing pending check-in.
        /// Replaces any previously generated questions for idempotency.
        /// </summary>
        public void AssignQuestions(WellnessCheckIn checkIn, IReadOnlyList<string> questionTexts)
        {
            ArgumentNullException.ThrowIfNull(checkIn);

            if (checkIn.Status != WellnessCheckInStatus.Pending)
            {
                throw new InvalidOperationException("Questions can only be assigned to pending check-ins.");
            }

            if (questionTexts == null || questionTexts.Count == 0)
            {
                throw new InvalidOperationException("At least one question is required.");
            }

            checkIn.Questions.Clear();

            for (var index = 0; index < questionTexts.Count; index++)
            {
                var text = questionTexts[index]?.Trim();

                if (string.IsNullOrWhiteSpace(text))
                {
                    continue;
                }

                checkIn.Questions.Add(new WellnessQuestion
                {
                    Id = Guid.NewGuid(),
                    TenantId = checkIn.TenantId,
                    WellnessCheckInId = checkIn.Id,
                    OrderIndex = index + 1,
                    QuestionText = text,
                    IsAnswered = false
                });
            }
        }

        /// <summary>
        /// Records an answer to one wellness question and marks it as answered.
        /// Transitions the parent check-in to InProgress if it was Pending.
        /// </summary>
        public void RecordAnswer(WellnessCheckIn checkIn, WellnessQuestion question, string answerText)
        {
            ArgumentNullException.ThrowIfNull(checkIn);
            ArgumentNullException.ThrowIfNull(question);

            if (checkIn.Status == WellnessCheckInStatus.Completed)
            {
                throw new InvalidOperationException("Answers cannot be modified on a completed check-in.");
            }

            if (question.WellnessCheckInId != checkIn.Id)
            {
                throw new InvalidOperationException("The question does not belong to the provided check-in.");
            }

            question.AnswerText = answerText?.Trim();
            question.IsAnswered = !string.IsNullOrWhiteSpace(question.AnswerText);

            if (checkIn.Status == WellnessCheckInStatus.Pending)
            {
                checkIn.Status = WellnessCheckInStatus.InProgress;
            }
        }

        /// <summary>
        /// Sets an AI-suggested answer on a question without marking it as answered.
        /// The hire must still explicitly save their answer.
        /// </summary>
        public void SetAiSuggestedAnswer(WellnessQuestion question, string suggestedAnswer)
        {
            ArgumentNullException.ThrowIfNull(question);
            question.AiSuggestedAnswer = suggestedAnswer?.Trim();
        }

        /// <summary>
        /// Submits the check-in, marking it completed. All questions must have answers.
        /// </summary>
        public void SubmitCheckIn(WellnessCheckIn checkIn)
        {
            ArgumentNullException.ThrowIfNull(checkIn);

            if (checkIn.Status == WellnessCheckInStatus.Completed)
            {
                throw new InvalidOperationException("Check-in is already submitted.");
            }

            if (checkIn.Status == WellnessCheckInStatus.Pending)
            {
                throw new InvalidOperationException("Check-in has not been started.");
            }

            checkIn.Status = WellnessCheckInStatus.Completed;
            checkIn.SubmittedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Stores the AI-generated insight summary on a completed check-in for manager review.
        /// </summary>
        public void SetInsightSummary(WellnessCheckIn checkIn, string insightSummary)
        {
            ArgumentNullException.ThrowIfNull(checkIn);
            checkIn.InsightSummary = insightSummary?.Trim();
        }
    }
}
