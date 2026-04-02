import { createAction } from "redux-actions";
import type { IWellnessStateContext } from "./context";

type WellnessStatePayload = Partial<IWellnessStateContext>;

export enum WellnessActionEnums {
    getOverviewPending = "GET_WELLNESS_OVERVIEW_PENDING",
    getOverviewSuccess = "GET_WELLNESS_OVERVIEW_SUCCESS",
    getOverviewError = "GET_WELLNESS_OVERVIEW_ERROR",

    getDetailPending = "GET_WELLNESS_DETAIL_PENDING",
    getDetailSuccess = "GET_WELLNESS_DETAIL_SUCCESS",
    getDetailError = "GET_WELLNESS_DETAIL_ERROR",

    mutationPending = "WELLNESS_MUTATION_PENDING",
    mutationSuccessQuestion = "WELLNESS_MUTATION_SUCCESS_QUESTION",
    mutationSuccessCheckIn = "WELLNESS_MUTATION_SUCCESS_CHECKIN",
    mutationError = "WELLNESS_MUTATION_ERROR",
}

export const getOverviewPending = createAction<WellnessStatePayload>(
    WellnessActionEnums.getOverviewPending,
    () => ({
        isOverviewPending: true,
    }),
);

export const getOverviewSuccess = createAction<WellnessStatePayload, { overview: IWellnessStateContext["overview"] }>(
    WellnessActionEnums.getOverviewSuccess,
    ({ overview }) => ({
        isOverviewPending: false,
        overview,
    }),
);

export const getOverviewError = createAction<WellnessStatePayload>(
    WellnessActionEnums.getOverviewError,
    () => ({
        isOverviewPending: false,
    }),
);

export const getDetailPending = createAction<WellnessStatePayload>(
    WellnessActionEnums.getDetailPending,
    () => ({
        isDetailPending: true,
    }),
);

export const getDetailSuccess = createAction<WellnessStatePayload, { checkInDetail: IWellnessStateContext["checkInDetail"] }>(
    WellnessActionEnums.getDetailSuccess,
    ({ checkInDetail }) => ({
        isDetailPending: false,
        checkInDetail,
    }),
);

export const getDetailError = createAction<WellnessStatePayload>(
    WellnessActionEnums.getDetailError,
    () => ({
        isDetailPending: false,
    }),
);

export const mutationPending = createAction<WellnessStatePayload>(
    WellnessActionEnums.mutationPending,
    () => ({
        isMutationPending: true,
    }),
);

export const mutationSuccessQuestion = createAction<WellnessStatePayload, { checkInDetail: IWellnessStateContext["checkInDetail"] }>(
    WellnessActionEnums.mutationSuccessQuestion,
    ({ checkInDetail }) => ({
        isMutationPending: false,
        checkInDetail,
    }),
);

export const mutationSuccessCheckIn = createAction<WellnessStatePayload, { checkInDetail: IWellnessStateContext["checkInDetail"] }>(
    WellnessActionEnums.mutationSuccessCheckIn,
    ({ checkInDetail }) => ({
        isMutationPending: false,
        checkInDetail,
    }),
);

export const mutationError = createAction<WellnessStatePayload>(
    WellnessActionEnums.mutationError,
    () => ({
        isMutationPending: false,
    }),
);
