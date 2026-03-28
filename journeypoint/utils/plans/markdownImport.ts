import type { IMarkdownImportWarningDto } from "@/types/markdown-import";
import type {
    IOnboardingPlanDraft,
    IOnboardingTaskDraft,
} from "@/types/onboarding-plan";

export const buildMarkdownWarningMessage = (
    warning: IMarkdownImportWarningDto,
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
    draftPlan: IOnboardingPlanDraft | null | undefined,
    moduleClientKey: string | null,
    taskClientKey: string | null,
): IOnboardingTaskDraft | null => {
    if (!draftPlan || !moduleClientKey || !taskClientKey) {
        return null;
    }

    const parentModule = draftPlan.modules.find(
        (module) => module.clientKey === moduleClientKey,
    );

    return parentModule?.tasks.find((task) => task.clientKey === taskClientKey) ?? null;
};
