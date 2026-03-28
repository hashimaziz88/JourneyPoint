import { createAction } from "redux-actions";
import type { IJourneyDraftDto, IJourneyStateContext } from "./context";

type JourneyStatePayload = Partial<IJourneyStateContext>;

export enum JourneyActionEnums {
    getJourneyPending = "GET_JOURNEY_PENDING",
    getJourneySuccess = "GET_JOURNEY_SUCCESS",
    getJourneyError = "GET_JOURNEY_ERROR",

    mutationPending = "JOURNEY_MUTATION_PENDING",
    mutationSuccess = "JOURNEY_MUTATION_SUCCESS",
    mutationError = "JOURNEY_MUTATION_ERROR",

    resetJourney = "RESET_JOURNEY",
}

export const getJourneyPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.getJourneyPending,
    () => ({
        isPending: true,
        isDetailPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const getJourneySuccess = createAction<JourneyStatePayload, IJourneyDraftDto>(
    JourneyActionEnums.getJourneySuccess,
    (journey) => ({
        isPending: false,
        isDetailPending: false,
        isError: false,
        isSuccess: true,
        journey,
    }),
);

export const getJourneyError = createAction<JourneyStatePayload>(
    JourneyActionEnums.getJourneyError,
    () => ({
        isPending: false,
        isDetailPending: false,
        isError: true,
        isSuccess: false,
        journey: null,
    }),
);

export const mutationPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.mutationPending,
    () => ({
        isPending: true,
        isMutationPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const mutationSuccess = createAction<JourneyStatePayload, IJourneyDraftDto>(
    JourneyActionEnums.mutationSuccess,
    (journey) => ({
        isPending: false,
        isMutationPending: false,
        isError: false,
        isSuccess: true,
        journey,
    }),
);

export const mutationError = createAction<JourneyStatePayload>(
    JourneyActionEnums.mutationError,
    () => ({
        isPending: false,
        isMutationPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const resetJourney = createAction<JourneyStatePayload>(
    JourneyActionEnums.resetJourney,
    () => ({
        isPending: false,
        isDetailPending: false,
        isMutationPending: false,
        isError: false,
        isSuccess: false,
        journey: null,
    }),
);
