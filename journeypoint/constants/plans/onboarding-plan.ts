import {
    OnboardingPlanStatus,
    OnboardingTaskAcknowledgementRule,
    OnboardingTaskAssignmentTarget,
    OnboardingTaskCategory,
    type OnboardingTaskEditorValues,
} from "@/types/onboarding-plan/onboarding-plan";

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
    { label: "HR Facilitator", value: OnboardingTaskAssignmentTarget.Facilitator },
];

export const ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS = [
    { label: "Not required", value: OnboardingTaskAcknowledgementRule.NotRequired },
    { label: "Required", value: OnboardingTaskAcknowledgementRule.Required },
];

export const DEFAULT_ONBOARDING_TASK_EDITOR_VALUES: OnboardingTaskEditorValues = {
    title: "",
    description: "",
    category: OnboardingTaskCategory.Orientation,
    dueDayOffset: 0,
    assignmentTarget: OnboardingTaskAssignmentTarget.Enrolee,
    acknowledgementRule: OnboardingTaskAcknowledgementRule.NotRequired,
};
