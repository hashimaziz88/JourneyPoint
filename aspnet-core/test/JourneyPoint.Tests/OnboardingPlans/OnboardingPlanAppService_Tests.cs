using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using Xunit;
using JourneyPoint.Application.Services.OnboardingPlanService;
using JourneyPoint.Application.Services.OnboardingPlanService.Dto;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;

namespace JourneyPoint.Tests.OnboardingPlans
{
    public class OnboardingPlanAppService_Tests : JourneyPointTestBase
    {
        private readonly IOnboardingPlanAppService _planAppService;

        public OnboardingPlanAppService_Tests()
        {
            _planAppService = Resolve<IOnboardingPlanAppService>();
        }

        // ─── Helpers ───────────────────────────────────────────────────────────────

        private static CreateOnboardingPlanRequest DraftPlanRequest(string name = "Graduate Onboarding") =>
            new()
            {
                Name = name,
                Description = "A comprehensive 30-day onboarding plan.",
                TargetAudience = "Software Engineers",
                DurationDays = 30,
                Modules = new List<UpsertOnboardingModuleDto>()
            };

        private static CreateOnboardingPlanRequest DraftPlanWithModulesRequest(string name = "Engineer Onboarding") =>
            new()
            {
                Name = name,
                Description = "Full plan with modules.",
                TargetAudience = "Backend Engineers",
                DurationDays = 14,
                Modules = new List<UpsertOnboardingModuleDto>
                {
                    new()
                    {
                        Name = "Week 1",
                        Description = "Introduction week",
                        OrderIndex = 1,
                        Tasks = new List<UpsertOnboardingTaskDto>
                        {
                            new()
                            {
                                Title = "Complete paperwork",
                                Description = "Fill in all HR forms",
                                Category = OnboardingTaskCategory.Orientation,
                                OrderIndex = 1,
                                DueDayOffset = 1,
                                AssignmentTarget = OnboardingTaskAssignmentTarget.Enrolee,
                                AcknowledgementRule = OnboardingTaskAcknowledgementRule.Required
                            }
                        }
                    }
                }
            };

        private async Task<OnboardingPlanDetailDto> CreateAndPublishPlanAsync(string name = "Published Plan")
        {
            var plan = await _planAppService.CreateAsync(DraftPlanWithModulesRequest(name));
            return await _planAppService.PublishAsync(new EntityDto<Guid>(plan.Id));
        }

        // ─── GetPlansAsync ─────────────────────────────────────────────────────────

        [Fact]
        public async Task GetPlansAsync_WithNoFilter_ReturnsAllTenantPlans()
        {
            await _planAppService.CreateAsync(DraftPlanRequest("Plan A"));
            await _planAppService.CreateAsync(DraftPlanRequest("Plan B"));

            var result = await _planAppService.GetPlansAsync(new GetOnboardingPlansInput { MaxResultCount = 50 });

            result.TotalCount.ShouldBeGreaterThanOrEqualTo(2);
            result.Items.ShouldContain(p => p.Name == "Plan A");
            result.Items.ShouldContain(p => p.Name == "Plan B");
        }

        [Fact]
        public async Task GetPlansAsync_WithKeywordFilter_ReturnsMatchingPlans()
        {
            await _planAppService.CreateAsync(DraftPlanRequest("Alpha Onboarding"));
            await _planAppService.CreateAsync(DraftPlanRequest("Beta Onboarding"));

            var result = await _planAppService.GetPlansAsync(new GetOnboardingPlansInput
            {
                Keyword = "Alpha",
                MaxResultCount = 50
            });

            result.Items.ShouldContain(p => p.Name == "Alpha Onboarding");
            result.Items.ShouldNotContain(p => p.Name == "Beta Onboarding");
        }

        [Fact]
        public async Task GetPlansAsync_WithStatusFilter_ReturnsOnlyMatchingStatus()
        {
            await _planAppService.CreateAsync(DraftPlanRequest("Status Filter Draft"));

            var result = await _planAppService.GetPlansAsync(new GetOnboardingPlansInput
            {
                Status = OnboardingPlanStatus.Draft,
                MaxResultCount = 50
            });

            result.Items.ShouldAllBe(p => p.Status == OnboardingPlanStatus.Draft);
        }

        [Fact]
        public async Task GetPlansAsync_ReturnsModuleAndTaskCounts()
        {
            await _planAppService.CreateAsync(DraftPlanWithModulesRequest("Counted Plan"));

            var result = await _planAppService.GetPlansAsync(new GetOnboardingPlansInput
            {
                Keyword = "Counted Plan",
                MaxResultCount = 10
            });

            var item = result.Items.ShouldHaveSingleItem();
            item.ModuleCount.ShouldBe(1);
            item.TaskCount.ShouldBe(1);
        }

        // ─── GetDetailAsync ────────────────────────────────────────────────────────

        [Fact]
        public async Task GetDetailAsync_ExistingPlan_ReturnsPlanWithModulesAndTasks()
        {
            var created = await _planAppService.CreateAsync(DraftPlanWithModulesRequest("Detail Plan"));

            var detail = await _planAppService.GetDetailAsync(new EntityDto<Guid>(created.Id));

            detail.ShouldNotBeNull();
            detail.Name.ShouldBe("Detail Plan");
            detail.Modules.Count.ShouldBe(1);
            detail.Modules[0].Tasks.Count.ShouldBe(1);
        }

        // ─── CreateAsync ───────────────────────────────────────────────────────────

