using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using JourneyPoint.Application.Services.OnboardingPlanService.Dto;

namespace JourneyPoint.Application.Services.OnboardingPlanService
{
    /// <summary>
    /// Defines application-service operations for reusable onboarding plan management.
    /// </summary>
    public interface IOnboardingPlanAppService : IApplicationService
    {
        /// <summary>
        /// Returns a filtered page of tenant-scoped onboarding plans.
        /// </summary>
        Task<PagedResultDto<OnboardingPlanListItemDto>> GetPlansAsync(GetOnboardingPlansInput input);

        /// <summary>
        /// Returns one onboarding plan with ordered modules and tasks for the plan builder.
        /// </summary>
        Task<OnboardingPlanDetailDto> GetDetailAsync(EntityDto<Guid> input);

        /// <summary>
        /// Creates a new draft onboarding plan.
        /// </summary>
        Task<OnboardingPlanDetailDto> CreateAsync(CreateOnboardingPlanRequest input);

        /// <summary>
        /// Updates a draft onboarding plan and its ordered module/task structure.
        /// </summary>
        Task<OnboardingPlanDetailDto> UpdateAsync(UpdateOnboardingPlanRequest input);

        /// <summary>
        /// Publishes a draft onboarding plan.
        /// </summary>
        Task<OnboardingPlanDetailDto> PublishAsync(EntityDto<Guid> input);

        /// <summary>
        /// Archives an onboarding plan.
        /// </summary>
        Task<OnboardingPlanDetailDto> ArchiveAsync(EntityDto<Guid> input);

        /// <summary>
        /// Creates a draft copy of an existing onboarding plan.
        /// </summary>
        Task<OnboardingPlanDetailDto> CloneAsync(CloneOnboardingPlanRequest input);

        /// <summary>
        /// Generates AI-enhanced proposals for all modules and tasks in a draft plan.
        /// Returns enhanced content for facilitator review before applying.
        /// </summary>
        Task<PlanEnhancementProposalDto> EnhancePlanWithAiAsync(EntityDto<Guid> input);

        /// <summary>
        /// Applies AI-enhanced proposals to the plan's modules and tasks.
        /// </summary>
        Task<OnboardingPlanDetailDto> ApplyPlanEnhancementAsync(ApplyPlanEnhancementRequest input);
    }
}
