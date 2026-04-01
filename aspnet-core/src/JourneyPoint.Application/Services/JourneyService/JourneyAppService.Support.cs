using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Entities;
using JourneyPoint.Application.Services.JourneyService.Dto;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.Hires.Enums;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.OnboardingPlans.Enums;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.JourneyService
{
    /// <summary>
    /// Provides query, validation, and mapping helpers for journey generation and review.
    /// </summary>
    public partial class JourneyAppService
    {
        private async Task<Hire> GetHireForGenerationAsync(Guid hireId, int tenantId)
        {
            var hire = await _hireRepository.GetAll()
                .Include(existingHire => existingHire.Journey)
                .SingleOrDefaultAsync(existingHire => existingHire.Id == hireId && existingHire.TenantId == tenantId);

            if (hire == null)
            {
                throw new EntityNotFoundException(typeof(Hire), hireId);
            }

            return hire;
        }

        private async Task<Hire> GetHireWithJourneyAsync(Guid hireId, int tenantId)
        {
            var hire = await _hireRepository.GetAll()
                .Include(existingHire => existingHire.Journey)
                    .ThenInclude(journey => journey.Tasks)
                .SingleOrDefaultAsync(existingHire => existingHire.Id == hireId && existingHire.TenantId == tenantId);

            if (hire == null)
            {
                throw new EntityNotFoundException(typeof(Hire), hireId);
            }

            return hire;
        }

        private async Task<Journey> GetJourneyAsync(Guid journeyId, int tenantId)
        {
            var journey = await _journeyRepository.GetAll()
                .Include(existingJourney => existingJourney.Hire)
                .Include(existingJourney => existingJourney.Tasks)
                .SingleOrDefaultAsync(existingJourney =>
                    existingJourney.Id == journeyId &&
                    existingJourney.TenantId == tenantId);

            if (journey == null)
            {
                throw new EntityNotFoundException(typeof(Journey), journeyId);
            }

            return journey;
        }

        private async Task<JourneyTask> GetJourneyTaskAsync(Guid journeyTaskId, int tenantId)
        {
            var journeyTask = await _journeyTaskRepository.GetAll()
                .Include(existingTask => existingTask.Journey)
                    .ThenInclude(journey => journey.Hire)
                .Include(existingTask => existingTask.Journey)
                    .ThenInclude(journey => journey.Tasks)
                .SingleOrDefaultAsync(existingTask =>
                    existingTask.Id == journeyTaskId &&
                    existingTask.TenantId == tenantId);

            if (journeyTask == null)
            {
                throw new EntityNotFoundException(typeof(JourneyTask), journeyTaskId);
            }

            return journeyTask;
        }

        private async Task<OnboardingPlan> GetPublishedPlanWithTemplatesAsync(Guid planId, int tenantId)
        {
            var onboardingPlan = await _onboardingPlanRepository.GetAll()
                .Include(plan => plan.Modules)
                    .ThenInclude(module => module.Tasks)
                .SingleOrDefaultAsync(plan => plan.Id == planId && plan.TenantId == tenantId);

            if (onboardingPlan == null)
            {
                throw new EntityNotFoundException(typeof(OnboardingPlan), planId);
            }

            if (onboardingPlan.Status != OnboardingPlanStatus.Published)
            {
                throw new InvalidOperationException("Only published onboarding plans can generate draft journeys.");
            }

            return onboardingPlan;
        }

        private void CopyTemplateTasksToDraft(Hire hire, Journey journey, OnboardingPlan onboardingPlan)
        {
            foreach (var module in GetOrderedModules(onboardingPlan))
            {
                foreach (var task in GetOrderedTasks(module))
                {
                    _hireJourneyManager.AddTaskCopyFromTemplate(hire, journey, module, task);
                }
            }
        }

        private int GetRequiredTenantId()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                throw new AbpAuthorizationException("Journey generation requires a tenant context.");
            }

            return AbpSession.TenantId.Value;
        }

        private static void EnsureJourneyExists(Hire hire)
        {
            if (hire.Journey == null)
            {
                throw new InvalidOperationException("Hire does not have a generated journey yet.");
            }
        }

        private static void EnsureDraftJourneyExists(Hire hire)
        {
            EnsureJourneyExists(hire);

            if (hire.Journey.Status != JourneyStatus.Draft)
            {
                throw new InvalidOperationException("Only draft journeys can be opened for facilitator review.");
            }
        }

        private static IReadOnlyList<OnboardingModule> GetOrderedModules(OnboardingPlan onboardingPlan)
        {
            return onboardingPlan.Modules
                .OrderBy(module => module.OrderIndex)
                .ToList();
        }

        private static IReadOnlyList<OnboardingTask> GetOrderedTasks(OnboardingModule onboardingModule)
        {
            return onboardingModule.Tasks
                .OrderBy(task => task.OrderIndex)
                .ToList();
        }

        private static JourneyDraftDto MapToDraftDto(Hire hire, Journey journey)
        {
            return new JourneyDraftDto
            {
                JourneyId = journey.Id,
                HireId = hire.Id,
                OnboardingPlanId = journey.OnboardingPlanId,
                HireStartDate = hire.StartDate,
                HireStatus = hire.Status,
                Status = journey.Status,
                ActivatedAt = journey.ActivatedAt,
                PausedAt = journey.PausedAt,
                CompletedAt = journey.CompletedAt,
                Tasks = journey.Tasks
                    .OrderBy(task => task.ModuleOrderIndex)
                    .ThenBy(task => task.TaskOrderIndex)
                    .Select(MapToTaskDto)
                    .ToList()
            };
        }

        private static JourneyTaskReviewDto MapToTaskDto(JourneyTask journeyTask)
        {
            return new JourneyTaskReviewDto
            {
                Id = journeyTask.Id,
                SourceOnboardingTaskId = journeyTask.SourceOnboardingTaskId,
                SourceOnboardingModuleId = journeyTask.SourceOnboardingModuleId,
                ModuleTitle = journeyTask.ModuleTitle,
                ModuleOrderIndex = journeyTask.ModuleOrderIndex,
                TaskOrderIndex = journeyTask.TaskOrderIndex,
                Title = journeyTask.Title,
                Description = journeyTask.Description,
                Category = journeyTask.Category,
                AssignmentTarget = journeyTask.AssignmentTarget,
                AcknowledgementRule = journeyTask.AcknowledgementRule,
                DueDayOffset = journeyTask.DueDayOffset,
                DueOn = journeyTask.DueOn,
                Status = journeyTask.Status,
                AcknowledgedAt = journeyTask.AcknowledgedAt,
                CompletedAt = journeyTask.CompletedAt,
                CompletedByUserId = journeyTask.CompletedByUserId
            };
        }
    }
}
