using System;
using System.Linq;
using JourneyPoint.Domains.OnboardingPlans;

namespace JourneyPoint.Application.Services.GroqService.Helpers
{
    internal static class GroqDocumentNormalizationPromptFactory
    {
        internal static string BuildImportPrompt(string sourceFileName, string contentType)
        {
            return
                "You convert onboarding source material into JSON only. " +
                $"Source file name: {sourceFileName ?? "unknown"}. " +
                $"Source content type: {contentType ?? "unknown"}. " +
                "The source may be markdown, PDF text, OCR text, tables, checklists, workbook pages, or repeated page fragments. " +
                "Return one JSON object with keys name, description, targetAudience, durationDays, modules, warnings, canSave. " +
                "Each module must have name, description, orderIndex, tasks. " +
                "Each task must have title, description, category, orderIndex, dueDayOffset, assignmentTarget, acknowledgementRule. " +
                "Allowed category values: Orientation, Learning, Practice, Assessment, CheckIn. " +
                "Allowed assignmentTarget values: Enrolee, Manager, Facilitator. " +
                "Allowed acknowledgementRule values: NotRequired, Required. " +
                "Normalize any valid onboarding source into a facilitator-reviewable plan, even when the source is not already in the target markdown format. " +
                "Ignore repeated page headers, repeated footer text, branding, page numbers, duplicated table headers, and continuation fragments caused by multi-page PDFs. " +
                "Group tasks into coherent modules even if the source uses weeks, phases, checklists, sections, or workbook headings instead of explicit modules. " +
                "If the source duplicates or skips module numbering, repair it so module orderIndex values are unique, sequential, and aligned with the real module sequence. " +
                "If one module heading obviously continues across pages, merge it instead of repeating the module. " +
                "Task orderIndex values must be unique and sequential within each module. " +
                "Convert dates, weeks, months, milestones, and relative schedule references into dueDayOffset integer days from the start of the program. " +
                "When only calendar dates are given, infer chronological offsets from the earliest task date in the source. " +
                "When only week numbers are given, convert week N to day offset (N-1)*7. " +
                "When only month numbers or month labels are given, convert them conservatively into day offsets and mention the inference in warnings. " +
                "Ensure dueDayOffset values are non-negative and do not move backwards through the ordered plan unless the source clearly indicates same-day tasks. " +
                "Set durationDays to at least the latest dueDayOffset plus one and increase it when the source clearly spans longer. " +
                "Infer missing structure conservatively, preserve task order, and add warnings when you had to infer titles, descriptions, audience, duration, module boundaries, numbering corrections, or due-day offsets. " +
                "If the document is insufficient to form a usable plan preview, still return your best attempt with warnings and canSave false. Do not wrap the JSON in markdown.";
        }

        internal static string BuildProposalPrompt(
            OnboardingPlan plan,
            string sourceFileName,
            string contentType)
        {
            var moduleSummary = string.Join(
                ", ",
                plan.Modules
                    .OrderBy(module => module.OrderIndex)
                    .Select(module => $"{module.OrderIndex}:{module.Name}"));

            return
                "You extract onboarding task proposals into JSON only. " +
                $"Plan name: {plan.Name}. " +
                $"Target audience: {plan.TargetAudience}. " +
                $"Source file name: {sourceFileName ?? "unknown"}. " +
                $"Source content type: {contentType ?? "unknown"}. " +
                $"Existing modules in order: {moduleSummary}. " +
                "Return one JSON object with keys proposals and warnings. " +
                "Each proposal must have suggestedModuleName, title, description, category, dueDayOffset, assignmentTarget, acknowledgementRule. " +
                "Allowed category values: Orientation, Learning, Practice, Assessment, CheckIn. " +
                "Allowed assignmentTarget values: Enrolee, Manager, Facilitator. " +
                "Allowed acknowledgementRule values: NotRequired, Required. " +
                "Map each proposal to the closest existing module name when possible. " +
                "Only return actionable onboarding tasks, not general prose, headings, or policy boilerplate. " +
                "If there is weak evidence for a task, omit it and mention the ambiguity in warnings. Do not wrap the JSON in markdown.";
        }
    }
}
