using System;
using System.Collections.ObjectModel;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;
using Shouldly;
using Xunit;

namespace JourneyPoint.Tests.Domains
{
    public class OnboardingPlanManager_Tests
    {
        private readonly OnboardingPlanManager _manager = new();

        // ─── Helpers ───────────────────────────────────────────────────────────────

        private OnboardingPlan CreateDraftPlan(int tenantId = 1) =>
            _manager.CreatePlan(tenantId, "Onboarding Plan", "A solid plan", "New engineers", 30);

        private static OnboardingPlan PublishedPlan(int tenantId = 1) =>
            new()
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Name = "Published Plan",
                Description = "Already live",
                TargetAudience = "All staff",
                DurationDays = 14,
                Status = OnboardingPlanStatus.Published,
                Modules = new Collection<OnboardingModule>()
            };

        private OnboardingModule CreateModule(int orderIndex = 1) =>
            _manager.CreateModule("Week 1", "First week tasks", orderIndex);

        private OnboardingTask CreateTask(int orderIndex = 1) =>
            _manager.CreateTask(
                "Complete forms",
                "Fill out all HR forms",
                OnboardingTaskCategory.Orientation,
                orderIndex,
                0,
                OnboardingTaskAssignmentTarget.Enrolee,
                OnboardingTaskAcknowledgementRule.Required);

        // ─── CreatePlan ────────────────────────────────────────────────────────────

        [Fact]
        public void CreatePlan_WithValidInputs_ReturnsDraftPlan()
        {
            var plan = _manager.CreatePlan(1, "My Plan", "Description", "Engineers", 30);

            plan.ShouldNotBeNull();
            plan.Name.ShouldBe("My Plan");
            plan.Description.ShouldBe("Description");
            plan.TargetAudience.ShouldBe("Engineers");
            plan.DurationDays.ShouldBe(30);
            plan.TenantId.ShouldBe(1);
            plan.Status.ShouldBe(OnboardingPlanStatus.Draft);
        }

        [Fact]
        public void CreatePlan_TrimsWhitespaceFromName()
        {
            var plan = _manager.CreatePlan(1, "  My Plan  ", "Description", "Engineers", 30);

            plan.Name.ShouldBe("My Plan");
        }

        [Fact]
        public void CreatePlan_WithZeroTenantId_ThrowsArgumentOutOfRangeException()
        {
            Should.Throw<ArgumentOutOfRangeException>(() =>
                _manager.CreatePlan(0, "Plan", "Desc", "Audience", 30));
        }

        [Fact]
        public void CreatePlan_WithNullName_ThrowsArgumentException()
        {
            Should.Throw<ArgumentException>(() =>
                _manager.CreatePlan(1, null, "Desc", "Audience", 30));
        }

        [Fact]
        public void CreatePlan_WithWhitespaceName_ThrowsArgumentException()
        {
            Should.Throw<ArgumentException>(() =>
                _manager.CreatePlan(1, "   ", "Desc", "Audience", 30));
        }

        [Fact]
        public void CreatePlan_WithZeroDurationDays_ThrowsException()
        {
            Should.Throw<Exception>(() =>
                _manager.CreatePlan(1, "Plan", "Desc", "Audience", 0));
        }

        // ─── UpdatePlanDetails ─────────────────────────────────────────────────────

        [Fact]
        public void UpdatePlanDetails_OnDraftPlan_UpdatesAllFields()
        {
            var plan = CreateDraftPlan();

            _manager.UpdatePlanDetails(plan, "Updated Name", "Updated Desc", "Updated Audience", 60);

            plan.Name.ShouldBe("Updated Name");
            plan.Description.ShouldBe("Updated Desc");
            plan.TargetAudience.ShouldBe("Updated Audience");
            plan.DurationDays.ShouldBe(60);
        }

        [Fact]
        public void UpdatePlanDetails_OnPublishedPlan_ThrowsInvalidOperationException()
        {
            var plan = PublishedPlan();

            Should.Throw<InvalidOperationException>(() =>
                _manager.UpdatePlanDetails(plan, "New Name", "New Desc", "Audience", 30));
        }

        [Fact]
        public void UpdatePlanDetails_WithNullPlan_ThrowsArgumentNullException()
        {
            Should.Throw<ArgumentNullException>(() =>
                _manager.UpdatePlanDetails(null, "Name", "Desc", "Audience", 30));
        }

        // ─── AddModule ─────────────────────────────────────────────────────────────

        [Fact]
        public void AddModule_ToDraftPlan_AddsModuleToCollection()
        {
            var plan = CreateDraftPlan();
            var module = CreateModule(orderIndex: 1);

            _manager.AddModule(plan, module);

            plan.Modules.Count.ShouldBe(1);
            plan.Modules.ShouldContain(m => m.Name == "Week 1");
        }

