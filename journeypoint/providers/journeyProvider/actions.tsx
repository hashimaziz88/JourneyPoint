import { createAction } from "redux-actions";
import type {
    EnroleeJourneyDashboardDto,
    EnroleeJourneyTaskDetailDto,
    JourneyDraftDto,
    JourneyPersonalisationDecisionItem,
    JourneyPersonalisationProposalDto,
    ManagerTaskWorkspaceDto,
} from "@/types/journey/journey";
import {
    buildClearedPersonalisationState,
    buildFacilitatorMutationPendingState,
    buildFacilitatorMutationSuccessState,
    buildJourneyErrorState,
    buildJourneyPendingState,
    buildJourneySuccessState,
    buildManagerErrorState,
    buildManagerMutationPendingState,
    buildManagerMutationSuccessState,
    buildManagerPendingState,
    buildManagerSuccessState,
    buildParticipantDashboardErrorState,
    buildParticipantDashboardPendingState,
    buildParticipantDashboardSuccessState,
    buildParticipantMutationPendingState,
    buildParticipantMutationSuccessState,
    buildParticipantTaskErrorState,
    buildParticipantTaskPendingState,
    buildParticipantTaskSuccessState,
    buildPersonalisationSuccessState,
} from "@/utils/journey/state";
import type { IJourneyStateContext } from "./context";

type JourneyStatePayload = Partial<IJourneyStateContext>;

export enum JourneyActionEnums {
    getJourneyPending = "GET_JOURNEY_PENDING",
    getJourneySuccess = "GET_JOURNEY_SUCCESS",
    getJourneyError = "GET_JOURNEY_ERROR",

    getMyJourneyPending = "GET_MY_JOURNEY_PENDING",
    getMyJourneySuccess = "GET_MY_JOURNEY_SUCCESS",
    getMyJourneyError = "GET_MY_JOURNEY_ERROR",

    getManagerTasksPending = "GET_MANAGER_TASKS_PENDING",
    getManagerTasksSuccess = "GET_MANAGER_TASKS_SUCCESS",
    getManagerTasksError = "GET_MANAGER_TASKS_ERROR",

    getMyTaskPending = "GET_MY_TASK_PENDING",
    getMyTaskSuccess = "GET_MY_TASK_SUCCESS",
    getMyTaskError = "GET_MY_TASK_ERROR",

    mutationPending = "JOURNEY_MUTATION_PENDING",
    mutationSuccess = "JOURNEY_MUTATION_SUCCESS",
    mutationError = "JOURNEY_MUTATION_ERROR",

    participantMutationPending = "PARTICIPANT_MUTATION_PENDING",
    participantMutationSuccess = "PARTICIPANT_MUTATION_SUCCESS",
    participantMutationError = "PARTICIPANT_MUTATION_ERROR",

    managerMutationPending = "MANAGER_MUTATION_PENDING",
    managerMutationSuccess = "MANAGER_MUTATION_SUCCESS",
    managerMutationError = "MANAGER_MUTATION_ERROR",

    personalisationPending = "PERSONALISATION_PENDING",
    personalisationRequestSuccess = "PERSONALISATION_REQUEST_SUCCESS",
    personalisationError = "PERSONALISATION_ERROR",
    setPersonalisationDecisions = "SET_PERSONALISATION_DECISIONS",
    clearPersonalisationReview = "CLEAR_PERSONALISATION_REVIEW",

    resetJourney = "RESET_JOURNEY",
}

export const getJourneyPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.getJourneyPending,
    buildJourneyPendingState,
);

export const getJourneySuccess = createAction<JourneyStatePayload, JourneyDraftDto>(
    JourneyActionEnums.getJourneySuccess,
    buildJourneySuccessState,
);

export const getJourneyError = createAction<JourneyStatePayload>(
    JourneyActionEnums.getJourneyError,
    buildJourneyErrorState,
);

export const getMyJourneyPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.getMyJourneyPending,
    buildParticipantDashboardPendingState,
);

export const getMyJourneySuccess = createAction<
    JourneyStatePayload,
    EnroleeJourneyDashboardDto | null
