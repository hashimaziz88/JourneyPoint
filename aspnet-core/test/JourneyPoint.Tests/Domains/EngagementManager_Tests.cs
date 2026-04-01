using System;
using System.Collections.ObjectModel;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;
using Shouldly;
using Xunit;

namespace JourneyPoint.Tests.Domains
{
    public class EngagementManager_Tests
    {
        private readonly EngagementManager _manager = new();

        // ─── Helpers ───────────────────────────────────────────────────────────────

        private static Hire MakeHire(int tenantId = 1)
        {
            var planId = Guid.NewGuid();
            return new Hire
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                OnboardingPlanId = planId,
                FullName = "Test Hire",
                EmailAddress = "hire@example.com",
                StartDate = DateTime.Today,
                Status = HireLifecycleState.Active,
                WelcomeNotificationStatus = WelcomeNotificationStatus.Sent
            };
        }

        private static Journey MakeJourneyFor(Hire hire)
        {
            var journey = new Journey
            {
                Id = Guid.NewGuid(),
                TenantId = hire.TenantId,
                HireId = hire.Id,
                OnboardingPlanId = hire.OnboardingPlanId,
                Status = JourneyStatus.Active,
                Tasks = new Collection<JourneyTask>()
            };
            hire.Journey = journey;
            return journey;
        }

        private static EngagementScoreInput MakeInput() =>
            new()
            {
                TotalTaskCount = 10,
                CompletedTaskCount = 5,
                DaysSinceLastActivity = 2,
                OverdueTaskCount = 0,
                ComputedAt = DateTime.UtcNow
            };

        private static EngagementScoreResult MakeResult(EngagementClassification classification = EngagementClassification.Healthy) =>
            new()
            {
                CompletionRate = 50m,
                CompletionScore = 50m,
                RecencyScore = 100m,
                OverdueScore = 100m,
                CompositeScore = 75m,
                Classification = classification,
                ComputedAt = DateTime.UtcNow
            };

        private static AtRiskFlag ActiveFlagFor(Hire hire, Journey journey) =>
            new()
            {
                Id = Guid.NewGuid(),
                TenantId = hire.TenantId,
                HireId = hire.Id,
                JourneyId = journey.Id,
                RaisedAt = DateTime.UtcNow.AddDays(-1),
                ClassificationAtRaise = EngagementClassification.AtRisk,
                Status = AtRiskFlagStatus.Active
            };

        // ─── CreateSnapshot ────────────────────────────────────────────────────────

        [Fact]
        public void CreateSnapshot_WithValidInputs_ReturnsSnapshotWithExpectedValues()
        {
            var hire = MakeHire();
            var journey = MakeJourneyFor(hire);
            var input = MakeInput();
            var result = MakeResult();

            var snapshot = _manager.CreateSnapshot(1, hire, journey, input, result);

            snapshot.ShouldNotBeNull();
            snapshot.TenantId.ShouldBe(1);
            snapshot.HireId.ShouldBe(hire.Id);
            snapshot.JourneyId.ShouldBe(journey.Id);
            snapshot.CompositeScore.ShouldBe(result.CompositeScore);
            snapshot.Classification.ShouldBe(result.Classification);
        }

        [Fact]
        public void CreateSnapshot_WithNullHire_ThrowsArgumentNullException()
        {
            var journey = MakeJourneyFor(MakeHire());

            Should.Throw<ArgumentNullException>(() =>
                _manager.CreateSnapshot(1, null, journey, MakeInput(), MakeResult()));
        }

        [Fact]
        public void CreateSnapshot_WithNullJourney_ThrowsArgumentNullException()
        {
            var hire = MakeHire();

            Should.Throw<ArgumentNullException>(() =>
                _manager.CreateSnapshot(1, hire, null, MakeInput(), MakeResult()));
        }

        [Fact]
        public void CreateSnapshot_WithNullInput_ThrowsArgumentNullException()
        {
            var hire = MakeHire();
            var journey = MakeJourneyFor(hire);

            Should.Throw<ArgumentNullException>(() =>
                _manager.CreateSnapshot(1, hire, journey, null, MakeResult()));
        }

        [Fact]
        public void CreateSnapshot_WithNullResult_ThrowsArgumentNullException()
        {
            var hire = MakeHire();
            var journey = MakeJourneyFor(hire);

            Should.Throw<ArgumentNullException>(() =>
                _manager.CreateSnapshot(1, hire, journey, MakeInput(), null));
        }

        [Fact]
        public void CreateSnapshot_WithMismatchedTenant_ThrowsInvalidOperationException()
        {
            var hire = MakeHire(tenantId: 1);
            var journey = MakeJourneyFor(hire);

            Should.Throw<InvalidOperationException>(() =>
                _manager.CreateSnapshot(99, hire, journey, MakeInput(), MakeResult()));
        }

        [Fact]
        public void CreateSnapshot_WithZeroTenantId_ThrowsArgumentOutOfRangeException()
        {
            var hire = MakeHire(tenantId: 1);
            var journey = MakeJourneyFor(hire);

            Should.Throw<ArgumentOutOfRangeException>(() =>
                _manager.CreateSnapshot(0, hire, journey, MakeInput(), MakeResult()));
        }

        // ─── RaiseAtRiskFlag ───────────────────────────────────────────────────────

        [Fact]
        public void RaiseAtRiskFlag_WithAtRiskClassification_ReturnsFlagInActiveStatus()
        {
            var hire = MakeHire();
            var journey = MakeJourneyFor(hire);
            var raisedAt = DateTime.UtcNow;

            var flag = _manager.RaiseAtRiskFlag(1, hire, journey, EngagementClassification.AtRisk, raisedAt);

            flag.ShouldNotBeNull();
            flag.Status.ShouldBe(AtRiskFlagStatus.Active);
            flag.ClassificationAtRaise.ShouldBe(EngagementClassification.AtRisk);
            flag.HireId.ShouldBe(hire.Id);
            flag.JourneyId.ShouldBe(journey.Id);
        }

