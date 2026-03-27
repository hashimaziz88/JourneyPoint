using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using JourneyPoint.Application.Services.MarkdownImportService.Dto;
using JourneyPoint.Application.Services.OnboardingPlanService.Dto;
using JourneyPoint.Authorization;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.MarkdownImportService
{
    /// <summary>
    /// Provides markdown onboarding import preview and draft-save orchestration.
    /// </summary>
    [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
    public class MarkdownImportAppService : JourneyPointAppServiceBase, IMarkdownImportAppService
    {
        private readonly IRepository<OnboardingPlan, Guid> _onboardingPlanRepository;
        private readonly OnboardingPlanManager _onboardingPlanManager;
        private readonly MarkdownImportParser _markdownImportParser;

        /// <summary>
        /// Initializes a new instance of the <see cref="MarkdownImportAppService"/> class.
        /// </summary>
        public MarkdownImportAppService(
            IRepository<OnboardingPlan, Guid> onboardingPlanRepository,
            OnboardingPlanManager onboardingPlanManager,
            MarkdownImportParser markdownImportParser)
        {
            _onboardingPlanRepository = onboardingPlanRepository;
            _onboardingPlanManager = onboardingPlanManager;
            _markdownImportParser = markdownImportParser;
        }

        /// <summary>
        /// Parses markdown content into a reviewable onboarding preview.
        /// </summary>
        public Task<MarkdownImportPreviewDto> PreviewAsync(PreviewMarkdownImportRequest input)
        {
            var preview = _markdownImportParser.Parse(input.MarkdownContent, input.SourceFileName);
            return Task.FromResult(preview);
        }

        /// <summary>
        /// Saves a facilitator-reviewed markdown preview as a new onboarding draft.
        /// </summary>
        public async Task<OnboardingPlanDetailDto> SaveDraftAsync(SaveMarkdownImportRequest input)
        {
            if (input == null)
            {
                throw new UserFriendlyException("Markdown import content is required before a draft can be saved.");
            }

            var tenantId = GetRequiredTenantId();
            var orderedModules = OrderModules(input.Modules).ToList();

            if (!orderedModules.Any())
            {
                throw new UserFriendlyException("Add at least one module before saving an imported draft.");
            }

            var plan = _onboardingPlanManager.CreatePlan(
                tenantId,
                input.Name,
                input.Description,
                input.TargetAudience,
                input.DurationDays);

            foreach (var moduleInput in orderedModules)
            {
                var module = _onboardingPlanManager.CreateModule(
                    moduleInput.Name,
                    moduleInput.Description,
                    moduleInput.OrderIndex);

                _onboardingPlanManager.AddModule(plan, module);

                foreach (var taskInput in OrderTasks(moduleInput.Tasks))
                {
                    var task = _onboardingPlanManager.CreateTask(
                        taskInput.Title,
                        taskInput.Description,
                        taskInput.Category,
                        taskInput.OrderIndex,
                        taskInput.DueDayOffset,
                        taskInput.AssignmentTarget,
                        taskInput.AcknowledgementRule);

                    _onboardingPlanManager.AddTask(plan, module.Id, task);
                }
            }

            await _onboardingPlanRepository.InsertAsync(plan);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToDetailDto(plan);
        }

        private int GetRequiredTenantId()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                throw new AbpAuthorizationException("Markdown import requires a tenant context.");
            }

            return AbpSession.TenantId.Value;
        }

        private static IEnumerable<MarkdownImportPreviewModuleDto> OrderModules(IEnumerable<MarkdownImportPreviewModuleDto> modules)
        {
            return (modules ?? Enumerable.Empty<MarkdownImportPreviewModuleDto>())
                .OrderBy(module => module.OrderIndex)
                .ThenBy(module => module.Name);
        }

        private static IEnumerable<MarkdownImportPreviewTaskDto> OrderTasks(IEnumerable<MarkdownImportPreviewTaskDto> tasks)
        {
            return (tasks ?? Enumerable.Empty<MarkdownImportPreviewTaskDto>())
                .OrderBy(task => task.OrderIndex)
                .ThenBy(task => task.Title);
        }

        private static OnboardingPlanDetailDto MapToDetailDto(OnboardingPlan plan)
        {
            return new OnboardingPlanDetailDto
            {
                Id = plan.Id,
                Name = plan.Name,
                Description = plan.Description,
                TargetAudience = plan.TargetAudience,
                DurationDays = plan.DurationDays,
                Status = plan.Status,
                Modules = plan.Modules
                    .OrderBy(module => module.OrderIndex)
                    .Select(MapModuleDto)
                    .ToList()
            };
        }

        private static OnboardingModuleDto MapModuleDto(OnboardingModule module)
        {
            return new OnboardingModuleDto
            {
                Id = module.Id,
                Name = module.Name,
                Description = module.Description,
                OrderIndex = module.OrderIndex,
                Tasks = module.Tasks
                    .OrderBy(task => task.OrderIndex)
                    .Select(MapTaskDto)
                    .ToList()
            };
        }

        private static OnboardingTaskDto MapTaskDto(OnboardingTask task)
        {
            return new OnboardingTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Category = task.Category,
                OrderIndex = task.OrderIndex,
                DueDayOffset = task.DueDayOffset,
                AssignmentTarget = task.AssignmentTarget,
                AcknowledgementRule = task.AcknowledgementRule
            };
        }
    }
}
