using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using JourneyPoint.Application.Services.JourneyService.Dto;

namespace JourneyPoint.Application.Services.JourneyService
{
    /// <summary>
    /// Defines draft journey generation, review, and activation workflows.
    /// </summary>
    public interface IJourneyAppService : IApplicationService
    {
        /// <summary>
        /// Generates one draft journey synchronously from the hire's published onboarding plan.
        /// </summary>
        Task<JourneyDraftDto> GenerateDraftAsync(GenerateDraftJourneyRequest input);

        /// <summary>
        /// Returns the current generated journey review state for one hire.
        /// </summary>
        Task<JourneyDraftDto> GetDraftAsync(Guid hireId);

        /// <summary>
        /// Updates one draft journey task snapshot during facilitator review.
        /// </summary>
        Task<JourneyTaskReviewDto> UpdateTaskAsync(Guid journeyTaskId, UpdateJourneyTaskRequest input);

        /// <summary>
        /// Adds one facilitator-authored task to a draft journey.
        /// </summary>
        Task<JourneyTaskReviewDto> AddTaskAsync(Guid journeyId, AddJourneyTaskRequest input);

        /// <summary>
        /// Removes one pending task from a draft journey before activation.
        /// </summary>
        Task RemovePendingTaskAsync(Guid journeyTaskId);

        /// <summary>
        /// Requests diff-ready AI personalisation revisions for one journey.
        /// </summary>
        Task<JourneyPersonalisationProposalDto> RequestPersonalisationAsync(RequestJourneyPersonalisationRequest input);

        /// <summary>
        /// Applies selected AI personalisation revisions to one journey.
        /// </summary>
        Task<JourneyDraftDto> ApplyPersonalisationAsync(ApplyJourneyPersonalisationRequest input);

        /// <summary>
        /// Activates the generated journey for one hire after review is complete.
        /// </summary>
        Task<JourneyDraftDto> ActivateAsync(Guid hireId);
    }
}