        [Fact]
        public void RaiseAtRiskFlag_WithHealthyClassification_ThrowsInvalidOperationException()
        {
            var hire = MakeHire();
            var journey = MakeJourneyFor(hire);

            Should.Throw<InvalidOperationException>(() =>
                _manager.RaiseAtRiskFlag(1, hire, journey, EngagementClassification.Healthy, DateTime.UtcNow));
        }

        [Fact]
        public void RaiseAtRiskFlag_WithNeedsAttentionClassification_ThrowsInvalidOperationException()
        {
            var hire = MakeHire();
            var journey = MakeJourneyFor(hire);

            Should.Throw<InvalidOperationException>(() =>
                _manager.RaiseAtRiskFlag(1, hire, journey, EngagementClassification.NeedsAttention, DateTime.UtcNow));
        }

        // ─── AcknowledgeFlag ───────────────────────────────────────────────────────

        [Fact]
        public void AcknowledgeFlag_ActiveFlag_TransitionsToAcknowledged()
        {
            var hire = MakeHire();
            var journey = MakeJourneyFor(hire);
            var flag = ActiveFlagFor(hire, journey);

            _manager.AcknowledgeFlag(flag, 1L, "Noted — will follow up");

            flag.Status.ShouldBe(AtRiskFlagStatus.Acknowledged);
            flag.AcknowledgedByUserId.ShouldBe(1L);
            flag.AcknowledgedAt.ShouldNotBeNull();
            flag.AcknowledgementNotes.ShouldBe("Noted — will follow up");
        }

        [Fact]
        public void AcknowledgeFlag_WithTrimmedNotes_StoresNormalisedNotes()
        {
            var hire = MakeHire();
            var flag = ActiveFlagFor(hire, MakeJourneyFor(hire));

            _manager.AcknowledgeFlag(flag, 1L, "  note  ");

            flag.AcknowledgementNotes.ShouldBe("note");
        }

        [Fact]
        public void AcknowledgeFlag_AlreadyResolvedFlag_ThrowsInvalidOperationException()
        {
            var hire = MakeHire();
            var flag = ActiveFlagFor(hire, MakeJourneyFor(hire));
            flag.Status = AtRiskFlagStatus.Resolved;

            Should.Throw<InvalidOperationException>(() =>
                _manager.AcknowledgeFlag(flag, 1L, null));
        }

        [Fact]
        public void AcknowledgeFlag_WithNullFlag_ThrowsArgumentNullException()
        {
            Should.Throw<ArgumentNullException>(() =>
                _manager.AcknowledgeFlag(null, 1L, null));
        }

        // ─── ResolveFlag ───────────────────────────────────────────────────────────

        [Fact]
        public void ResolveFlag_ActiveFlag_TransitionsToResolved()
        {
            var hire = MakeHire();
            var flag = ActiveFlagFor(hire, MakeJourneyFor(hire));

            _manager.ResolveFlag(flag, 2L, AtRiskResolutionType.ManualFacilitatorResolution, "Resolved after check-in");

            flag.Status.ShouldBe(AtRiskFlagStatus.Resolved);
            flag.ResolvedByUserId.ShouldBe(2L);
            flag.ResolvedAt.ShouldNotBeNull();
            flag.ResolutionType.ShouldBe(AtRiskResolutionType.ManualFacilitatorResolution);
        }

        [Fact]
        public void ResolveFlag_AcknowledgedFlag_TransitionsToResolved()
        {
            var hire = MakeHire();
            var flag = ActiveFlagFor(hire, MakeJourneyFor(hire));
            flag.Status = AtRiskFlagStatus.Acknowledged;

            _manager.ResolveFlag(flag, 2L, AtRiskResolutionType.ManualFacilitatorResolution, null);

            flag.Status.ShouldBe(AtRiskFlagStatus.Resolved);
        }

        [Fact]
        public void ResolveFlag_AlreadyResolvedFlag_ThrowsInvalidOperationException()
        {
            var hire = MakeHire();
            var flag = ActiveFlagFor(hire, MakeJourneyFor(hire));
            flag.Status = AtRiskFlagStatus.Resolved;

            Should.Throw<InvalidOperationException>(() =>
                _manager.ResolveFlag(flag, 2L, AtRiskResolutionType.ManualFacilitatorResolution, null));
        }

        // ─── AutoResolveFlag ───────────────────────────────────────────────────────

        [Fact]
        public void AutoResolveFlag_ActiveFlag_SetsAutomaticHealthyRecoveryType()
        {
            var hire = MakeHire();
            var flag = ActiveFlagFor(hire, MakeJourneyFor(hire));

            _manager.AutoResolveFlag(flag);

            flag.Status.ShouldBe(AtRiskFlagStatus.Resolved);
            flag.ResolutionType.ShouldBe(AtRiskResolutionType.AutomaticHealthyRecovery);
            flag.ResolvedByUserId.ShouldBeNull();
            flag.ResolutionNotes.ShouldBeNull();
        }

        [Fact]
        public void AutoResolveFlag_AlreadyResolvedFlag_ThrowsInvalidOperationException()
        {
            var hire = MakeHire();
            var flag = ActiveFlagFor(hire, MakeJourneyFor(hire));
            flag.Status = AtRiskFlagStatus.Resolved;

            Should.Throw<InvalidOperationException>(() =>
                _manager.AutoResolveFlag(flag));
        }
    }
}
