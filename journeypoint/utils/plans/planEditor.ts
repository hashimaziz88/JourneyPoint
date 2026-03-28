import type {
    ICreateOnboardingPlanRequest,
    IOnboardingPlanDraft,
    IOnboardingTaskDraft,
    IUpdateOnboardingPlanRequest,
} from "@/types/onboarding-plan";

export const buildCreateOnboardingPlanRequest = (
    draftPlan: IOnboardingPlanDraft,
): ICreateOnboardingPlanRequest => ({
    name: draftPlan.name.trim(),
    description: draftPlan.description.trim(),
    targetAudience: draftPlan.targetAudience.trim(),
    durationDays: draftPlan.durationDays,
    modules: draftPlan.modules.map((module) => ({
        id: module.id ?? null,
        name: module.name.trim(),
        description: module.description.trim(),
        orderIndex: module.orderIndex,
        tasks: module.tasks.map((task) => ({
            id: task.id ?? null,
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

export const buildUpdateOnboardingPlanRequest = (
    draftPlan: IOnboardingPlanDraft,
): IUpdateOnboardingPlanRequest => ({
    id: draftPlan.id ?? "",
    ...buildCreateOnboardingPlanRequest(draftPlan),
});

export const validateDraftForSave = (draftPlan: IOnboardingPlanDraft): string | null => {
    if (!draftPlan.name.trim()) {
        return "Plan name is required.";
    }

    if (!draftPlan.description.trim()) {
        return "Plan description is required.";
    }

    if (!draftPlan.targetAudience.trim()) {
        return "Target audience is required.";
    }

    if (draftPlan.durationDays < 1) {
        return "Duration must be at least one day.";
    }

    const moduleWithoutName = draftPlan.modules.find((module) => !module.name.trim());
    if (moduleWithoutName) {
        return "Each module must have a name before the plan can be saved.";
    }

    const moduleWithoutDescription = draftPlan.modules.find(
        (module) => !module.description.trim(),
    );
    if (moduleWithoutDescription) {
        return "Each module must have a description before the plan can be saved.";
    }

    const invalidTask = draftPlan.modules
        .flatMap((module) => module.tasks)
        .find((task) => !task.title.trim() || !task.description.trim());

    if (invalidTask) {
        return "Each task must have both a title and description before the plan can be saved.";
    }

    return null;
};

export const validateDraftForPublish = (
    draftPlan: IOnboardingPlanDraft,
): string | null => {
    const saveValidationError = validateDraftForSave(draftPlan);

    if (saveValidationError) {
        return saveValidationError;
    }

    if (draftPlan.modules.length === 0) {
        return "Add at least one module before publishing.";
    }

    const emptyModule = draftPlan.modules.find((module) => module.tasks.length === 0);
    if (emptyModule) {
        return "Each module must contain at least one task before publishing.";
    }

    return null;
};

export const findDraftTask = (
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

export const isBlankNewDraft = (draftPlan: IOnboardingPlanDraft | null | undefined): boolean =>
    !!draftPlan &&
    !draftPlan.id &&
    !draftPlan.name.trim() &&
    !draftPlan.description.trim() &&
    !draftPlan.targetAudience.trim() &&
    draftPlan.durationDays === 30 &&
    draftPlan.modules.length === 0;
