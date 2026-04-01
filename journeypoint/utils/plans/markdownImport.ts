import type { MarkdownImportWarningDto } from "@/types/markdown-import/markdown-import";
import type {
    OnboardingPlanDraft,
    OnboardingTaskDraft,
} from "@/types/onboarding-plan/onboarding-plan";

export const buildMarkdownWarningMessage = (
    warning: MarkdownImportWarningDto,
): string => {
    const locationParts = [
        warning.sectionName ? `Section: ${warning.sectionName}` : null,
        warning.lineNumber ? `Line: ${warning.lineNumber}` : null,
    ].filter(Boolean);

    return locationParts.length > 0
        ? `${warning.message} (${locationParts.join(" | ")})`
        : warning.message;
};

export const findImportDraftTask = (
    draftPlan: OnboardingPlanDraft | null | undefined,
    moduleClientKey: string | null,
    taskClientKey: string | null,
): OnboardingTaskDraft | null => {
    if (!draftPlan || !moduleClientKey || !taskClientKey) {
        return null;
    }

    const parentModule = draftPlan.modules.find(
        (module) => module.clientKey === moduleClientKey,
    );

    return parentModule?.tasks.find((task) => task.clientKey === taskClientKey) ?? null;
};
