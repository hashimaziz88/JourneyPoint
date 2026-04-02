using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using JourneyPoint.Application.Services.GroqService;
using JourneyPoint.Application.Services.GroqService.Helpers;
using JourneyPoint.Application.Services.WellnessService.Dto;
using JourneyPoint.Authorization;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.Wellness;
using JourneyPoint.Domains.Wellness.Enums;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.Application.Services.WellnessService
{
    /// <summary>
    /// Provides hire wellness check-in orchestration including generation, answering,
    /// AI suggestions, submission, and HR facilitator/manager review.
    /// </summary>
    public class WellnessAppService : JourneyPointAppServiceBase, IWellnessAppService
    {
        private readonly IRepository<Hire, Guid> _hireRepository;
        private readonly IRepository<Journey, Guid> _journeyRepository;
        private readonly IRepository<OnboardingPlan, Guid> _planRepository;
        private readonly IRepository<WellnessCheckIn, Guid> _checkInRepository;
        private readonly IRepository<WellnessQuestion, Guid> _questionRepository;
        private readonly WellnessManager _wellnessManager;
        private readonly IGroqWellnessService _groqWellnessService;

        /// <summary>
        /// Initializes the wellness application service dependencies.
        /// </summary>
        public WellnessAppService(
            IRepository<Hire, Guid> hireRepository,
            IRepository<Journey, Guid> journeyRepository,
            IRepository<OnboardingPlan, Guid> planRepository,
            IRepository<WellnessCheckIn, Guid> checkInRepository,
            IRepository<WellnessQuestion, Guid> questionRepository,
            WellnessManager wellnessManager,
            IGroqWellnessService groqWellnessService)
        {
            _hireRepository = hireRepository;
            _journeyRepository = journeyRepository;
            _planRepository = planRepository;
            _checkInRepository = checkInRepository;
            _questionRepository = questionRepository;
            _wellnessManager = wellnessManager;
            _groqWellnessService = groqWellnessService;
        }

        /// <inheritdoc />
        [AbpAuthorize(
            PermissionNames.Pages_JourneyPoint_Facilitator,
            PermissionNames.Pages_JourneyPoint_TenantAdmin,
            PermissionNames.Pages_JourneyPoint_Manager,
            PermissionNames.Pages_JourneyPoint_Enrolee)]
        public async Task<HireWellnessOverviewDto> GetHireWellnessOverviewAsync(Guid hireId)
        {
            var tenantId = GetRequiredTenantId();
            var hire = await GetHireForTenantAsync(hireId, tenantId);

            var checkIns = await _checkInRepository.GetAll()
                .Where(c => c.HireId == hireId && c.TenantId == tenantId)
                .Include(c => c.Questions)
                .OrderBy(c => c.ScheduledDate)
                .ToListAsync();

            var summaries = checkIns.Select(MapToSummary).ToList();

            return new HireWellnessOverviewDto
            {
                HireId = hire.Id,
                HireFullName = hire.FullName,
                CheckIns = summaries,
                CompletedCount = summaries.Count(s => s.Status == WellnessCheckInStatus.Completed),
                TotalCount = summaries.Count
            };
        }

        /// <inheritdoc />
        [AbpAuthorize(
            PermissionNames.Pages_JourneyPoint_Facilitator,
            PermissionNames.Pages_JourneyPoint_TenantAdmin,
            PermissionNames.Pages_JourneyPoint_Manager,
            PermissionNames.Pages_JourneyPoint_Enrolee)]
        public async Task<WellnessCheckInDetailDto> GetCheckInDetailAsync(Guid checkInId)
        {
            var tenantId = GetRequiredTenantId();
            var checkIn = await GetCheckInWithQuestionsAsync(checkInId, tenantId);
            var hire = await GetHireForTenantAsync(checkIn.HireId, tenantId);

            return MapToDetail(checkIn, hire.FullName);
        }

        /// <inheritdoc />
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Enrolee)]
        public async Task<WellnessQuestionDto> SaveAnswerAsync(SaveWellnessAnswerRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);

            var tenantId = GetRequiredTenantId();
            var checkIn = await GetCheckInWithQuestionsAsync(request.CheckInId, tenantId);
            var question = checkIn.Questions.FirstOrDefault(q => q.Id == request.QuestionId)
                ?? throw new UserFriendlyException("The wellness question could not be found.");

            _wellnessManager.RecordAnswer(checkIn, question, request.AnswerText);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToQuestionDto(question);
        }

        /// <inheritdoc />
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Enrolee)]
        public async Task<WellnessQuestionDto> GenerateAnswerSuggestionAsync(GenerateWellnessAnswerSuggestionRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);

            if (!_groqWellnessService.IsEnabled)
            {
                throw new UserFriendlyException("AI answer suggestions are not currently available.");
            }

            var tenantId = GetRequiredTenantId();
            var checkIn = await GetCheckInWithQuestionsAsync(request.CheckInId, tenantId);
            var question = checkIn.Questions.FirstOrDefault(q => q.Id == request.QuestionId)
                ?? throw new UserFriendlyException("The wellness question could not be found.");
            var hire = await GetHireForTenantAsync(checkIn.HireId, tenantId);

            var result = await _groqWellnessService.SuggestAnswerAsync(hire, checkIn, question);
            _wellnessManager.SetAiSuggestedAnswer(question, result.SuggestedAnswer);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToQuestionDto(question);
        }

        /// <inheritdoc />
        [AbpAuthorize(PermissionNames.Pages_JourneyPoint_Enrolee)]
        public async Task<WellnessCheckInDetailDto> SubmitCheckInAsync(SubmitWellnessCheckInRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);

            var tenantId = GetRequiredTenantId();
            var checkIn = await GetCheckInWithQuestionsAsync(request.CheckInId, tenantId);
            var hire = await GetHireForTenantAsync(checkIn.HireId, tenantId);

            _wellnessManager.SubmitCheckIn(checkIn);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToDetail(checkIn, hire.FullName);
        }

        /// <inheritdoc />
        public async Task GenerateCheckInsForJourneyAsync(Guid hireId, Guid journeyId)
        {
            var hire = await _hireRepository.GetAsync(hireId);
            var journey = await _journeyRepository.GetAsync(journeyId);
            var plan = await _planRepository.GetAsync(hire.OnboardingPlanId);

            var scheduledPeriods = _wellnessManager.GetScheduledPeriods(plan.DurationDays);

            foreach (var (period, dayOffset) in scheduledPeriods)
            {
                var checkIn = _wellnessManager.CreateCheckIn(hire, journey, period, dayOffset);
                await _checkInRepository.InsertAsync(checkIn);

                if (_groqWellnessService.IsEnabled)
                {
                    try
                    {
                        var result = await _groqWellnessService.GenerateQuestionsAsync(hire, journey, plan, period);
                        _wellnessManager.AssignQuestions(checkIn, result.Questions);
                    }
                    catch
                    {
                        // Non-blocking: check-in is saved without questions; can be retried.
                    }
                }

                await CurrentUnitOfWork.SaveChangesAsync();
            }
        }

        private int GetRequiredTenantId()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                throw new AbpAuthorizationException("Wellness management requires a tenant context.");
            }

            return AbpSession.TenantId.Value;
        }

        private async Task<Hire> GetHireForTenantAsync(Guid hireId, int tenantId)
        {
            var hire = await _hireRepository.FirstOrDefaultAsync(
                h => h.Id == hireId && h.TenantId == tenantId);

            return hire ?? throw new UserFriendlyException("The hire could not be found.");
        }

        private async Task<WellnessCheckIn> GetCheckInWithQuestionsAsync(Guid checkInId, int tenantId)
        {
            var checkIn = await _checkInRepository.GetAll()
                .Where(c => c.Id == checkInId && c.TenantId == tenantId)
                .Include(c => c.Questions)
                .FirstOrDefaultAsync();

            return checkIn ?? throw new UserFriendlyException("The wellness check-in could not be found.");
        }

        private static WellnessCheckInSummaryDto MapToSummary(WellnessCheckIn checkIn)
        {
            return new WellnessCheckInSummaryDto
            {
                Id = checkIn.Id,
                Period = checkIn.Period,
                PeriodLabel = GroqWellnessPromptFactory.GetPeriodLabel(checkIn.Period),
                Status = checkIn.Status,
                ScheduledDate = checkIn.ScheduledDate,
                SubmittedAt = checkIn.SubmittedAt,
                AnsweredCount = checkIn.Questions.Count(q => q.IsAnswered),
                TotalCount = checkIn.Questions.Count
            };
        }

        private static WellnessCheckInDetailDto MapToDetail(WellnessCheckIn checkIn, string hireFullName)
        {
            return new WellnessCheckInDetailDto
            {
                Id = checkIn.Id,
                HireId = checkIn.HireId,
                HireFullName = hireFullName,
                Period = checkIn.Period,
                PeriodLabel = GroqWellnessPromptFactory.GetPeriodLabel(checkIn.Period),
                Status = checkIn.Status,
                ScheduledDate = checkIn.ScheduledDate,
                SubmittedAt = checkIn.SubmittedAt,
                InsightSummary = checkIn.InsightSummary,
                Questions = checkIn.Questions
                    .OrderBy(q => q.OrderIndex)
                    .Select(MapToQuestionDto)
                    .ToList()
            };
        }

        private static WellnessQuestionDto MapToQuestionDto(WellnessQuestion question)
        {
            return new WellnessQuestionDto
            {
                Id = question.Id,
                OrderIndex = question.OrderIndex,
                QuestionText = question.QuestionText,
                AnswerText = question.AnswerText,
                AiSuggestedAnswer = question.AiSuggestedAnswer,
                IsAnswered = question.IsAnswered
            };
        }
    }
}
