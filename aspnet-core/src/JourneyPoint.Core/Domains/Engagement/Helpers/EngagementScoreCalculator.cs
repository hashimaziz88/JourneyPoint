using System;
using Abp.Domain.Services;

namespace JourneyPoint.Domains.Engagement.Helpers
{
    /// <summary>
    /// Calculates reusable engagement scores from task completion and activity signals.
    /// </summary>
    public class EngagementScoreCalculator : DomainService
    {
        /// <summary>The minimum composite score value.</summary>
        public const decimal MinScore = 0m;

        /// <summary>The maximum composite score value.</summary>
        public const decimal MaxScore = 100m;

        /// <summary>Weighting applied to the completion rate component.</summary>
        public const decimal CompletionWeight = 0.50m;

        /// <summary>Weighting applied to the recency component.</summary>
        public const decimal RecencyWeight = 0.30m;

        /// <summary>Weighting applied to the overdue-task penalty component.</summary>
        public const decimal OverdueWeight = 0.20m;

        /// <summary>Days of inactivity at which the recency score reaches zero.</summary>
        public const int RecencyZeroScoreDay = 14;

        /// <summary>Score penalty subtracted per overdue task.</summary>
        public const int OverduePenaltyPerTask = 25;

        /// <summary>Composite score threshold above which a hire is classified as Healthy.</summary>
        public const decimal HealthyThreshold = 75m;

        /// <summary>Composite score threshold above which a hire is classified as NeedsAttention.</summary>
        public const decimal NeedsAttentionThreshold = 50m;

        /// <summary>
        /// Calculates the engagement score breakdown and classification for one journey state.
        /// </summary>
        public EngagementScoreResult Calculate(EngagementScoreInput input)
        {
            EnsureValidInput(input);

            var completionRate = CalculateCompletionRate(input);
            var recencyScore = CalculateRecencyScore(input.DaysSinceLastActivity);
            var overdueScore = CalculateOverdueScore(input.OverdueTaskCount);
            var compositeScore = CalculateCompositeScore(completionRate, recencyScore, overdueScore);

            return new EngagementScoreResult
            {
                CompletionRate = completionRate,
                CompletionScore = completionRate,
                RecencyScore = recencyScore,
                OverdueScore = overdueScore,
                CompositeScore = compositeScore,
                Classification = Classify(compositeScore),
                ComputedAt = input.ComputedAt
            };
        }

        private static void EnsureValidInput(EngagementScoreInput input)
        {
            if (input == null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            if (input.TotalTaskCount <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(input.TotalTaskCount), "Total task count must be greater than zero.");
            }

            if (input.CompletedTaskCount < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(input.CompletedTaskCount), "Completed task count cannot be negative.");
            }

            if (input.CompletedTaskCount > input.TotalTaskCount)
            {
                throw new ArgumentOutOfRangeException(nameof(input.CompletedTaskCount), "Completed task count cannot exceed the total task count.");
            }

            if (input.DaysSinceLastActivity < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(input.DaysSinceLastActivity), "Days since last activity cannot be negative.");
            }

            if (input.OverdueTaskCount < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(input.OverdueTaskCount), "Overdue task count cannot be negative.");
            }

            if (input.ComputedAt == default)
            {
                throw new ArgumentOutOfRangeException(nameof(input.ComputedAt), "Computed time is required.");
            }
        }

        private static decimal CalculateCompletionRate(EngagementScoreInput input)
        {
            var completionRate = (decimal)input.CompletedTaskCount / input.TotalTaskCount * MaxScore;
            return RoundScore(completionRate);
        }

        private static decimal CalculateRecencyScore(int daysSinceLastActivity)
        {
            if (daysSinceLastActivity >= RecencyZeroScoreDay)
            {
                return MinScore;
            }

            var remainingDays = RecencyZeroScoreDay - daysSinceLastActivity;
            var recencyScore = (decimal)remainingDays / RecencyZeroScoreDay * MaxScore;
            return RoundScore(recencyScore);
        }

        private static decimal CalculateOverdueScore(int overdueTaskCount)
        {
            var overdueScore = MaxScore - (overdueTaskCount * OverduePenaltyPerTask);
            return RoundScore(Math.Clamp(overdueScore, MinScore, MaxScore));
        }

        private static decimal CalculateCompositeScore(
            decimal completionScore,
            decimal recencyScore,
            decimal overdueScore)
        {
            var compositeScore = (completionScore * CompletionWeight) +
                                 (recencyScore * RecencyWeight) +
                                 (overdueScore * OverdueWeight);
            return RoundScore(compositeScore);
        }

        private static EngagementClassification Classify(decimal compositeScore)
        {
            if (compositeScore >= HealthyThreshold)
            {
                return EngagementClassification.Healthy;
            }

            if (compositeScore >= NeedsAttentionThreshold)
            {
                return EngagementClassification.NeedsAttention;
            }

            return EngagementClassification.AtRisk;
        }

        private static decimal RoundScore(decimal value)
        {
            return decimal.Round(value, 2, MidpointRounding.AwayFromZero);
        }
    }
}
