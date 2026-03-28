using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Entities;
using JourneyPoint.Domains.OnboardingPlans;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.OnboardingDocumentService
{
    public partial class OnboardingDocumentAppService
    {
        private async Task<OnboardingPlan> GetPlanForReadAsync(Guid planId)
        {
            var tenantId = GetRequiredTenantId();
            var plan = await _onboardingPlanRepository.GetAll()
                .AsNoTracking()
                .AsSplitQuery()
                .Where(planEntity => planEntity.TenantId == tenantId && planEntity.Id == planId)
                .Include(planEntity => planEntity.Documents)
                .ThenInclude(document => document.ExtractedTasks)
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
                .Include(planEntity => planEntity.Documents)
                .ThenInclude(document => document.ExtractedTasks)
                .Include(planEntity => planEntity.Modules)
                .ThenInclude(module => module.Tasks)
                .SingleOrDefaultAsync();

            if (plan == null)
            {
                throw new EntityNotFoundException(typeof(OnboardingPlan), planId);
            }

            return plan;
        }

        private async Task<OnboardingDocument> GetDocumentForReadAsync(Guid documentId)
        {
            var tenantId = GetRequiredTenantId();
            var document = await _onboardingDocumentRepository.GetAll()
                .AsNoTracking()
                .AsSplitQuery()
                .Where(documentEntity => documentEntity.TenantId == tenantId && documentEntity.Id == documentId)
                .Include(documentEntity => documentEntity.ExtractedTasks)
                .Include(documentEntity => documentEntity.OnboardingPlan)
                .ThenInclude(plan => plan.Modules)
                .ThenInclude(module => module.Tasks)
                .SingleOrDefaultAsync();

            if (document == null)
            {
                throw new EntityNotFoundException(typeof(OnboardingDocument), documentId);
            }

            return document;
        }

        private async Task<OnboardingDocument> GetDocumentForEditAsync(Guid documentId)
        {
            var tenantId = GetRequiredTenantId();
            var document = await _onboardingDocumentRepository.GetAll()
                .AsSplitQuery()
                .Where(documentEntity => documentEntity.TenantId == tenantId && documentEntity.Id == documentId)
                .Include(documentEntity => documentEntity.ExtractedTasks)
                .Include(documentEntity => documentEntity.OnboardingPlan)
                .ThenInclude(plan => plan.Modules)
                .ThenInclude(module => module.Tasks)
                .SingleOrDefaultAsync();

            if (document == null)
            {
                throw new EntityNotFoundException(typeof(OnboardingDocument), documentId);
            }

            return document;
        }

        private async Task<ExtractedTask> GetProposalForEditAsync(Guid proposalId)
        {
            var tenantId = GetRequiredTenantId();
            var proposal = await _extractedTaskRepository.GetAll()
                .AsSplitQuery()
                .Where(task => task.TenantId == tenantId && task.Id == proposalId)
                .Include(task => task.OnboardingDocument)
                .ThenInclude(document => document.OnboardingPlan)
                .ThenInclude(plan => plan.Modules)
                .ThenInclude(module => module.Tasks)
                .Include(task => task.OnboardingDocument)
                .ThenInclude(document => document.ExtractedTasks)
                .SingleOrDefaultAsync();

            if (proposal == null)
            {
                throw new EntityNotFoundException(typeof(ExtractedTask), proposalId);
            }

            return proposal;
        }

        private int GetRequiredTenantId()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                throw new AbpAuthorizationException("Onboarding document enrichment requires a tenant context.");
            }

            return AbpSession.TenantId.Value;
        }

        private long GetRequiredUserId()
        {
            if (!AbpSession.UserId.HasValue)
            {
                throw new AbpAuthorizationException("Onboarding document enrichment requires a signed-in user.");
            }

            return AbpSession.UserId.Value;
        }
    }
}
