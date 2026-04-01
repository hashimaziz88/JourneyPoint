using System;
using JourneyPoint.Domains.Engagement;
using Shouldly;
using Xunit;

namespace JourneyPoint.Tests.Domains
{
    public class EngagementScoreService_Tests
    {
        private readonly EngagementScoreService _service = new();

        private static EngagementScoreInput ValidInput(
            int total = 10,
            int completed = 5,
            int daysSince = 0,
            int overdue = 0) =>
            new()
            {
                TotalTaskCount = total,
                CompletedTaskCount = completed,
                DaysSinceLastActivity = daysSince,
                OverdueTaskCount = overdue,
                ComputedAt = DateTime.UtcNow
            };

        // ─── Validation ────────────────────────────────────────────────────────────

        [Fact]
        public void Calculate_WithNullInput_ThrowsArgumentNullException()
        {
            Should.Throw<ArgumentNullException>(() => _service.Calculate(null));
        }

        [Fact]
        public void Calculate_WithZeroTotalTaskCount_ThrowsArgumentOutOfRangeException()
        {
            var input = ValidInput(total: 0, completed: 0);

            Should.Throw<ArgumentOutOfRangeException>(() => _service.Calculate(input));
        }

        [Fact]
        public void Calculate_WithNegativeCompletedCount_ThrowsArgumentOutOfRangeException()
        {
            var input = ValidInput(total: 10, completed: -1);

            Should.Throw<ArgumentOutOfRangeException>(() => _service.Calculate(input));
        }

        [Fact]
        public void Calculate_WithCompletedExceedingTotal_ThrowsArgumentOutOfRangeException()
        {
            var input = ValidInput(total: 5, completed: 10);

            Should.Throw<ArgumentOutOfRangeException>(() => _service.Calculate(input));
        }

        [Fact]
        public void Calculate_WithNegativeDaysSinceLastActivity_ThrowsArgumentOutOfRangeException()
        {
            var input = ValidInput();
            input.DaysSinceLastActivity = -1;

            Should.Throw<ArgumentOutOfRangeException>(() => _service.Calculate(input));
        }

        [Fact]
        public void Calculate_WithNegativeOverdueTaskCount_ThrowsArgumentOutOfRangeException()
        {
            var input = ValidInput();
            input.OverdueTaskCount = -1;

            Should.Throw<ArgumentOutOfRangeException>(() => _service.Calculate(input));
        }

        [Fact]
        public void Calculate_WithDefaultComputedAt_ThrowsArgumentOutOfRangeException()
        {
            var input = ValidInput();
            input.ComputedAt = default;

            Should.Throw<ArgumentOutOfRangeException>(() => _service.Calculate(input));
        }

        // ─── Completion rate ───────────────────────────────────────────────────────

        [Fact]
        public void Calculate_WithFullCompletion_SetsCompletionRateTo100()
        {
            var input = ValidInput(total: 10, completed: 10, daysSince: 0, overdue: 0);

            var result = _service.Calculate(input);

            result.CompletionRate.ShouldBe(100m);
        }

        [Fact]
        public void Calculate_WithZeroCompletion_SetsCompletionRateTo0()
        {
            var input = ValidInput(total: 10, completed: 0, daysSince: 0, overdue: 0);

            var result = _service.Calculate(input);

            result.CompletionRate.ShouldBe(0m);
        }

        [Fact]
        public void Calculate_WithHalfCompletion_SetsCompletionRateTo50()
        {
            var input = ValidInput(total: 10, completed: 5, daysSince: 0, overdue: 0);

            var result = _service.Calculate(input);

            result.CompletionRate.ShouldBe(50m);
        }

        // ─── Recency score ─────────────────────────────────────────────────────────

        [Fact]
        public void Calculate_WithZeroDaysSinceActivity_SetsRecencyScoreTo100()
        {
            var input = ValidInput(daysSince: 0);

            var result = _service.Calculate(input);

            result.RecencyScore.ShouldBe(100m);
        }

        [Fact]
        public void Calculate_WithActivityAtThreshold_SetsRecencyScoreToZero()
        {
            // RecencyZeroScoreDay = 14
            var input = ValidInput(daysSince: EngagementScoreService.RecencyZeroScoreDay);

            var result = _service.Calculate(input);

            result.RecencyScore.ShouldBe(0m);
        }

