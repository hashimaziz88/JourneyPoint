using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Entities;
using JourneyPoint.Domains.OnboardingPlans;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.OnboardingPlanService
{
    /// <summary>
    /// Provides read-focused onboarding plan query helpers for the application service.
    /// </summary>
    public partial class OnboardingPlanAppService
    {
        private async Task<OnboardingPlan> GetPlanForReadAsync(Guid planId)
        {
            var tenantId = GetRequiredTenantId();
            var plan = await _onboardingPlanRepository.GetAll()
                .AsNoTracking()
                .AsSplitQuery()
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
                .AsSplitQuery()
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
    }
}
