using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using JourneyPoint.Application.Services.GroqService.Dto;
using JourneyPoint.Application.Services.OnboardingPlanService.Dto;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.GroqService
{
    /// <summary>
    /// Defines backend-only Groq AI enhancement for onboarding plan modules and tasks.
    /// </summary>
    public interface IGroqPlanEnhancementService
    {
        /// <summary>
        /// Gets a value indicating whether plan enhancement is configured and available.
        /// </summary>
        bool IsEnabled { get; }

        /// <summary>
        /// Rewrites module names, descriptions, task titles, and task descriptions with
        /// professional AI-enhanced writing. Returns proposals for facilitator review.
        /// </summary>
        Task<GroqPlanEnhancementResult> EnhancePlanAsync(
            OnboardingPlan plan,
            IReadOnlyList<OnboardingModuleDto> modules,
            int tenantId,
            Guid planId);
    }
}
