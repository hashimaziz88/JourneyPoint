using System.Text.Json;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;
using JourneyPoint.Domains.Wellness.Enums;

namespace JourneyPoint.Application.Services.GroqService.Helpers
{
    internal static class GroqWellnessPromptFactory
    {
        private static readonly JsonSerializerOptions SerializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        internal static string BuildQuestionGenerationSystemPrompt()
        {
            return
                "You generate wellness check-in questions for new hires during their onboarding journey. " +
                "Return JSON only with a single key 'questions' containing an array of 3 to 5 open-ended, " +
                "empathetic question strings. Questions should help managers and HR facilitators understand " +
                "the hire's wellbeing, integration, and confidence at this point in their journey. " +
                "Questions must be practical, concise, and non-intrusive. " +
                "Do not wrap the JSON in markdown.";
        }

        internal static string BuildQuestionGenerationUserContent(
            Hire hire,
            OnboardingPlan onboardingPlan,
            WellnessCheckInPeriod period)
        {
            var periodLabel = GetPeriodLabel(period);
            var payload = new
            {
                hire = new
                {
                    fullName = hire.FullName,
                    roleTitle = hire.RoleTitle,
                    department = hire.Department,
                    startDate = hire.StartDate.ToString("yyyy-MM-dd")
                },
                plan = new
                {
                    name = onboardingPlan.Name,
                    targetAudience = onboardingPlan.TargetAudience,
                    durationDays = onboardingPlan.DurationDays
                },
                checkInPeriod = periodLabel,
                instruction = $"Generate 3–5 wellness questions appropriate for a hire who is at the '{periodLabel}' milestone of their onboarding."
            };

            return JsonSerializer.Serialize(payload, SerializerOptions);
        }

        internal static string BuildAnswerSuggestionSystemPrompt()
        {
            return
                "You help new hires draft thoughtful answers to wellness check-in questions. " +
                "Return JSON only with a single key 'suggestedAnswer' containing a friendly, " +
                "honest, and concise answer string written in first person from the hire's perspective. " +
                "The answer should reflect genuine reflection on the question, be 2–4 sentences, " +
                "and avoid being overly positive or negative. " +
                "Do not wrap the JSON in markdown.";
        }

        internal static string BuildAnswerSuggestionUserContent(
            Hire hire,
            string questionText,
            string periodLabel)
        {
            var payload = new
            {
                hire = new
                {
                    fullName = hire.FullName,
                    roleTitle = hire.RoleTitle
                },
                checkInPeriod = periodLabel,
                question = questionText
            };

            return JsonSerializer.Serialize(payload, SerializerOptions);
        }

        internal static string GetPeriodLabel(WellnessCheckInPeriod period)
        {
            return period switch
            {
                WellnessCheckInPeriod.Day1 => "Day 1",
                WellnessCheckInPeriod.Day2 => "Day 2",
                WellnessCheckInPeriod.Week1 => "End of Week 1",
                WellnessCheckInPeriod.Month1 => "Month 1",
                WellnessCheckInPeriod.Month2 => "Month 2",
                WellnessCheckInPeriod.Month3 => "Month 3",
                WellnessCheckInPeriod.Month4 => "Month 4",
                WellnessCheckInPeriod.Month5 => "Month 5",
                WellnessCheckInPeriod.Month6 => "Month 6",
                _ => period.ToString()
            };
        }
    }
}
