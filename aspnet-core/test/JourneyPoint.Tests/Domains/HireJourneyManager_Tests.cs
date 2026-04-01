using System;
using System.Collections.ObjectModel;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;
using Shouldly;
using Xunit;

namespace JourneyPoint.Tests.Domains
{
    public class HireJourneyManager_Tests
    {
        private readonly HireJourneyManager _manager = new();

        // ─── Helpers ───────────────────────────────────────────────────────────────

        private static OnboardingPlan PublishedPlan(int tenantId = 1, Guid? id = null) =>
            new()
            {
                Id = id ?? Guid.NewGuid(),
                TenantId = tenantId,
                Name = "Graduate Onboarding",
                Description = "30-day plan",
                TargetAudience = "Engineers",
                DurationDays = 30,
                Status = OnboardingPlanStatus.Published,
                Modules = new Collection<OnboardingModule>(),
                Documents = new Collection<OnboardingDocument>()
            };

        private static Hire SeedHire(int tenantId = 1, Guid? planId = null, HireLifecycleState status = HireLifecycleState.PendingActivation)
        {
            var plan = PublishedPlan(tenantId, planId);
            return new Hire
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                OnboardingPlanId = plan.Id,
                FullName = "Jane Smith",
                EmailAddress = "jane@example.com",
                StartDate = DateTime.Today,
                Status = status,
                WelcomeNotificationStatus = WelcomeNotificationStatus.Pending
            };
        }

        private static Journey DraftJourneyFor(Hire hire)
        {
            var journey = new Journey
            {
                Id = Guid.NewGuid(),
                TenantId = hire.TenantId,
                HireId = hire.Id,
                OnboardingPlanId = hire.OnboardingPlanId,
                Status = JourneyStatus.Draft
            };
            hire.Journey = journey;
            return journey;
        }

        private static JourneyTask SeedJourneyTask(Journey journey, int moduleOrder = 1, int taskOrder = 1) =>
            new()
            {
                Id = Guid.NewGuid(),
                TenantId = journey.TenantId,
                JourneyId = journey.Id,
                ModuleTitle = "Week 1",
                ModuleOrderIndex = moduleOrder,
                TaskOrderIndex = taskOrder,
                Title = "Complete paperwork",
                Description = "Fill in HR forms",
                Category = OnboardingTaskCategory.Orientation,
                AssignmentTarget = OnboardingTaskAssignmentTarget.Enrolee,
                AcknowledgementRule = OnboardingTaskAcknowledgementRule.Required,
                DueDayOffset = 1,
                DueOn = DateTime.Today.AddDays(1),
                Status = JourneyTaskStatus.Pending
            };

        // ─── CreateHire ────────────────────────────────────────────────────────────

        [Fact]
        public void CreateHire_WithValidInputs_ReturnsHireInPendingActivationState()
        {
            var plan = PublishedPlan();
            var start = DateTime.Today.AddDays(7);

            var hire = _manager.CreateHire(1, plan, "Alice Brown", "alice@example.com", "Developer", "Engineering", start, null);

            hire.ShouldNotBeNull();
            hire.FullName.ShouldBe("Alice Brown");
            hire.EmailAddress.ShouldBe("alice@example.com");
            hire.TenantId.ShouldBe(1);
            hire.OnboardingPlanId.ShouldBe(plan.Id);
            hire.Status.ShouldBe(HireLifecycleState.PendingActivation);
            hire.WelcomeNotificationStatus.ShouldBe(WelcomeNotificationStatus.Pending);
        }

        [Fact]
        public void CreateHire_NormalizesEmailToLowercase()
        {
            var plan = PublishedPlan();

            var hire = _manager.CreateHire(1, plan, "Bob", "BOB@EXAMPLE.COM", null, null, DateTime.Today, null);

            hire.EmailAddress.ShouldBe("bob@example.com");
        }

        [Fact]
        public void CreateHire_TrimsWhitespaceFromFullName()
        {
            var plan = PublishedPlan();

            var hire = _manager.CreateHire(1, plan, "  Carol  ", "carol@example.com", null, null, DateTime.Today, null);

            hire.FullName.ShouldBe("Carol");
        }