        [Fact]
        public void Calculate_WithActivityBeyondThreshold_SetsRecencyScoreToZero()
        {
            var input = ValidInput(daysSince: 30);

            var result = _service.Calculate(input);

            result.RecencyScore.ShouldBe(0m);
        }

        [Fact]
        public void Calculate_WithSevenDaysSinceActivity_SetsRecencyScoreToFiftyPercent()
        {
            // 7 days = 7/14 * 100 = 50
            var input = ValidInput(daysSince: 7);

            var result = _service.Calculate(input);

            result.RecencyScore.ShouldBe(50m);
        }

        // ─── Overdue penalty ───────────────────────────────────────────────────────

        [Fact]
        public void Calculate_WithNoOverdueTasks_SetsOverdueScoreTo100()
        {
            var input = ValidInput(overdue: 0);

            var result = _service.Calculate(input);

            result.OverdueScore.ShouldBe(100m);
        }

        [Fact]
        public void Calculate_WithOneOverdueTask_ReducesOverdueScoreBy25()
        {
            var input = ValidInput(overdue: 1);

            var result = _service.Calculate(input);

            result.OverdueScore.ShouldBe(75m);
        }

        [Fact]
        public void Calculate_WithFourOrMoreOverdueTasks_ClampsOverdueScoreToZero()
        {
            var input = ValidInput(overdue: 5);

            var result = _service.Calculate(input);

            result.OverdueScore.ShouldBe(0m);
        }

        // ─── Composite score ───────────────────────────────────────────────────────

        [Fact]
        public void Calculate_KnownInputs_ProducesExpectedCompositeScore()
        {
            // completion=50, recency=100, overdue=100
            // composite = 50*0.5 + 100*0.3 + 100*0.2 = 25 + 30 + 20 = 75
            var input = ValidInput(total: 10, completed: 5, daysSince: 0, overdue: 0);

            var result = _service.Calculate(input);

            result.CompositeScore.ShouldBe(75m);
        }

        [Fact]
        public void Calculate_PerfectInputs_ProducesScoreOf100()
        {
            var input = ValidInput(total: 10, completed: 10, daysSince: 0, overdue: 0);

            var result = _service.Calculate(input);

            result.CompositeScore.ShouldBe(100m);
        }

        [Fact]
        public void Calculate_WorstCaseInputs_ProducesScoreOf0()
        {
            // completion=0, recency=0 (14+ days), overdue=0 (clamped) => 0
            var input = ValidInput(total: 10, completed: 0, daysSince: 14, overdue: 5);

            var result = _service.Calculate(input);

            result.CompositeScore.ShouldBe(0m);
        }

        // ─── Classification ────────────────────────────────────────────────────────

        [Fact]
        public void Calculate_WithScoreAtOrAbove75_ClassifiesAsHealthy()
        {
            // 10/10 complete, fresh, no overdue → 100 → Healthy
            var input = ValidInput(total: 10, completed: 10, daysSince: 0, overdue: 0);

            var result = _service.Calculate(input);

            result.Classification.ShouldBe(EngagementClassification.Healthy);
        }

        [Fact]
        public void Calculate_WithScoreBetween50And75_ClassifiesAsNeedsAttention()
        {
            // completion=50, recency=100, overdue=100 → composite=75 → Healthy (boundary)
            // Use completion=40 → 40*0.5 + 100*0.3 + 100*0.2 = 20+30+20 = 70 → NeedsAttention
            var input = ValidInput(total: 10, completed: 4, daysSince: 0, overdue: 0);

            var result = _service.Calculate(input);

            result.Classification.ShouldBe(EngagementClassification.NeedsAttention);
        }

        [Fact]
        public void Calculate_WithScoreBelow50_ClassifiesAsAtRisk()
        {
            // completion=0, recency=0, overdue=100 → composite=0*0.5+0*0.3+100*0.2 = 20 → AtRisk
            var input = ValidInput(total: 10, completed: 0, daysSince: 14, overdue: 0);

            var result = _service.Calculate(input);

            result.Classification.ShouldBe(EngagementClassification.AtRisk);
        }

        // ─── Result metadata ───────────────────────────────────────────────────────

        [Fact]
        public void Calculate_PreservesComputedAtTimestamp()
        {
            var timestamp = new DateTime(2025, 6, 1, 12, 0, 0, DateTimeKind.Utc);
            var input = ValidInput();
            input.ComputedAt = timestamp;

            var result = _service.Calculate(input);

            result.ComputedAt.ShouldBe(timestamp);
        }
    }
}
