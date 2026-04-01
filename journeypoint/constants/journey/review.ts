import {
    JourneyStatus,
    type AddJourneyTaskRequest,
} from "@/types/journey/journey";
import {
    OnboardingTaskAcknowledgementRule,
    OnboardingTaskAssignmentTarget,
    OnboardingTaskCategory,
} from "@/types/onboarding-plan/onboarding-plan";

export const JOURNEY_STATUS_LABELS: Record<JourneyStatus, string> = {
    [JourneyStatus.Draft]: "Draft",
    [JourneyStatus.Active]: "Active",
    [JourneyStatus.Paused]: "Paused",
    [JourneyStatus.Completed]: "Completed",
};

export const JOURNEY_STATUS_TAG_COLORS: Record<JourneyStatus, string> = {
    [JourneyStatus.Draft]: "gold",
    [JourneyStatus.Active]: "green",
    [JourneyStatus.Paused]: "orange",
    [JourneyStatus.Completed]: "blue",
};

export const DEFAULT_ADD_JOURNEY_TASK_REQUEST: AddJourneyTaskRequest = {
    moduleTitle: "",
    moduleOrderIndex: 1,
    taskOrderIndex: 1,
    title: "",
    description: "",
    category: OnboardingTaskCategory.Orientation,
    assignmentTarget: OnboardingTaskAssignmentTarget.Enrolee,
    acknowledgementRule: OnboardingTaskAcknowledgementRule.NotRequired,
    dueDayOffset: 0,
};