        [Fact]
        public void AddModule_SetsModuleTenantAndPlanIds()
        {
            var plan = CreateDraftPlan(tenantId: 5);
            var module = CreateModule();

            _manager.AddModule(plan, module);

            module.TenantId.ShouldBe(5);
            module.OnboardingPlanId.ShouldBe(plan.Id);
        }

        [Fact]
        public void AddModule_ToPublishedPlan_ThrowsInvalidOperationException()
        {
            var plan = PublishedPlan();
            var module = CreateModule();

            Should.Throw<InvalidOperationException>(() =>
                _manager.AddModule(plan, module));
        }

        [Fact]
        public void AddModule_WithDuplicateOrderIndex_ThrowsInvalidOperationException()
        {
            var plan = CreateDraftPlan();
            var moduleA = CreateModule(orderIndex: 1);
            var moduleB = CreateModule(orderIndex: 1);
            _manager.AddModule(plan, moduleA);

            Should.Throw<InvalidOperationException>(() =>
                _manager.AddModule(plan, moduleB));
        }

        [Fact]
        public void AddModule_WithNullModule_ThrowsArgumentNullException()
        {
            var plan = CreateDraftPlan();

            Should.Throw<ArgumentNullException>(() =>
                _manager.AddModule(plan, null));
        }

        // ─── RemoveModule ──────────────────────────────────────────────────────────

        [Fact]
        public void RemoveModule_FromDraftPlan_RemovesModule()
        {
            var plan = CreateDraftPlan();
            var module = CreateModule();
            _manager.AddModule(plan, module);

            _manager.RemoveModule(plan, module.Id);

            plan.Modules.Count.ShouldBe(0);
        }

        [Fact]
        public void RemoveModule_FromPublishedPlan_ThrowsInvalidOperationException()
        {
            var plan = PublishedPlan();

            Should.Throw<InvalidOperationException>(() =>
                _manager.RemoveModule(plan, Guid.NewGuid()));
        }

        // ─── AddTask / RemoveTask ──────────────────────────────────────────────────

        [Fact]
        public void AddTask_ToModule_AddsTaskToModule()
        {
            var plan = CreateDraftPlan();
            var module = CreateModule();
            _manager.AddModule(plan, module);
            var task = CreateTask(orderIndex: 1);

            _manager.AddTask(plan, module.Id, task);

            module.Tasks.Count.ShouldBe(1);
        }

        [Fact]
        public void RemoveTask_FromModule_RemovesTask()
        {
            var plan = CreateDraftPlan();
            var module = CreateModule();
            _manager.AddModule(plan, module);
            var task = CreateTask();
            _manager.AddTask(plan, module.Id, task);

            _manager.RemoveTask(plan, module.Id, task.Id);

            module.Tasks.Count.ShouldBe(0);
        }

        // ─── Publish ───────────────────────────────────────────────────────────────

        [Fact]
        public void Publish_DraftPlanWithModulesAndTasks_TransitionsToPublished()
        {
            var plan = CreateDraftPlan();
            var module = CreateModule();
            _manager.AddModule(plan, module);
            _manager.AddTask(plan, module.Id, CreateTask());

            _manager.Publish(plan);

            plan.Status.ShouldBe(OnboardingPlanStatus.Published);
        }

        [Fact]
        public void Publish_PlanWithNoModules_ThrowsInvalidOperationException()
        {
            var plan = CreateDraftPlan();

            Should.Throw<InvalidOperationException>(() =>
                _manager.Publish(plan));
        }

        [Fact]
        public void Publish_PlanWithEmptyModule_ThrowsInvalidOperationException()
        {
            var plan = CreateDraftPlan();
            var module = CreateModule();
            _manager.AddModule(plan, module); // no tasks added

            Should.Throw<InvalidOperationException>(() =>
                _manager.Publish(plan));
        }

        [Fact]
        public void Publish_AlreadyPublishedPlan_ThrowsInvalidOperationException()
        {
            var plan = PublishedPlan();

            Should.Throw<InvalidOperationException>(() =>
                _manager.Publish(plan));
        }

        // ─── Archive ───────────────────────────────────────────────────────────────

        [Fact]
        public void Archive_DraftPlan_TransitionsToArchived()
        {
            var plan = CreateDraftPlan();

            _manager.Archive(plan);

            plan.Status.ShouldBe(OnboardingPlanStatus.Archived);
        }

        [Fact]
        public void Archive_PublishedPlan_TransitionsToArchived()
        {
            var plan = PublishedPlan();

            _manager.Archive(plan);

            plan.Status.ShouldBe(OnboardingPlanStatus.Archived);
        }

        [Fact]
        public void Archive_AlreadyArchivedPlan_ThrowsInvalidOperationException()
        {
            var plan = CreateDraftPlan();
            _manager.Archive(plan);

            Should.Throw<InvalidOperationException>(() =>
                _manager.Archive(plan));
        }
    }
}
