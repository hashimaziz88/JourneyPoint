using System.Threading.Tasks;
using JourneyPoint.Application.Services.GroqService.Dto;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.Wellness;
using JourneyPoint.Domains.Wellness.Enums;

namespace JourneyPoint.Application.Services.GroqService
{
    /// <summary>
    /// Defines backend-only Groq AI operations for wellness check-in workflows.
    /// </summary>
    public interface IGroqWellnessService
    {
        /// <summary>
        /// Gets a value indicating whether wellness AI generation is configured and available.
        /// </summary>
        bool IsEnabled { get; }

        /// <summary>
        /// Generates 3–5 AI wellness questions for a specific check-in period milestone.
        /// </summary>
        Task<GroqWellnessQuestionsResult> GenerateQuestionsAsync(
            Hire hire,
            Journey journey,
            OnboardingPlan onboardingPlan,
            WellnessCheckInPeriod period);

        /// <summary>
        /// Generates an AI-suggested draft answer for one wellness question on request by the hire.
        /// </summary>
        Task<GroqWellnessAnswerSuggestionResult> SuggestAnswerAsync(
            Hire hire,
            WellnessCheckIn checkIn,
            WellnessQuestion question);
    }
}
