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

export interface IEnroleeJourneyTaskListItemDto {
    journeyTaskId: string;
    title: string;
    descriptionPreview: string;
    dueOn: string;
    status: JourneyTaskStatus;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
    acknowledgedAt?: string | null;
    isOverdue: boolean;
    isPersonalised: boolean;
}

export interface IEnroleeJourneyModuleGroupDto {
    moduleKey: string;
    moduleTitle: string;
    moduleOrderIndex: number;
    totalTaskCount: number;
    completedTaskCount: number;
    pendingTaskCount: number;
    tasks: IEnroleeJourneyTaskListItemDto[];
}

export interface IEnroleeJourneyDashboardDto {
    journeyId: string;
    hireId: string;
    status: JourneyStatus;
    activatedAt?: string | null;
    totalTaskCount: number;
    completedTaskCount: number;
    overdueTaskCount: number;
    modules: IEnroleeJourneyModuleGroupDto[];
}

export interface IEnroleeJourneyTaskDetailDto {
    journeyTaskId: string;
    journeyId: string;
    moduleTitle: string;
    moduleOrderIndex: number;
    taskOrderIndex: number;
    title: string;
    description: string;
    dueOn: string;
    status: JourneyTaskStatus;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
    acknowledgedAt?: string | null;
    completedAt?: string | null;
    isOverdue: boolean;
    isPersonalised: boolean;
    personalisedAt?: string | null;
    canAcknowledge: boolean;
    canComplete: boolean;
}

export interface IAcknowledgeJourneyTaskRequest {
    journeyTaskId: string;
}

export interface ICompleteJourneyTaskRequest {
    journeyTaskId: string;
}

export interface IManagerAssignedTaskDto {
    journeyTaskId: string;
    journeyId: string;
    hireId: string;
    hireFullName: string;
    roleTitle?: string | null;
    department?: string | null;
    moduleTitle: string;
    moduleOrderIndex: number;
    taskOrderIndex: number;
    title: string;
    description: string;
    dueOn: string;
    status: JourneyTaskStatus;
    completedAt?: string | null;
    isOverdue: boolean;
    isPersonalised: boolean;
    personalisedAt?: string | null;
    canComplete: boolean;
}

export interface IManagerDirectReportTaskGroupDto {
    hireId: string;
    journeyId: string;
    hireFullName: string;
    roleTitle?: string | null;
    department?: string | null;
    pendingTaskCount: number;
    completedTaskCount: number;
    tasks: IManagerAssignedTaskDto[];
}

export interface IManagerTaskWorkspaceDto {
    directReportCount: number;
    totalTaskCount: number;
    pendingTaskCount: number;
    completedTaskCount: number;
    overdueTaskCount: number;
    directReports: IManagerDirectReportTaskGroupDto[];
}