        [Fact]
        public void CreateHire_WithDraftPlan_ThrowsInvalidOperationException()
        {
            var plan = PublishedPlan();
            plan.Status = OnboardingPlanStatus.Draft;

            Should.Throw<InvalidOperationException>(() =>
                _manager.CreateHire(1, plan, "Dan", "dan@example.com", null, null, DateTime.Today, null));
        }

        [Fact]
        public void CreateHire_WithArchivedPlan_ThrowsInvalidOperationException()
        {
            var plan = PublishedPlan();
            plan.Status = OnboardingPlanStatus.Archived;

            Should.Throw<InvalidOperationException>(() =>
                _manager.CreateHire(1, plan, "Eve", "eve@example.com", null, null, DateTime.Today, null));
        }

        [Fact]
        public void CreateHire_WithNullPlan_ThrowsArgumentNullException()
        {
            Should.Throw<ArgumentNullException>(() =>
                _manager.CreateHire(1, null, "Frank", "frank@example.com", null, null, DateTime.Today, null));
        }

        [Fact]
        public void CreateHire_WithZeroTenantId_ThrowsArgumentOutOfRangeException()
        {
            var plan = PublishedPlan(1);

            Should.Throw<ArgumentOutOfRangeException>(() =>
                _manager.CreateHire(0, plan, "Grace", "grace@example.com", null, null, DateTime.Today, null));
        }

        [Fact]
        public void CreateHire_WithMismatchedTenant_ThrowsInvalidOperationException()
        {
            var plan = PublishedPlan(tenantId: 99);

            Should.Throw<InvalidOperationException>(() =>
                _manager.CreateHire(1, plan, "Hal", "hal@example.com", null, null, DateTime.Today, null));
        }

        [Fact]
        public void CreateHire_WithDefaultStartDate_ThrowsArgumentOutOfRangeException()
        {
            var plan = PublishedPlan();

            Should.Throw<ArgumentOutOfRangeException>(() =>
                _manager.CreateHire(1, plan, "Ida", "ida@example.com", null, null, default, null));
        }

        // ─── CreateDraftJourney ────────────────────────────────────────────────────

        [Fact]
        public void CreateDraftJourney_WithValidInputs_ReturnsJourneyInDraftStatus()
        {
            var plan = PublishedPlan();
            var hire = SeedHire(planId: plan.Id);

            var journey = _manager.CreateDraftJourney(hire, plan);

            journey.ShouldNotBeNull();
            journey.Status.ShouldBe(JourneyStatus.Draft);
            journey.HireId.ShouldBe(hire.Id);
            journey.TenantId.ShouldBe(hire.TenantId);
        }

        [Fact]
        public void CreateDraftJourney_WhenHireAlreadyHasJourney_ThrowsInvalidOperationException()
        {
            var plan = PublishedPlan();
            var hire = SeedHire(planId: plan.Id);
            hire.Journey = DraftJourneyFor(hire);

            Should.Throw<InvalidOperationException>(() =>
                _manager.CreateDraftJourney(hire, plan));
        }

        [Fact]
        public void CreateDraftJourney_WithMismatchedPlan_ThrowsInvalidOperationException()
        {
            var plan = PublishedPlan();
            var hire = SeedHire(); // different plan ID

            Should.Throw<InvalidOperationException>(() =>
                _manager.CreateDraftJourney(hire, plan));
        }

        // ─── ActivateJourney ───────────────────────────────────────────────────────

        [Fact]
        public void ActivateJourney_WithAtLeastOneTask_TransitionsToActive()
        {
            var hire = SeedHire();
            var journey = DraftJourneyFor(hire);
            journey.Tasks.Add(SeedJourneyTask(journey));

            _manager.ActivateJourney(hire, journey);

            journey.Status.ShouldBe(JourneyStatus.Active);
            journey.ActivatedAt.ShouldNotBeNull();
            hire.Status.ShouldBe(HireLifecycleState.Active);
            hire.ActivatedAt.ShouldNotBeNull();
        }

