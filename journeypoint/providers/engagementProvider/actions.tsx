import { createAction } from "redux-actions";
import type { IEngagementStateContext, HireIntelligenceDetailDto } from "./context";

type EngagementStatePayload = Partial<IEngagementStateContext>;

export enum EngagementActionEnums {
    getHireIntelligencePending = "GET_HIRE_INTELLIGENCE_PENDING",
    getHireIntelligenceSuccess = "GET_HIRE_INTELLIGENCE_SUCCESS",
    getHireIntelligenceError = "GET_HIRE_INTELLIGENCE_ERROR",
    mutationPending = "ENGAGEMENT_MUTATION_PENDING",
    mutationSuccess = "ENGAGEMENT_MUTATION_SUCCESS",
    mutationError = "ENGAGEMENT_MUTATION_ERROR",
    resetHireIntelligence = "RESET_HIRE_INTELLIGENCE",
}

export const getHireIntelligencePending = createAction<EngagementStatePayload>(
    EngagementActionEnums.getHireIntelligencePending,
    () => ({
        isPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const getHireIntelligenceSuccess = createAction<
    EngagementStatePayload,
    HireIntelligenceDetailDto
>(EngagementActionEnums.getHireIntelligenceSuccess, (selectedHireIntelligence) => ({
    isPending: false,
    isError: false,
    isSuccess: true,
    selectedHireIntelligence,
}));

export const getHireIntelligenceError = createAction<EngagementStatePayload>(
    EngagementActionEnums.getHireIntelligenceError,
    () => ({
        isPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const mutationPending = createAction<EngagementStatePayload>(
    EngagementActionEnums.mutationPending,
    () => ({
        isPending: true,
        isMutationPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const mutationSuccess = createAction<
    EngagementStatePayload,
    HireIntelligenceDetailDto
>(EngagementActionEnums.mutationSuccess, (selectedHireIntelligence) => ({
    isPending: false,
    isMutationPending: false,
    isError: false,
    isSuccess: true,
    selectedHireIntelligence,
}));

export const mutationError = createAction<EngagementStatePayload>(
    EngagementActionEnums.mutationError,
    () => ({
        isPending: false,
        isMutationPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const resetHireIntelligence = createAction<EngagementStatePayload>(
    EngagementActionEnums.resetHireIntelligence,
    () => ({
        isPending: false,
        isMutationPending: false,
        isError: false,
        isSuccess: false,
        selectedHireIntelligence: null,
    }),
);
