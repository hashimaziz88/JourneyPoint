import type { OnboardingPlanListItemDto } from "@/types/onboarding-plan/onboarding-plan";
import type { JourneyStatus } from "@/types/journey/journey";

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

export type HireJourneySummaryDto = {
    id: string;
    status: JourneyStatus;
    taskCount: number;
    completedTaskCount: number;
    pendingTaskCount: number;
    activatedAt?: string | null;
};

export type HireListItemDto = {
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
};

export type HireDetailDto = {
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
    journey?: HireJourneySummaryDto | null;
};

export type CreateHireRequest = {
    onboardingPlanId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    roleTitle?: string | null;
    department?: string | null;
    startDate: string;
    managerUserId?: number | null;
};

export type HireEnrolmentResultDto = {
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
};

export type GetHiresInput = {
    keyword?: string | null;
    status?: HireLifecycleState | null;
    skipCount: number;
    maxResultCount: number;
    sorting?: string | null;
};

export type HireListQueryState = {
    keyword: string;
    status?: HireLifecycleState;
    current: number;
    pageSize: number;
};

export type HirePlanOption = {
    id: string;
    name: string;
};

export type HireManagerOption = {
    id: number;
    displayName: string;
    emailAddress: string;
};

export const mapHirePlanOptions = (
    plans: OnboardingPlanListItemDto[] | null | undefined,
): HirePlanOption[] =>
    (plans ?? []).map((plan) => ({
        id: plan.id,
        name: plan.name,
    }));
