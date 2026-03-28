using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
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
    public partial class OnboardingPlanAppService : JourneyPointAppServiceBase, IOnboardingPlanAppService
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
    }
}
