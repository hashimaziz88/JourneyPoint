import type { IOnboardingPlanListItemDto } from "@/types/onboarding-plan";
import type { JourneyStatus } from "@/types/journey";

export enum HireLifecycleState {
    PendingActivation = 1,
    Active = 2,
    Completed = 3,
    Exited = 4,
}

export enum WelcomeNotificationStatus {
    Pending = 0,
    Sent = 1,
    FailedRecoverable = 2,
}

export interface IHireJourneySummaryDto {
    id: string;
    status: JourneyStatus;
    taskCount: number;
    completedTaskCount: number;
    pendingTaskCount: number;
    activatedAt?: string | null;
}

export interface IHireListItemDto {
    id: string;
    onboardingPlanId: string;
    onboardingPlanName: string;
    journeyId?: string | null;
    journeyStatus?: JourneyStatus | null;
    fullName: string;
    emailAddress: string;
    roleTitle?: string | null;
    department?: string | null;
    startDate: string;
    status: HireLifecycleState;
    welcomeNotificationStatus: WelcomeNotificationStatus;
}

export interface IHireDetailDto {
    id: string;
    onboardingPlanId: string;
    onboardingPlanName: string;
    platformUserId?: number | null;
    platformUserDisplayName?: string | null;
    managerUserId?: number | null;
    managerDisplayName?: string | null;
    fullName: string;
    emailAddress: string;
    roleTitle?: string | null;
    department?: string | null;
    startDate: string;
    status: HireLifecycleState;
    welcomeNotificationStatus: WelcomeNotificationStatus;
    welcomeNotificationLastAttemptedAt?: string | null;
    welcomeNotificationSentAt?: string | null;
    welcomeNotificationFailureReason?: string | null;
    activatedAt?: string | null;
    completedAt?: string | null;
    exitedAt?: string | null;
    journey?: IHireJourneySummaryDto | null;
}

export interface ICreateHireRequest {
    onboardingPlanId: string;
    fullName: string;
    emailAddress: string;
    roleTitle?: string | null;
    department?: string | null;
    startDate: string;
    managerUserId?: number | null;
}

export interface IHireEnrolmentResultDto {
    id: string;
    onboardingPlanId: string;
    platformUserId: number;
    managerUserId?: number | null;
    fullName: string;
    emailAddress: string;
    roleTitle?: string | null;
    department?: string | null;
    startDate: string;
    status: HireLifecycleState;
    welcomeNotificationStatus: WelcomeNotificationStatus;
    welcomeNotificationLastAttemptedAt?: string | null;
    welcomeNotificationSentAt?: string | null;
    welcomeNotificationFailureReason?: string | null;
}

export interface IGetHiresInput {
    keyword?: string | null;
    status?: HireLifecycleState | null;
    skipCount: number;
    maxResultCount: number;
    sorting?: string | null;
}

export interface IHireListQueryState {
    keyword: string;
    status?: HireLifecycleState;
    current: number;
    pageSize: number;
}

export interface IHirePlanOption {
    id: string;
    name: string;
}

export interface IHireManagerOption {
    id: number;
    displayName: string;
    emailAddress: string;
}

export const mapHirePlanOptions = (
    plans: IOnboardingPlanListItemDto[] | null | undefined,
): IHirePlanOption[] =>
    (plans ?? []).map((plan) => ({
        id: plan.id,
        name: plan.name,
    }));
