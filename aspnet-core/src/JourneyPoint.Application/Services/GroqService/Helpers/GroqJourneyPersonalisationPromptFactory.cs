using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using JourneyPoint.Domains.Hires;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.GroqService.Helpers
{
    internal static class GroqJourneyPersonalisationPromptFactory
    {
        private static readonly JsonSerializerOptions SerializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        internal static string BuildSystemPrompt()
        {
            return
                "You personalise onboarding journey tasks into JSON only. " +
                "Return one JSON object with keys summary and revisions. " +
                "summary must be a short facilitator-facing explanation of the proposed improvements. " +
                "revisions must be an array of objects keyed to existing journeyTaskId values only. " +
                "Each revision must include journeyTaskId, title, description, category, assignmentTarget, acknowledgementRule, dueDayOffset, and rationale. " +
                "You may revise only existing pending tasks. Do not add tasks, remove tasks, reorder tasks, change modules, or reference unknown task ids. " +
                "Allowed category values: Orientation, Learning, Practice, Assessment, CheckIn. " +
                "Allowed assignmentTarget values: Enrolee, Manager, Facilitator. " +
                "Allowed acknowledgementRule values: NotRequired, Required. " +
                "Keep dueDayOffset non-negative. " +
                "If no useful revisions are needed, return an empty revisions array and explain that in summary. " +
                "Do not wrap the JSON in markdown.";
        }

        internal static string BuildUserContent(
            Hire hire,
            Journey journey,
            OnboardingPlan onboardingPlan,
            IReadOnlyCollection<JourneyTask> eligibleTasks,
            string facilitatorInstructions)
        {
            var payload = new
            {
                hire = new
                {
                    hireId = hire.Id,
                    fullName = hire.FullName,
                    roleTitle = hire.RoleTitle,
                    department = hire.Department,
                    startDate = hire.StartDate.ToString("yyyy-MM-dd")
                },
                journey = new
                {
                    journeyId = journey.Id,
                    status = journey.Status.ToString(),
                    planName = onboardingPlan.Name,
                    targetAudience = onboardingPlan.TargetAudience,
                    planDescription = Truncate(onboardingPlan.Description, 500),
                    durationDays = onboardingPlan.DurationDays
                },
                facilitatorInstructions = string.IsNullOrWhiteSpace(facilitatorInstructions)
                    ? null
                    : Truncate(facilitatorInstructions, 1000),
                tasks = eligibleTasks
                    .OrderBy(task => task.ModuleOrderIndex)
                    .ThenBy(task => task.TaskOrderIndex)
                    .Select(task => new
                    {
                        journeyTaskId = task.Id,
                        moduleTitle = task.ModuleTitle,
                        moduleOrderIndex = task.ModuleOrderIndex,
                        taskOrderIndex = task.TaskOrderIndex,
                        title = task.Title,
                        description = Truncate(task.Description, 1200),
                        category = task.Category.ToString(),
                        assignmentTarget = task.AssignmentTarget.ToString(),
                        acknowledgementRule = task.AcknowledgementRule.ToString(),
                        dueDayOffset = task.DueDayOffset,
                        dueOn = task.DueOn.ToString("yyyy-MM-dd")
                    })
                    .ToList()
            };

            return JsonSerializer.Serialize(payload, SerializerOptions);
        }

        internal static string BuildAuditPromptSummary(
            Hire hire,
            Journey journey,
            OnboardingPlan onboardingPlan,
            int eligibleTaskCount,
            string facilitatorInstructions)
        {
            var instructionsSummary = string.IsNullOrWhiteSpace(facilitatorInstructions)
                ? "No facilitator instructions supplied."
                : $"Facilitator instructions: {Truncate(facilitatorInstructions.Trim(), 300)}";

            return
                $"Request personalisation for hire '{hire.FullName}' on journey {journey.Id} " +
                $"from plan '{onboardingPlan.Name}' across {eligibleTaskCount} pending tasks. " +
                instructionsSummary;
        }

        private static string Truncate(string value, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            var trimmedValue = value.Trim();
            return trimmedValue.Length <= maxLength
                ? trimmedValue
                : trimmedValue[..maxLength];
        }
    }
}
