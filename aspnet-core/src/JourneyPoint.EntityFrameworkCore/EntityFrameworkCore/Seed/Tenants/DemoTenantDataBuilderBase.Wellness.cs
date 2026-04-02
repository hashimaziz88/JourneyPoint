using System;
using System.Collections.Generic;
using System.Linq;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Wellness;
using JourneyPoint.Domains.Wellness.Enums;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.EntityFrameworkCore.Seed.Tenants
{
    /// <summary>
    /// Provides wellness check-in seed helpers for tenant-scoped demo data builders.
    /// </summary>
    public abstract partial class DemoTenantDataBuilderBase
    {
        /// <summary>
        /// Seeds a single wellness check-in with its questions for a hire.
        /// </summary>
        protected WellnessCheckIn EnsureWellnessCheckIn(
            Hire hire,
            Journey journey,
            WellnessCheckInPeriod period,
            WellnessCheckInStatus status,
            DateTime scheduledDate,
            DateTime? submittedAt,
            string insightSummary,
            IReadOnlyList<WellnessQuestionSeed> questions)
        {
            var checkIn = Context.WellnessCheckIns
                .IgnoreQueryFilters()
                .SingleOrDefault(existing =>
                    existing.TenantId == Tenant.Id &&
                    existing.HireId == hire.Id &&
                    existing.Period == period);

            if (checkIn == null)
            {
                checkIn = new WellnessCheckIn
                {
                    Id = Guid.NewGuid(),
                    TenantId = Tenant.Id,
                    HireId = hire.Id,
                    JourneyId = journey.Id
                };

                Context.WellnessCheckIns.Add(checkIn);
            }

            checkIn.Period = period;
            checkIn.Status = status;
            checkIn.ScheduledDate = scheduledDate;
            checkIn.SubmittedAt = submittedAt;
            checkIn.InsightSummary = insightSummary;
            Context.SaveChanges();

            foreach (var questionSeed in questions)
            {
                EnsureWellnessQuestion(checkIn, questionSeed);
            }

            return checkIn;
        }

        private void EnsureWellnessQuestion(WellnessCheckIn checkIn, WellnessQuestionSeed seed)
        {
            var question = Context.WellnessQuestions
                .IgnoreQueryFilters()
                .SingleOrDefault(existing =>
                    existing.TenantId == Tenant.Id &&
                    existing.WellnessCheckInId == checkIn.Id &&
                    existing.OrderIndex == seed.OrderIndex);

            if (question == null)
            {
                question = new WellnessQuestion
                {
                    Id = Guid.NewGuid(),
                    TenantId = Tenant.Id,
                    WellnessCheckInId = checkIn.Id
                };

                Context.WellnessQuestions.Add(question);
            }

            question.OrderIndex = seed.OrderIndex;
            question.QuestionText = seed.QuestionText;
            question.AnswerText = seed.AnswerText;
            question.AiSuggestedAnswer = seed.AiSuggestedAnswer;
            question.IsAnswered = seed.IsAnswered;
            Context.SaveChanges();
        }

        /// <summary>
        /// Represents one pre-seeded wellness question within a check-in.
        /// </summary>
        protected sealed record WellnessQuestionSeed(
            int OrderIndex,
            string QuestionText,
            string AnswerText,
            string AiSuggestedAnswer,
            bool IsAnswered);
    }
}
