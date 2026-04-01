import type {
    MarkdownImportDraftState,
    MarkdownImportPreviewDto,
    MarkdownImportPreviewModuleDto,
    SaveMarkdownImportRequest,
} from "@/types/markdown-import/markdown-import";
import type {
    OnboardingModuleDraft,
    OnboardingPlanDraft,
    OnboardingTaskEditorValues,
} from "@/types/onboarding-plan/onboarding-plan";
import { OnboardingPlanStatus } from "@/types/onboarding-plan/onboarding-plan";

const createClientKey = (): string =>
    typeof globalThis.crypto?.randomUUID === "function"
        ? globalThis.crypto.randomUUID()
        : `markdown-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const mapMarkdownPreviewModuleToDraft = (
    module: MarkdownImportPreviewModuleDto,
): OnboardingModuleDraft => ({
    clientKey: createClientKey(),
    name: module.name,
    description: module.description,
    orderIndex: module.orderIndex,
    tasks: module.tasks.map((task) => ({
        clientKey: createClientKey(),
        title: task.title,
        description: task.description,
        category: task.category,
        orderIndex: task.orderIndex,
        dueDayOffset: task.dueDayOffset,
        assignmentTarget: task.assignmentTarget,
        acknowledgementRule: task.acknowledgementRule,
    })),
});

const canSavePreviewDraft = (draftPlan: OnboardingPlanDraft): boolean =>
    !!draftPlan.name.trim() &&
    !!draftPlan.description.trim() &&
    !!draftPlan.targetAudience.trim() &&
    draftPlan.durationDays >= 1 &&
    draftPlan.modules.length > 0 &&
    draftPlan.modules.every((module) => !!module.name.trim()) &&
    draftPlan.modules.every((module) => !!module.description.trim()) &&
    draftPlan.modules.every((module) =>
        module.tasks.every(
            (task) => !!task.title.trim() && !!task.description.trim(),
        ),
    );

export const mapMarkdownPreviewToDraftState = (
    preview: MarkdownImportPreviewDto,
): MarkdownImportDraftState => ({
    plan: {
        name: preview.name,
        description: preview.description,
        targetAudience: preview.targetAudience,
        durationDays: preview.durationDays,
        status: OnboardingPlanStatus.Draft,
        modules: preview.modules.map(mapMarkdownPreviewModuleToDraft),
    },
    warnings: preview.warnings,
    canSave: preview.canSave,
});

export const mapMarkdownDraftToSaveRequest = (
    draftPlan: OnboardingPlanDraft,
): SaveMarkdownImportRequest => ({
    name: draftPlan.name.trim(),
    description: draftPlan.description.trim(),
    targetAudience: draftPlan.targetAudience.trim(),
    durationDays: draftPlan.durationDays,
    modules: draftPlan.modules.map((module) => ({
        name: module.name.trim(),
        description: module.description.trim(),
        orderIndex: module.orderIndex,
        tasks: module.tasks.map((task) => ({
            title: task.title.trim(),
            description: task.description.trim(),
            category: task.category,
            orderIndex: task.orderIndex,
            dueDayOffset: task.dueDayOffset,
            assignmentTarget: task.assignmentTarget,
            acknowledgementRule: task.acknowledgementRule,
        })),
    })),
});

export const updateMarkdownPreviewDraft = (
    previewState: MarkdownImportDraftState | null | undefined,
    updater: (draftPlan: OnboardingPlanDraft) => OnboardingPlanDraft,
): MarkdownImportDraftState | null => {
    if (!previewState?.plan) {
        return null;
    }

    const updatedPlan = updater(previewState.plan);

    return {
        ...previewState,
        plan: updatedPlan,
        canSave: canSavePreviewDraft(updatedPlan),
    };
};

export const applyMarkdownPreviewMetadata = (
    draftPlan: OnboardingPlanDraft,
    payload: {
        name?: string;
        description?: string;
        targetAudience?: string;
        durationDays?: number;
    },
): OnboardingPlanDraft => ({
    ...draftPlan,
    ...payload,
});

export const updateMarkdownPreviewModule = (
    draftPlan: OnboardingPlanDraft,
    moduleClientKey: string,
    name: string,
    description: string,
): OnboardingPlanDraft => ({
    ...draftPlan,
    modules: draftPlan.modules.map((module) =>
        module.clientKey === moduleClientKey
            ? { ...module, name, description }
            : module,
    ),
});

export const removeMarkdownPreviewModule = (
    draftPlan: OnboardingPlanDraft,
    moduleClientKey: string,
): OnboardingPlanDraft => ({
    ...draftPlan,
    modules: draftPlan.modules
        .filter((module) => module.clientKey !== moduleClientKey)
        .map((module, index) => ({
            ...module,
            orderIndex: index + 1,
            tasks: module.tasks.map((task, taskIndex) => ({
                ...task,
                orderIndex: taskIndex + 1,
            })),
        })),
});

export const updateMarkdownPreviewTask = (
    draftPlan: OnboardingPlanDraft,
    moduleClientKey: string,
    taskClientKey: string,
    payload: OnboardingTaskEditorValues,
): OnboardingPlanDraft => ({
    ...draftPlan,
    modules: draftPlan.modules.map((module) =>
        module.clientKey === moduleClientKey
            ? {
                ...module,
                tasks: module.tasks.map((task) =>
                    task.clientKey === taskClientKey
                        ? { ...task, ...payload }
                        : task,
                ),
            }
            : module,
    ),
});

export const removeMarkdownPreviewTask = (
    draftPlan: OnboardingPlanDraft,
    moduleClientKey: string,
    taskClientKey: string,
): OnboardingPlanDraft => ({
    ...draftPlan,
    modules: draftPlan.modules.map((module) =>
        module.clientKey === moduleClientKey
            ? {
                ...module,
                tasks: module.tasks
                    .filter((task) => task.clientKey !== taskClientKey)
                    .map((task, index) => ({
                        ...task,
                        orderIndex: index + 1,
                    })),
            }
            : module,
    ),
});
