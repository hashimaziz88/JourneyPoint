import { createAction } from "redux-actions";
import type {
    OnboardingPlanDetailDto,
    OnboardingPlanDraft,
    OnboardingPlanListItemDto,
} from "./context";
import { IOnboardingPlanStateContext } from "./context";

type OnboardingPlanStatePayload = Partial<IOnboardingPlanStateContext>;

export enum OnboardingPlanActionEnums {
    getPlansPending = "GET_ONBOARDING_PLANS_PENDING",
    getPlansSuccess = "GET_ONBOARDING_PLANS_SUCCESS",
    getPlansError = "GET_ONBOARDING_PLANS_ERROR",

    getPlanDetailPending = "GET_ONBOARDING_PLAN_DETAIL_PENDING",
    getPlanDetailSuccess = "GET_ONBOARDING_PLAN_DETAIL_SUCCESS",
    getPlanDetailError = "GET_ONBOARDING_PLAN_DETAIL_ERROR",

    mutationPending = "ONBOARDING_PLAN_MUTATION_PENDING",
    mutationSuccess = "ONBOARDING_PLAN_MUTATION_SUCCESS",
    mutationError = "ONBOARDING_PLAN_MUTATION_ERROR",

    setDraft = "SET_ONBOARDING_PLAN_DRAFT",
    resetDraft = "RESET_ONBOARDING_PLAN_DRAFT",
}

export const getPlansPending = createAction<OnboardingPlanStatePayload>(
    OnboardingPlanActionEnums.getPlansPending,
    () => ({
        isPending: true,
        isListPending: true,
        isDetailPending: false,
        isMutationPending: false,
        isError: false,
        isSuccess: false,
    }),
);

export const getPlansSuccess = createAction<OnboardingPlanStatePayload, { plans: OnboardingPlanListItemDto[]; totalCount: number }>(
    OnboardingPlanActionEnums.getPlansSuccess,
    ({ plans, totalCount }) => ({
        isPending: false,
        isListPending: false,
        isError: false,
        isSuccess: true,
        plans,
        totalCount,
    }),
);

export const getPlansError = createAction<OnboardingPlanStatePayload>(
    OnboardingPlanActionEnums.getPlansError,
    () => ({
        isPending: false,
        isListPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const getPlanDetailPending = createAction<OnboardingPlanStatePayload>(
    OnboardingPlanActionEnums.getPlanDetailPending,
    () => ({
        isPending: true,
        isListPending: false,
        isDetailPending: true,
        isMutationPending: false,
        isError: false,
        isSuccess: false,
    }),
);

export const getPlanDetailSuccess = createAction<OnboardingPlanStatePayload, { selectedPlan: OnboardingPlanDetailDto; draftPlan: OnboardingPlanDraft }>(
    OnboardingPlanActionEnums.getPlanDetailSuccess,
    ({ selectedPlan, draftPlan }) => ({
        isPending: false,
        isDetailPending: false,
        isError: false,
        isSuccess: true,
        selectedPlan,
        draftPlan,
    }),
);

export const getPlanDetailError = createAction<OnboardingPlanStatePayload>(
    OnboardingPlanActionEnums.getPlanDetailError,
    () => ({
        isPending: false,
        isDetailPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const mutationPending = createAction<OnboardingPlanStatePayload>(
    OnboardingPlanActionEnums.mutationPending,
    () => ({
        isPending: true,
        isMutationPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const mutationSuccess = createAction<OnboardingPlanStatePayload, { selectedPlan: OnboardingPlanDetailDto; draftPlan: OnboardingPlanDraft }>(
    OnboardingPlanActionEnums.mutationSuccess,
    ({ selectedPlan, draftPlan }) => ({
        isPending: false,
        isMutationPending: false,
        isError: false,
        isSuccess: true,
        selectedPlan,
        draftPlan,
    }),
);

export const mutationError = createAction<OnboardingPlanStatePayload>(
    OnboardingPlanActionEnums.mutationError,
    () => ({
        isPending: false,
        isMutationPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const setDraft = createAction<OnboardingPlanStatePayload, OnboardingPlanDraft>(
    OnboardingPlanActionEnums.setDraft,
    (draftPlan) => ({ draftPlan }),
);

export const resetDraft = createAction<OnboardingPlanStatePayload>(
    OnboardingPlanActionEnums.resetDraft,
    () => ({
        isPending: false,
        isDetailPending: false,
        isMutationPending: false,
        isError: false,
        isSuccess: false,
        selectedPlan: null,
        draftPlan: null,
    }),
);
