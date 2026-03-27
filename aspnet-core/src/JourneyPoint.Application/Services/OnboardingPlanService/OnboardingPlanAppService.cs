using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using JourneyPoint.Application.Services.OnboardingPlanService.Dto;
using JourneyPoint.Authorization;
using JourneyPoint.Domains.OnboardingPlans;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.OnboardingPlanService
{
    /// <summary>
    /// Provides tenant-scoped onboarding plan CRUD and lifecycle orchestration.
    /// </summary>
    [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
    public class OnboardingPlanAppService : JourneyPointAppServiceBase, IOnboardingPlanAppService
    {
        private const string CloneSuffix = " Copy";

        private readonly IRepository<OnboardingPlan, Guid> _onboardingPlanRepository;
        private readonly IRepository<OnboardingModule, Guid> _onboardingModuleRepository;
        private readonly IRepository<OnboardingTask, Guid> _onboardingTaskRepository;
        private readonly OnboardingPlanManager _onboardingPlanManager;

        public OnboardingPlanAppService(
            IRepository<OnboardingPlan, Guid> onboardingPlanRepository,
            IRepository<OnboardingModule, Guid> onboardingModuleRepository,
            IRepository<OnboardingTask, Guid> onboardingTaskRepository,
            OnboardingPlanManager onboardingPlanManager)
        {
            _onboardingPlanRepository = onboardingPlanRepository;
            _onboardingModuleRepository = onboardingModuleRepository;
            _onboardingTaskRepository = onboardingTaskRepository;
            _onboardingPlanManager = onboardingPlanManager;
        }

        /// <summary>
        /// Returns a filtered page of tenant-scoped onboarding plans.
        /// </summary>
        public async Task<PagedResultDto<OnboardingPlanListItemDto>> GetPlansAsync(GetOnboardingPlansInput input)
        {
            var tenantId = GetRequiredTenantId();
            var normalizedInput = input ?? new GetOnboardingPlansInput();
            var query = _onboardingPlanRepository.GetAll()
                .AsNoTracking()
                .Where(plan => plan.TenantId == tenantId)
                .WhereIf(!string.IsNullOrWhiteSpace(normalizedInput.Keyword),
                    plan => plan.Name.Contains(normalizedInput.Keyword) || plan.TargetAudience.Contains(normalizedInput.Keyword))
                .WhereIf(normalizedInput.Status.HasValue, plan => plan.Status == normalizedInput.Status.Value);

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(plan => plan.LastModificationTime ?? plan.CreationTime)
                .PageBy(normalizedInput)
                .Select(plan => new OnboardingPlanListItemDto
                {
                    Id = plan.Id,
                    Name = plan.Name,
                    TargetAudience = plan.TargetAudience,
                    DurationDays = plan.DurationDays,
                    Status = plan.Status,
                    ModuleCount = plan.Modules.Count,
                    TaskCount = plan.Modules.SelectMany(module => module.Tasks).Count(),
                    LastUpdatedTime = plan.LastModificationTime ?? plan.CreationTime
                })
                .ToListAsync();

            return new PagedResultDto<OnboardingPlanListItemDto>(totalCount, items);
        }

        /// <summary>
        /// Returns one onboarding plan with ordered modules and tasks.
        /// </summary>
        public async Task<OnboardingPlanDetailDto> GetDetailAsync(EntityDto<Guid> input)
        {
            var plan = await GetPlanForReadAsync(input.Id);
            return MapToDetailDto(plan);
        }

        /// <summary>
        /// Creates a new draft onboarding plan.
        /// </summary>
        public async Task<OnboardingPlanDetailDto> CreateAsync(CreateOnboardingPlanRequest input)
        {
            var tenantId = GetRequiredTenantId();
            var plan = _onboardingPlanManager.CreatePlan(tenantId, input.Name, input.Description, input.TargetAudience, input.DurationDays);

            ApplyModuleInputs(plan, input.Modules);

            await _onboardingPlanRepository.InsertAsync(plan);
            await CurrentUnitOfWork.SaveChangesAsync();

            var persistedPlan = await GetPlanForReadAsync(plan.Id);
            return MapToDetailDto(persistedPlan);
        }

        /// <summary>
        /// Updates a draft onboarding plan and its full ordered structure.
        /// </summary>
        public async Task<OnboardingPlanDetailDto> UpdateAsync(UpdateOnboardingPlanRequest input)
        {
            var plan = await GetPlanForEditAsync(input.Id);

            _onboardingPlanManager.UpdatePlanDetails(plan, input.Name, input.Description, input.TargetAudience, input.DurationDays);
            await SyncModulesAsync(plan, input.Modules);
            await CurrentUnitOfWork.SaveChangesAsync();

            var persistedPlan = await GetPlanForReadAsync(plan.Id);
            return MapToDetailDto(persistedPlan);
        }

        /// <summary>
        /// Publishes a draft onboarding plan.
        /// </summary>
        public async Task<OnboardingPlanDetailDto> PublishAsync(EntityDto<Guid> input)
        {
            var plan = await GetPlanForEditAsync(input.Id);

            _onboardingPlanManager.Publish(plan);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToDetailDto(plan);
        }

        /// <summary>
        /// Archives an onboarding plan.
        /// </summary>
        public async Task<OnboardingPlanDetailDto> ArchiveAsync(EntityDto<Guid> input)
        {
            var plan = await GetPlanForEditAsync(input.Id);

            _onboardingPlanManager.Archive(plan);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToDetailDto(plan);
        }

        /// <summary>
        /// Creates a draft copy of an existing onboarding plan with preserved ordering.
        /// </summary>
        public async Task<OnboardingPlanDetailDto> CloneAsync(CloneOnboardingPlanRequest input)
        {
            var tenantId = GetRequiredTenantId();
            var sourcePlan = await GetPlanForReadAsync(input.SourcePlanId);
            var cloneName = string.IsNullOrWhiteSpace(input.Name) ? $"{sourcePlan.Name}{CloneSuffix}" : input.Name;
            var clonePlan = _onboardingPlanManager.CreatePlan(tenantId, cloneName, sourcePlan.Description, sourcePlan.TargetAudience, sourcePlan.DurationDays);

            foreach (var sourceModule in sourcePlan.Modules.OrderBy(module => module.OrderIndex))
            {
                var cloneModule = _onboardingPlanManager.CreateModule(sourceModule.Name, sourceModule.Description, sourceModule.OrderIndex);
                _onboardingPlanManager.AddModule(clonePlan, cloneModule);

                foreach (var sourceTask in sourceModule.Tasks.OrderBy(task => task.OrderIndex))
                {
                    var cloneTask = _onboardingPlanManager.CreateTask(
                        sourceTask.Title,
                        sourceTask.Description,
                        sourceTask.Category,
                        sourceTask.OrderIndex,
                        sourceTask.DueDayOffset,
                        sourceTask.AssignmentTarget,
                        sourceTask.AcknowledgementRule);

                    _onboardingPlanManager.AddTask(clonePlan, cloneModule.Id, cloneTask);
                }
            }

            await _onboardingPlanRepository.InsertAsync(clonePlan);
            await CurrentUnitOfWork.SaveChangesAsync();

            var persistedPlan = await GetPlanForReadAsync(clonePlan.Id);
            return MapToDetailDto(persistedPlan);
        }

        private void ApplyModuleInputs(OnboardingPlan plan, IEnumerable<UpsertOnboardingModuleDto> moduleInputs)
        {
            foreach (var moduleInput in OrderModules(moduleInputs))
            {
                var module = _onboardingPlanManager.CreateModule(moduleInput.Name, moduleInput.Description, moduleInput.OrderIndex);
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
        }

        private async Task SyncModulesAsync(OnboardingPlan plan, IEnumerable<UpsertOnboardingModuleDto> moduleInputs)
        {
            var existingModuleIds = plan.Modules.Select(module => module.Id).ToHashSet();
            var orderedModuleInputs = OrderModules(moduleInputs).ToList();
            var requestedModuleIds = orderedModuleInputs
                .Where(module => module.Id.HasValue)
                .Select(module => module.Id.Value)
                .ToHashSet();

            foreach (var moduleInput in orderedModuleInputs)
            {
                if (moduleInput.Id.HasValue)
                {
                    _onboardingPlanManager.UpdateModule(plan, moduleInput.Id.Value, moduleInput.Name, moduleInput.Description, moduleInput.OrderIndex);
                    var existingModule = plan.Modules.Single(module => module.Id == moduleInput.Id.Value);
                    await SyncTasksAsync(plan, existingModule, moduleInput.Tasks);
                    continue;
                }

                var newModule = _onboardingPlanManager.CreateModule(moduleInput.Name, moduleInput.Description, moduleInput.OrderIndex);
                _onboardingPlanManager.AddModule(plan, newModule);
                await SyncTasksAsync(plan, newModule, moduleInput.Tasks);
            }

            var modulesToDelete = plan.Modules
                .Where(module => existingModuleIds.Contains(module.Id) && !requestedModuleIds.Contains(module.Id))
                .ToList();

            foreach (var module in modulesToDelete)
            {
                plan.Modules.Remove(module);
                await _onboardingModuleRepository.DeleteAsync(module);
            }
        }

        private async Task SyncTasksAsync(OnboardingPlan plan, OnboardingModule module, IEnumerable<UpsertOnboardingTaskDto> taskInputs)
        {
            var existingTaskIds = module.Tasks.Select(task => task.Id).ToHashSet();
            var orderedTaskInputs = OrderTasks(taskInputs).ToList();
            var requestedTaskIds = orderedTaskInputs
                .Where(task => task.Id.HasValue)
                .Select(task => task.Id.Value)
                .ToHashSet();

            foreach (var taskInput in orderedTaskInputs)
            {
                if (taskInput.Id.HasValue)
                {
                    _onboardingPlanManager.UpdateTask(
                        plan,
                        module.Id,
                        taskInput.Id.Value,
                        taskInput.Title,
                        taskInput.Description,
                        taskInput.Category,
                        taskInput.OrderIndex,
                        taskInput.DueDayOffset,
                        taskInput.AssignmentTarget,
                        taskInput.AcknowledgementRule);

                    continue;
                }

                var newTask = _onboardingPlanManager.CreateTask(
                    taskInput.Title,
                    taskInput.Description,
                    taskInput.Category,
                    taskInput.OrderIndex,
                    taskInput.DueDayOffset,
                    taskInput.AssignmentTarget,
                    taskInput.AcknowledgementRule);

                _onboardingPlanManager.AddTask(plan, module.Id, newTask);
            }

            var tasksToDelete = module.Tasks
                .Where(task => existingTaskIds.Contains(task.Id) && !requestedTaskIds.Contains(task.Id))
                .ToList();

            foreach (var task in tasksToDelete)
            {
                module.Tasks.Remove(task);
                await _onboardingTaskRepository.DeleteAsync(task);
            }
        }

        private async Task<OnboardingPlan> GetPlanForReadAsync(Guid planId)
        {
            var tenantId = GetRequiredTenantId();
            var plan = await _onboardingPlanRepository.GetAll()
                .AsNoTracking()
                .Where(planEntity => planEntity.TenantId == tenantId && planEntity.Id == planId)
                .Include(planEntity => planEntity.Modules)
                .ThenInclude(module => module.Tasks)
                .SingleOrDefaultAsync();

            if (plan == null)
            {
                throw new EntityNotFoundException(typeof(OnboardingPlan), planId);
            }

            return plan;
        }

        private async Task<OnboardingPlan> GetPlanForEditAsync(Guid planId)
        {
            var tenantId = GetRequiredTenantId();
            var plan = await _onboardingPlanRepository.GetAll()
                .Where(planEntity => planEntity.TenantId == tenantId && planEntity.Id == planId)
                .Include(planEntity => planEntity.Modules)
                .ThenInclude(module => module.Tasks)
                .SingleOrDefaultAsync();

            if (plan == null)
            {
                throw new EntityNotFoundException(typeof(OnboardingPlan), planId);
            }

            return plan;
        }

        private int GetRequiredTenantId()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                throw new AbpAuthorizationException("Onboarding plan management requires a tenant context.");
            }

            return AbpSession.TenantId.Value;
        }

        private static IEnumerable<UpsertOnboardingModuleDto> OrderModules(IEnumerable<UpsertOnboardingModuleDto> modules)
        {
            return (modules ?? Enumerable.Empty<UpsertOnboardingModuleDto>())
                .OrderBy(module => module.OrderIndex)
                .ThenBy(module => module.Id ?? Guid.Empty);
        }

        private static IEnumerable<UpsertOnboardingTaskDto> OrderTasks(IEnumerable<UpsertOnboardingTaskDto> tasks)
        {
            return (tasks ?? Enumerable.Empty<UpsertOnboardingTaskDto>())
                .OrderBy(task => task.OrderIndex)
                .ThenBy(task => task.Id ?? Guid.Empty);
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
