using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using JourneyPoint.Application.Services.OnboardingPlanService.Dto;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.GroqService.Helpers
{
    internal static class GroqPlanEnhancementPromptFactory
    {
        private static readonly JsonSerializerOptions SerializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        internal static string BuildSystemPrompt()
        {
            return
                "You are an expert at writing professional onboarding plans for HR teams. " +
                "You will be given an onboarding plan's modules and tasks in JSON format. " +
                "Rewrite the module names, module descriptions, task titles, and task descriptions " +
                "with clearer, more professional, and more actionable language. " +
                "Preserve the original structure exactly — do not add, remove, or reorder modules or tasks. " +
                "Return JSON only with a key 'modules' containing the enhanced array. " +
                "Each module must include: moduleId (unchanged), name, description, and a tasks array. " +
                "Each task must include: taskId (unchanged), title, description. " +
                "Do not change any other fields. Do not wrap the JSON in markdown.";
        }

        internal static string BuildUserContent(OnboardingPlan plan, IReadOnlyList<OnboardingModuleDto> modules)
        {
            var payload = new
            {
                plan = new
                {
                    name = plan.Name,
                    targetAudience = plan.TargetAudience,
                    durationDays = plan.DurationDays
                },
                modules = modules.Select(m => new
                {
                    moduleId = m.Id.ToString(),
                    name = m.Name,
                    description = m.Description,
                    tasks = m.Tasks.Select(t => new
                    {
                        taskId = t.Id.ToString(),
                        title = t.Title,
                        description = t.Description
                    }).ToList()
                }).ToList()
            };

            return JsonSerializer.Serialize(payload, SerializerOptions);
        }
    }
}
