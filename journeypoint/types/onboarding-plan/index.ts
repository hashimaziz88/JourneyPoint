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

export interface IOnboardingPlanListItemDto {
    id: string;
    name: string;
    targetAudience: string;
    durationDays: number;
    status: OnboardingPlanStatus;
    moduleCount: number;
    taskCount: number;
    lastUpdatedTime: string;
}

export interface IOnboardingTaskDto {
    id: string;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    orderIndex: number;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
}

export interface IOnboardingModuleDto {
    id: string;
    name: string;
    description: string;
    orderIndex: number;
    tasks: IOnboardingTaskDto[];
}

export interface IOnboardingPlanDetailDto {
    id: string;
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
    status: OnboardingPlanStatus;
    modules: IOnboardingModuleDto[];
}

export interface IUpsertOnboardingTaskDto {
    id?: string | null;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    orderIndex: number;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
}

export interface IUpsertOnboardingModuleDto {
    id?: string | null;
    name: string;
    description: string;
    orderIndex: number;
    tasks: IUpsertOnboardingTaskDto[];
}

export interface ICreateOnboardingPlanRequest {
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
    modules: IUpsertOnboardingModuleDto[];
}

export interface IUpdateOnboardingPlanRequest {
    id: string;
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
    modules: IUpsertOnboardingModuleDto[];
}

export interface ICloneOnboardingPlanRequest {
    sourcePlanId: string;
    name?: string | null;
}

export interface IGetOnboardingPlansInput {
    keyword?: string | null;
    status?: OnboardingPlanStatus | null;
    skipCount: number;
    maxResultCount: number;
    sorting?: string | null;
}

export interface IOnboardingTaskDraft {
    clientKey: string;
    id?: string | null;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    orderIndex: number;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
}

export interface IOnboardingModuleDraft {
    clientKey: string;
    id?: string | null;
    name: string;
    description: string;
    orderIndex: number;
    tasks: IOnboardingTaskDraft[];
}

export interface IOnboardingPlanDraft {
    id?: string | null;
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
    status: OnboardingPlanStatus;
    modules: IOnboardingModuleDraft[];
}

export interface IOnboardingTaskEditorValues {
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
}

export interface IOnboardingPlanMetadataInput {
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
}

export const ONBOARDING_PLAN_STATUS_LABELS: Record<OnboardingPlanStatus, string> = {
    [OnboardingPlanStatus.Draft]: "Draft",
    [OnboardingPlanStatus.Published]: "Published",
    [OnboardingPlanStatus.Archived]: "Archived",
};

export const ONBOARDING_TASK_CATEGORY_OPTIONS = [
    { label: "Orientation", value: OnboardingTaskCategory.Orientation },
    { label: "Learning", value: OnboardingTaskCategory.Learning },
    { label: "Practice", value: OnboardingTaskCategory.Practice },
    { label: "Assessment", value: OnboardingTaskCategory.Assessment },
    { label: "Check-in", value: OnboardingTaskCategory.CheckIn },
];

export const ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS = [
    { label: "Enrolee", value: OnboardingTaskAssignmentTarget.Enrolee },
    { label: "Manager", value: OnboardingTaskAssignmentTarget.Manager },
    { label: "Facilitator", value: OnboardingTaskAssignmentTarget.Facilitator },
];

export const ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS = [
    { label: "Not required", value: OnboardingTaskAcknowledgementRule.NotRequired },
    { label: "Required", value: OnboardingTaskAcknowledgementRule.Required },
];

export const DEFAULT_ONBOARDING_TASK_EDITOR_VALUES: IOnboardingTaskEditorValues = {
    title: "",
    description: "",
    category: OnboardingTaskCategory.Orientation,
    dueDayOffset: 0,
    assignmentTarget: OnboardingTaskAssignmentTarget.Enrolee,
    acknowledgementRule: OnboardingTaskAcknowledgementRule.NotRequired,
};
