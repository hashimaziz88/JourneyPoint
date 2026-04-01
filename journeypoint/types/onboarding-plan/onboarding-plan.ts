export enum OnboardingPlanStatus {
    Draft = 1,
    Published = 2,
    Archived = 3,
}

export enum OnboardingTaskCategory {
    Orientation = 1,
    Learning = 2,
    Practice = 3,
    Assessment = 4,
    CheckIn = 5,
}

export enum OnboardingTaskAssignmentTarget {
    Enrolee = 1,
    Manager = 2,
    Facilitator = 3,
}

export enum OnboardingTaskAcknowledgementRule {
    NotRequired = 1,
    Required = 2,
}

export type OnboardingPlanListItemDto = {
    id: string;
    name: string;
    targetAudience: string;
    durationDays: number;
    status: OnboardingPlanStatus;
    moduleCount: number;
    taskCount: number;
    lastUpdatedTime: string;
};

export type OnboardingTaskDto = {
    id: string;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    orderIndex: number;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
};

export type OnboardingModuleDto = {
    id: string;
    name: string;
    description: string;
    orderIndex: number;
    tasks: OnboardingTaskDto[];
};

export type OnboardingPlanDetailDto = {
    id: string;
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
    status: OnboardingPlanStatus;
    modules: OnboardingModuleDto[];
};

export type UpsertOnboardingTaskDto = {
    id?: string | null;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    orderIndex: number;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
};

export type UpsertOnboardingModuleDto = {
    id?: string | null;
    name: string;
    description: string;
    orderIndex: number;
    tasks: UpsertOnboardingTaskDto[];
};

export type CreateOnboardingPlanRequest = {
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
    modules: UpsertOnboardingModuleDto[];
};

export type UpdateOnboardingPlanRequest = {
    id: string;
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
    modules: UpsertOnboardingModuleDto[];
};

export type CloneOnboardingPlanRequest = {
    sourcePlanId: string;
    name?: string | null;
};

export type GetOnboardingPlansInput = {
    keyword?: string | null;
    status?: OnboardingPlanStatus | null;
    skipCount: number;
    maxResultCount: number;
    sorting?: string | null;
};

export type OnboardingTaskDraft = {
    clientKey: string;
    id?: string | null;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    orderIndex: number;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
};

export type OnboardingModuleDraft = {
    clientKey: string;
    id?: string | null;
    name: string;
    description: string;
    orderIndex: number;
    tasks: OnboardingTaskDraft[];
};

export type OnboardingPlanDraft = {
    id?: string | null;
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
    status: OnboardingPlanStatus;
    modules: OnboardingModuleDraft[];
};

export type OnboardingTaskEditorValues = {
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
};

export type OnboardingPlanMetadataInput = {
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
};
