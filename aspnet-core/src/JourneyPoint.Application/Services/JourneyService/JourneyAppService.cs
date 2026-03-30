using System;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using JourneyPoint.Application.Services.GroqService;
using JourneyPoint.Application.Services.JourneyService.Dto;
using JourneyPoint.Authorization;
using JourneyPoint.Domains.Audit;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.JourneyService
{
    /// <summary>
    /// Provides tenant-scoped journey generation, review, and activation workflows.
    /// </summary>
    [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Facilitator, PermissionNames.Pages_JourneyPoint_TenantAdmin)]
    public partial class JourneyAppService : JourneyPointAppServiceBase, IJourneyAppService
    {
        private readonly IRepository<Hire, Guid> _hireRepository;
        private readonly IRepository<Journey, Guid> _journeyRepository;
        private readonly IRepository<JourneyTask, Guid> _journeyTaskRepository;
        private readonly IRepository<OnboardingPlan, Guid> _onboardingPlanRepository;
        private readonly IRepository<GenerationLog, Guid> _generationLogRepository;
        private readonly HireJourneyManager _hireJourneyManager;
        private readonly IGroqJourneyPersonalisationService _groqJourneyPersonalisationService;

        /// <summary>
        /// Initializes the journey generation application service dependencies.
        /// </summary>
        public JourneyAppService(
            IRepository<Hire, Guid> hireRepository,
            IRepository<Journey, Guid> journeyRepository,
            IRepository<JourneyTask, Guid> journeyTaskRepository,
            IRepository<OnboardingPlan, Guid> onboardingPlanRepository,
            IRepository<GenerationLog, Guid> generationLogRepository,
            HireJourneyManager hireJourneyManager,
            IGroqJourneyPersonalisationService groqJourneyPersonalisationService)
        {
            _hireRepository = hireRepository;
            _journeyRepository = journeyRepository;
            _journeyTaskRepository = journeyTaskRepository;
            _onboardingPlanRepository = onboardingPlanRepository;
            _generationLogRepository = generationLogRepository;
            _hireJourneyManager = hireJourneyManager;
            _groqJourneyPersonalisationService = groqJourneyPersonalisationService;
        }

        /// <summary>
        /// Generates one draft journey synchronously from the hire's published onboarding plan.
        /// </summary>
        public async Task<JourneyDraftDto> GenerateDraftAsync(GenerateDraftJourneyRequest input)
        {
            ArgumentNullException.ThrowIfNull(input);

            var tenantId = GetRequiredTenantId();
            var hire = await GetHireForGenerationAsync(input.HireId, tenantId);
            var onboardingPlan = await GetPublishedPlanWithTemplatesAsync(hire.OnboardingPlanId, tenantId);
            var journey = _hireJourneyManager.CreateDraftJourney(hire, onboardingPlan);

            CopyTemplateTasksToDraft(hire, journey, onboardingPlan);

            await _journeyRepository.InsertAsync(journey);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToDraftDto(hire, journey);
        }

        /// <summary>
        /// Returns the current generated journey review state for one hire.
        /// </summary>
        public async Task<JourneyDraftDto> GetDraftAsync(Guid hireId)
        {
            var hire = await GetHireWithJourneyAsync(hireId, GetRequiredTenantId());
            EnsureJourneyExists(hire);
            return MapToDraftDto(hire, hire.Journey);
        }

        /// <summary>
        /// Updates one draft journey task snapshot during facilitator review.
        /// </summary>
        public async Task<JourneyTaskReviewDto> UpdateTaskAsync(Guid journeyTaskId, UpdateJourneyTaskRequest input)
        {
            ArgumentNullException.ThrowIfNull(input);

            var journeyTask = await GetJourneyTaskAsync(journeyTaskId, GetRequiredTenantId());

            _hireJourneyManager.UpdateDraftTask(
                journeyTask.Journey.Hire,
                journeyTask.Journey,
                journeyTask,
                input.ModuleTitle,
                input.ModuleOrderIndex,
                input.TaskOrderIndex,
                input.Title,
                input.Description,
                input.Category,
                input.AssignmentTarget,
                input.AcknowledgementRule,
                input.DueDayOffset);

            await CurrentUnitOfWork.SaveChangesAsync();
            return MapToTaskDto(journeyTask);
        }

        /// <summary>
        /// Adds one facilitator-authored task to a draft journey.
        /// </summary>
        public async Task<JourneyTaskReviewDto> AddTaskAsync(Guid journeyId, AddJourneyTaskRequest input)
        {
            ArgumentNullException.ThrowIfNull(input);

            var journey = await GetJourneyAsync(journeyId, GetRequiredTenantId());
            var journeyTask = _hireJourneyManager.AddFacilitatorTaskToDraft(
                journey.Hire,
                journey,
                input.ModuleTitle,
                input.ModuleOrderIndex,
                input.TaskOrderIndex,
                input.Title,
                input.Description,
                input.Category,
                input.AssignmentTarget,
                input.AcknowledgementRule,
                input.DueDayOffset);

            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToTaskDto(journeyTask);
        }

        /// <summary>
        /// Removes one pending task from a draft journey before activation.
        /// </summary>
        public async Task RemovePendingTaskAsync(Guid journeyTaskId)
        {
            var journeyTask = await GetJourneyTaskAsync(journeyTaskId, GetRequiredTenantId());

            _hireJourneyManager.RemovePendingDraftTask(
                journeyTask.Journey.Hire,
                journeyTask.Journey,
                journeyTask);

            await _journeyTaskRepository.DeleteAsync(journeyTask);
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        /// <summary>
        /// Activates the generated journey for one hire after review is complete.
        /// </summary>
        public async Task<JourneyDraftDto> ActivateAsync(Guid hireId)
        {
            var hire = await GetHireWithJourneyAsync(hireId, GetRequiredTenantId());
            EnsureJourneyExists(hire);

            _hireJourneyManager.ActivateJourney(hire, hire.Journey);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToDraftDto(hire, hire.Journey);
        }
    }
}