        [Fact]
        public async Task CreateAsync_WithValidInput_PersistsPlanInDatabase()
        {
            var request = DraftPlanRequest("DB Persisted Plan");

            var created = await _planAppService.CreateAsync(request);

            await UsingDbContextAsync(async context =>
            {
                var plan = await context.OnboardingPlans.FirstOrDefaultAsync(p => p.Id == created.Id);
                plan.ShouldNotBeNull();
                plan.Name.ShouldBe("DB Persisted Plan");
                plan.Status.ShouldBe(OnboardingPlanStatus.Draft);
            });
        }

        [Fact]
        public async Task CreateAsync_WithModulesAndTasks_PersistsFullStructure()
        {
            var request = DraftPlanWithModulesRequest("Structured Plan");

            var created = await _planAppService.CreateAsync(request);

            created.Modules.Count.ShouldBe(1);
            created.Modules[0].Name.ShouldBe("Week 1");
            created.Modules[0].Tasks.Count.ShouldBe(1);
            created.Modules[0].Tasks[0].Title.ShouldBe("Complete paperwork");
        }

        [Fact]
        public async Task CreateAsync_ReturnsDraftStatus()
        {
            var created = await _planAppService.CreateAsync(DraftPlanRequest());

            created.Status.ShouldBe(OnboardingPlanStatus.Draft);
        }

        // ─── PublishAsync ──────────────────────────────────────────────────────────

        [Fact]
        public async Task PublishAsync_DraftPlanWithModulesAndTasks_TransitionsToPublished()
        {
            var plan = await _planAppService.CreateAsync(DraftPlanWithModulesRequest("To Publish"));

            var published = await _planAppService.PublishAsync(new EntityDto<Guid>(plan.Id));

            published.Status.ShouldBe(OnboardingPlanStatus.Published);
        }

        [Fact]
        public async Task PublishAsync_PersistsPublishedStatusInDatabase()
        {
            var plan = await _planAppService.CreateAsync(DraftPlanWithModulesRequest("Persist Published"));
            await _planAppService.PublishAsync(new EntityDto<Guid>(plan.Id));

            await UsingDbContextAsync(async context =>
            {
                var persisted = await context.OnboardingPlans.FindAsync(plan.Id);
                persisted.Status.ShouldBe(OnboardingPlanStatus.Published);
            });
        }

        // ─── ArchiveAsync ──────────────────────────────────────────────────────────

        [Fact]
        public async Task ArchiveAsync_PublishedPlan_TransitionsToArchived()
        {
            var published = await CreateAndPublishPlanAsync("To Archive");

            var archived = await _planAppService.ArchiveAsync(new EntityDto<Guid>(published.Id));

            archived.Status.ShouldBe(OnboardingPlanStatus.Archived);
        }

        [Fact]
        public async Task ArchiveAsync_DraftPlan_TransitionsToArchived()
        {
            var plan = await _planAppService.CreateAsync(DraftPlanRequest("Draft to Archive"));

            var archived = await _planAppService.ArchiveAsync(new EntityDto<Guid>(plan.Id));

            archived.Status.ShouldBe(OnboardingPlanStatus.Archived);
        }

        // ─── CloneAsync ────────────────────────────────────────────────────────────

        [Fact]
        public async Task CloneAsync_PublishedPlan_CreatesDraftCopyWithSameStructure()
        {
            var source = await CreateAndPublishPlanAsync("Source Plan");

            var clone = await _planAppService.CloneAsync(new CloneOnboardingPlanRequest
            {
                SourcePlanId = source.Id
            });

            clone.ShouldNotBeNull();
            clone.Id.ShouldNotBe(source.Id);
            clone.Status.ShouldBe(OnboardingPlanStatus.Draft);
            clone.Name.ShouldBe("Source Plan Copy");
            clone.Modules.Count.ShouldBe(source.Modules.Count);
        }

        [Fact]
        public async Task CloneAsync_WithCustomName_UsesProvidedName()
        {
            var source = await CreateAndPublishPlanAsync("Original");

            var clone = await _planAppService.CloneAsync(new CloneOnboardingPlanRequest
            {
                SourcePlanId = source.Id,
                Name = "My Custom Clone"
            });

            clone.Name.ShouldBe("My Custom Clone");
        }

        [Fact]
        public async Task CloneAsync_PreservesModulesAndTasksFromSource()
        {
            var source = await CreateAndPublishPlanAsync("Clone Source");

            var clone = await _planAppService.CloneAsync(new CloneOnboardingPlanRequest
            {
                SourcePlanId = source.Id
            });

            clone.Modules.Count.ShouldBe(1);
            clone.Modules[0].Name.ShouldBe("Week 1");
            clone.Modules[0].Tasks.Count.ShouldBe(1);
            clone.Modules[0].Tasks[0].Title.ShouldBe("Complete paperwork");
        }

        [Fact]
        public async Task CloneAsync_PersistsCloneInDatabase()
        {
            var source = await CreateAndPublishPlanAsync("DB Clone Source");

            var clone = await _planAppService.CloneAsync(new CloneOnboardingPlanRequest
            {
                SourcePlanId = source.Id
            });

            await UsingDbContextAsync(async context =>
            {
                var persisted = await context.OnboardingPlans.FindAsync(clone.Id);
                persisted.ShouldNotBeNull();
                persisted.Status.ShouldBe(OnboardingPlanStatus.Draft);
            });
        }
    }
}
