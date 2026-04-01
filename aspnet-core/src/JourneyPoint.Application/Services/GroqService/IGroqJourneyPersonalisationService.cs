using System.Collections.Generic;
using System.Threading.Tasks;
using JourneyPoint.Application.Services.GroqService.Dto;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.GroqService
{
    /// <summary>
    /// Defines backend-only Groq personalisation for journey task revisions.
    /// </summary>
    public interface IGroqJourneyPersonalisationService
    {
        /// <summary>
        /// Gets a value indicating whether journey personalisation is configured and available.
        /// </summary>
        bool IsEnabled { get; }

        /// <summary>
        /// Requests diff-ready personalisation proposals for the provided journey tasks.
        /// </summary>
        Task<GroqJourneyPersonalisationResult> GenerateProposalAsync(
            Hire hire,
            Journey journey,
            OnboardingPlan onboardingPlan,
            IReadOnlyCollection<JourneyTask> eligibleTasks,
            string facilitatorInstructions = null);
    }
}
