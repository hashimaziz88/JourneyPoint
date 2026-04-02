using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using JourneyPoint.Application.Services.WellnessService.Dto;

namespace JourneyPoint.Application.Services.WellnessService
{
    /// <summary>
    /// Defines wellness check-in workflows for hires, managers, and HR facilitators.
    /// </summary>
    public interface IWellnessAppService : IApplicationService
    {
        /// <summary>
        /// Returns all scheduled wellness check-in summaries for a hire.
        /// Accessible by HR facilitators, managers, and the hire themselves.
        /// </summary>
        Task<HireWellnessOverviewDto> GetHireWellnessOverviewAsync(Guid hireId);

        /// <summary>
        /// Returns the full detail of one wellness check-in including questions and answers.
        /// </summary>
        Task<WellnessCheckInDetailDto> GetCheckInDetailAsync(Guid checkInId);

        /// <summary>
        /// Saves one answer for a wellness question. Called by the hire.
        /// </summary>
        Task<WellnessQuestionDto> SaveAnswerAsync(SaveWellnessAnswerRequest request);

        /// <summary>
        /// Generates an AI-suggested draft answer for one wellness question. Called by the hire.
        /// </summary>
        Task<WellnessQuestionDto> GenerateAnswerSuggestionAsync(GenerateWellnessAnswerSuggestionRequest request);

        /// <summary>
        /// Submits a completed wellness check-in, triggering AI insight generation.
        /// </summary>
        Task<WellnessCheckInDetailDto> SubmitCheckInAsync(SubmitWellnessCheckInRequest request);

        /// <summary>
        /// Generates and persists wellness check-ins for a newly activated journey.
        /// Called internally after journey activation.
        /// </summary>
        Task GenerateCheckInsForJourneyAsync(Guid hireId, Guid journeyId);
    }
}
