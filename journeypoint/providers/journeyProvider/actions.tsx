import { createAction } from "redux-actions";
import { buildInitialPersonalisationDecisions } from "@/utils/journey/personalisation";
import type {
    IEnroleeJourneyDashboardDto,
    IEnroleeJourneyTaskDetailDto,
    IJourneyDraftDto,
    IJourneyPersonalisationDecisionItem,
    IJourneyPersonalisationProposalDto,
    IManagerTaskWorkspaceDto,
} from "@/types/journey";
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

export const getMyJourneyPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.getMyJourneyPending,
    () => ({
        isPending: true,
        isDetailPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const getMyJourneySuccess = createAction<
    JourneyStatePayload,
    IEnroleeJourneyDashboardDto | null
>(
    JourneyActionEnums.getMyJourneySuccess,
    (myJourney) => ({
        isPending: false,
        isDetailPending: false,
        isError: false,
        isSuccess: true,
        myJourney,
    }),
);

export const getMyJourneyError = createAction<JourneyStatePayload>(
    JourneyActionEnums.getMyJourneyError,
    () => ({
        isPending: false,
        isDetailPending: false,
        isError: true,
        isSuccess: false,
        myJourney: null,
    }),
);

export const getManagerTasksPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.getManagerTasksPending,
    () => ({
        isPending: true,
        isDetailPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const getManagerTasksSuccess = createAction<
    JourneyStatePayload,
    IManagerTaskWorkspaceDto | null
>(
    JourneyActionEnums.getManagerTasksSuccess,
    (managerWorkspace) => ({
        isPending: false,
        isDetailPending: false,
        isError: false,
        isSuccess: true,
        managerWorkspace,
    }),
);

export const getManagerTasksError = createAction<JourneyStatePayload>(
    JourneyActionEnums.getManagerTasksError,
    () => ({
        isPending: false,
        isDetailPending: false,
        isError: true,
        isSuccess: false,
        managerWorkspace: null,
    }),
);

export const getMyTaskPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.getMyTaskPending,
    () => ({
        isPending: true,
        isDetailPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const getMyTaskSuccess = createAction<
    JourneyStatePayload,
    IEnroleeJourneyTaskDetailDto | null
>(
    JourneyActionEnums.getMyTaskSuccess,
    (selectedTask) => ({
        isPending: false,
        isDetailPending: false,
        isError: false,
        isSuccess: true,
        selectedTask,
    }),
);

export const getMyTaskError = createAction<JourneyStatePayload>(
    JourneyActionEnums.getMyTaskError,
    () => ({
        isPending: false,
        isDetailPending: false,
        isError: true,
        isSuccess: false,
        selectedTask: null,
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
        personalisationProposal: null,
        personalisationDecisions: [],
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

export const participantMutationPending = createAction<JourneyStatePayload>(
    JourneyActionEnums.participantMutationPending,
    () => ({
        isPending: true,
        isMutationPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const participantMutationSuccess = createAction<
    JourneyStatePayload,
    {
        myJourney?: IEnroleeJourneyDashboardDto | null;
        selectedTask?: IEnroleeJourneyTaskDetailDto | null;
    }
>(
    JourneyActionEnums.participantMutationSuccess,
    (payload) => ({
        isPending: false,
        isMutationPending: false,
        isError: false,
        isSuccess: true,
        ...payload,
    }),
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
    () => ({
        isPending: true,
        isMutationPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const managerMutationSuccess = createAction<
    JourneyStatePayload,
    IManagerTaskWorkspaceDto | null
>(
    JourneyActionEnums.managerMutationSuccess,
    (managerWorkspace) => ({
        isPending: false,
        isMutationPending: false,
        isError: false,
        isSuccess: true,
        managerWorkspace,
    }),
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
    IJourneyPersonalisationProposalDto
>(
    JourneyActionEnums.personalisationRequestSuccess,
    (personalisationProposal) => ({
        isPersonalisationPending: false,
        isError: false,
        isSuccess: true,
        personalisationProposal,
        personalisationDecisions:
            buildInitialPersonalisationDecisions(personalisationProposal),
    }),
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
    IJourneyPersonalisationDecisionItem[]
>(
    JourneyActionEnums.setPersonalisationDecisions,
    (personalisationDecisions) => ({
        personalisationDecisions,
    }),
);

export const clearPersonalisationReview = createAction<JourneyStatePayload>(
    JourneyActionEnums.clearPersonalisationReview,
    () => ({
        isPersonalisationPending: false,
        personalisationProposal: null,
        personalisationDecisions: [],
    }),
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
