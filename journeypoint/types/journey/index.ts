import type { HireLifecycleState } from "@/types/hire";
import type {
    OnboardingTaskAcknowledgementRule,
    OnboardingTaskAssignmentTarget,
    OnboardingTaskCategory,
} from "@/types/onboarding-plan";

export enum JourneyStatus {
    Draft = 1,
    Active = 2,
    Paused = 3,
    Completed = 4,
}

export enum JourneyTaskStatus {
    Pending = 1,
    Completed = 2,
}

export interface IJourneyTaskReviewDto {
    id: string;
    sourceOnboardingTaskId?: string | null;
    sourceOnboardingModuleId?: string | null;
    moduleTitle: string;
    moduleOrderIndex: number;
    taskOrderIndex: number;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
    dueDayOffset: number;
    dueOn: string;
    status: JourneyTaskStatus;
    acknowledgedAt?: string | null;
    completedAt?: string | null;
    completedByUserId?: number | null;
}

export interface IJourneyDraftDto {
    journeyId: string;
    hireId: string;
    onboardingPlanId: string;
    hireStartDate: string;
    hireStatus: HireLifecycleState;
    status: JourneyStatus;
    activatedAt?: string | null;
    pausedAt?: string | null;
    completedAt?: string | null;
    tasks: IJourneyTaskReviewDto[];
}

export interface IGenerateDraftJourneyRequest {
    hireId: string;
}

export interface IUpdateJourneyTaskRequest {
    moduleTitle: string;
    moduleOrderIndex: number;
    taskOrderIndex: number;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
    dueDayOffset: number;
}

export type IAddJourneyTaskRequest = IUpdateJourneyTaskRequest;

export interface IJourneyModuleGroup {
    moduleKey: string;
    moduleTitle: string;
    moduleOrderIndex: number;
    tasks: IJourneyTaskReviewDto[];
}