>(
    JourneyActionEnums.getMyJourneySuccess,
    buildParticipantDashboardSuccessState,
);

export const getMyJourneyError = createAction<JourneyStatePayload>(
    JourneyActionEnums.getMyJourneyError,
    buildParticipantDashboardErrorState,
);

export const getManagerTasksPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.getManagerTasksPending,
    buildManagerPendingState,
);

export const getManagerTasksSuccess = createAction<
    JourneyStatePayload,
    ManagerTaskWorkspaceDto | null
>(
    JourneyActionEnums.getManagerTasksSuccess,
    buildManagerSuccessState,
);

export const getManagerTasksError = createAction<JourneyStatePayload>(
    JourneyActionEnums.getManagerTasksError,
    buildManagerErrorState,
);

export const getMyTaskPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.getMyTaskPending,
    buildParticipantTaskPendingState,
);

export const getMyTaskSuccess = createAction<
    JourneyStatePayload,
    EnroleeJourneyTaskDetailDto | null
>(
    JourneyActionEnums.getMyTaskSuccess,
    buildParticipantTaskSuccessState,
);

export const getMyTaskError = createAction<JourneyStatePayload>(
    JourneyActionEnums.getMyTaskError,
    buildParticipantTaskErrorState,
);

export const mutationPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.mutationPending,
    buildFacilitatorMutationPendingState,
);

export const mutationSuccess = createAction<JourneyStatePayload, JourneyDraftDto>(
    JourneyActionEnums.mutationSuccess,
    buildFacilitatorMutationSuccessState,
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

export const participantMutationPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.participantMutationPending,
    buildParticipantMutationPendingState,
);

export const participantMutationSuccess = createAction<
    JourneyStatePayload,
    {
        myJourney?: EnroleeJourneyDashboardDto | null;
        selectedTask?: EnroleeJourneyTaskDetailDto | null;
    }
>(
    JourneyActionEnums.participantMutationSuccess,
    buildParticipantMutationSuccessState,
);

export const participantMutationError = createAction<JourneyStatePayload>(
    JourneyActionEnums.participantMutationError,
    () => ({
        isPending: false,
        isMutationPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const managerMutationPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.managerMutationPending,
    buildManagerMutationPendingState,
);

export const managerMutationSuccess = createAction<
    JourneyStatePayload,
    ManagerTaskWorkspaceDto | null
>(
    JourneyActionEnums.managerMutationSuccess,
    buildManagerMutationSuccessState,
);

export const managerMutationError = createAction<JourneyStatePayload>(
    JourneyActionEnums.managerMutationError,
    () => ({
        isPending: false,
        isMutationPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const personalisationPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.personalisationPending,
    () => ({
        isPersonalisationPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const personalisationRequestSuccess = createAction<
    JourneyStatePayload,
    JourneyPersonalisationProposalDto
>(
    JourneyActionEnums.personalisationRequestSuccess,
    buildPersonalisationSuccessState,
);

export const personalisationError = createAction<JourneyStatePayload>(
    JourneyActionEnums.personalisationError,
    () => ({
        isPersonalisationPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const setPersonalisationDecisions = createAction<
    JourneyStatePayload,
    JourneyPersonalisationDecisionItem[]
>(
    JourneyActionEnums.setPersonalisationDecisions,
    (personalisationDecisions) => ({
        personalisationDecisions,
    }),
);

export const clearPersonalisationReview = createAction<JourneyStatePayload>(
    JourneyActionEnums.clearPersonalisationReview,
    buildClearedPersonalisationState,
);

export const resetJourney = createAction<JourneyStatePayload>(
    JourneyActionEnums.resetJourney,
    () => ({
        isPending: false,
        isDetailPending: false,
        isMutationPending: false,
        isPersonalisationPending: false,
        isError: false,
        isSuccess: false,
        journey: null,
        myJourney: null,
        managerWorkspace: null,
        selectedTask: null,
        personalisationProposal: null,
        personalisationDecisions: [],
    }),
);