        [Fact]
        public void ActivateJourney_WithNoTasks_ThrowsInvalidOperationException()
        {
            var hire = SeedHire();
            var journey = DraftJourneyFor(hire);

            Should.Throw<InvalidOperationException>(() =>
                _manager.ActivateJourney(hire, journey));
        }

        [Fact]
        public void ActivateJourney_OnAlreadyActiveJourney_ThrowsInvalidOperationException()
        {
            var hire = SeedHire();
            var journey = DraftJourneyFor(hire);
            journey.Tasks.Add(SeedJourneyTask(journey));
            journey.Status = JourneyStatus.Active;

            Should.Throw<InvalidOperationException>(() =>
                _manager.ActivateJourney(hire, journey));
        }

        // ─── PauseJourney ──────────────────────────────────────────────────────────

        [Fact]
        public void PauseJourney_OnActiveJourney_TransitionsToPaused()
        {
            var hire = SeedHire(status: HireLifecycleState.Active);
            var journey = DraftJourneyFor(hire);
            journey.Status = JourneyStatus.Active;

            _manager.PauseJourney(hire, journey);

            journey.Status.ShouldBe(JourneyStatus.Paused);
            journey.PausedAt.ShouldNotBeNull();
        }

        [Fact]
        public void PauseJourney_OnDraftJourney_ThrowsInvalidOperationException()
        {
            var hire = SeedHire();
            var journey = DraftJourneyFor(hire);

            Should.Throw<InvalidOperationException>(() =>
                _manager.PauseJourney(hire, journey));
        }

        // ─── CompleteJourney ───────────────────────────────────────────────────────

        [Fact]
        public void CompleteJourney_OnActiveJourney_TransitionsToCompleted()
        {
            var hire = SeedHire(status: HireLifecycleState.Active);
            var journey = DraftJourneyFor(hire);
            journey.Status = JourneyStatus.Active;

            _manager.CompleteJourney(hire, journey);

            journey.Status.ShouldBe(JourneyStatus.Completed);
            hire.Status.ShouldBe(HireLifecycleState.Completed);
            hire.CompletedAt.ShouldNotBeNull();
        }

        [Fact]
        public void CompleteJourney_OnPausedJourney_TransitionsToCompleted()
        {
            var hire = SeedHire(status: HireLifecycleState.Active);
            var journey = DraftJourneyFor(hire);
            journey.Status = JourneyStatus.Paused;

            _manager.CompleteJourney(hire, journey);

            journey.Status.ShouldBe(JourneyStatus.Completed);
        }

        [Fact]
        public void CompleteJourney_OnDraftJourney_ThrowsInvalidOperationException()
        {
            var hire = SeedHire();
            var journey = DraftJourneyFor(hire);

            Should.Throw<InvalidOperationException>(() =>
                _manager.CompleteJourney(hire, journey));
        }

        // ─── ExitHire ──────────────────────────────────────────────────────────────

        [Fact]
        public void ExitHire_WithNoJourney_MarksHireAsExited()
        {
            var hire = SeedHire(status: HireLifecycleState.Active);

            _manager.ExitHire(hire, null);

            hire.Status.ShouldBe(HireLifecycleState.Exited);
            hire.ExitedAt.ShouldNotBeNull();
        }

        [Fact]
        public void ExitHire_WithActiveJourney_PausesJourney()
        {
            var hire = SeedHire(status: HireLifecycleState.Active);
            var journey = DraftJourneyFor(hire);
            journey.Status = JourneyStatus.Active;

            _manager.ExitHire(hire, journey);

            hire.Status.ShouldBe(HireLifecycleState.Exited);
            journey.Status.ShouldBe(JourneyStatus.Paused);
        }

        [Fact]
        public void ExitHire_WhenAlreadyExited_ThrowsInvalidOperationException()
        {
            var hire = SeedHire(status: HireLifecycleState.Exited);

            Should.Throw<InvalidOperationException>(() =>
                _manager.ExitHire(hire, null));
        }
    }
}
