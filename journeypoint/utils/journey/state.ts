import type {
    IEnroleeJourneyDashboardDto,
    IEnroleeJourneyTaskDetailDto,
    IJourneyDraftDto,
    IJourneyPersonalisationProposalDto,
    IManagerTaskWorkspaceDto,
} from "@/types/journey";
import { buildInitialPersonalisationDecisions } from "@/utils/journey/personalisation";
import type { IJourneyStateContext } from "@/providers/journeyProvider/context";

type JourneyStatePatch = Partial<IJourneyStateContext>;

const EMPTY_PERSONALISATION_STATE: JourneyStatePatch = {
    personalisationProposal: null,
    personalisationDecisions: [],
};

const FACILITATOR_SCOPE_STATE: JourneyStatePatch = {
    myJourney: null,
    managerWorkspace: null,
    selectedTask: null,
};

const PARTICIPANT_SCOPE_STATE: JourneyStatePatch = {
    journey: null,
    managerWorkspace: null,
    ...EMPTY_PERSONALISATION_STATE,
};

const PARTICIPANT_DASHBOARD_SCOPE_STATE: JourneyStatePatch = {
    ...PARTICIPANT_SCOPE_STATE,
    selectedTask: null,
};

const MANAGER_SCOPE_STATE: JourneyStatePatch = {
    journey: null,
    myJourney: null,
    selectedTask: null,
    ...EMPTY_PERSONALISATION_STATE,
};

export const buildJourneyPendingState = (): JourneyStatePatch => ({
    isPending: true,
    isDetailPending: true,
    isError: false,
    isSuccess: false,
    ...FACILITATOR_SCOPE_STATE,
});

export const buildJourneySuccessState = (
    journey: IJourneyDraftDto,
): JourneyStatePatch => ({
    isPending: false,
    isDetailPending: false,
    isError: false,
    isSuccess: true,
    journey,
    ...FACILITATOR_SCOPE_STATE,
    ...EMPTY_PERSONALISATION_STATE,
});

export const buildJourneyErrorState = (): JourneyStatePatch => ({
    isPending: false,
    isDetailPending: false,
    isError: true,
    isSuccess: false,
    journey: null,
    ...FACILITATOR_SCOPE_STATE,
    ...EMPTY_PERSONALISATION_STATE,
});

export const buildParticipantDashboardPendingState = (): JourneyStatePatch => ({
    isPending: true,
    isDetailPending: true,
    isError: false,
    isSuccess: false,
    ...PARTICIPANT_DASHBOARD_SCOPE_STATE,
});

export const buildParticipantDashboardSuccessState = (
    myJourney: IEnroleeJourneyDashboardDto | null,
): JourneyStatePatch => ({
    isPending: false,
    isDetailPending: false,
    isError: false,
    isSuccess: true,
    myJourney,
    ...PARTICIPANT_DASHBOARD_SCOPE_STATE,
});

export const buildParticipantDashboardErrorState = (): JourneyStatePatch => ({
    isPending: false,
    isDetailPending: false,
    isError: true,
    isSuccess: false,
    myJourney: null,
    ...PARTICIPANT_DASHBOARD_SCOPE_STATE,
});

export const buildParticipantTaskPendingState = (): JourneyStatePatch => ({
    isPending: true,
    isDetailPending: true,
    isError: false,
    isSuccess: false,
    ...PARTICIPANT_SCOPE_STATE,
});

export const buildParticipantTaskSuccessState = (
    selectedTask: IEnroleeJourneyTaskDetailDto | null,
): JourneyStatePatch => ({
    isPending: false,
    isDetailPending: false,
    isError: false,
    isSuccess: true,
    selectedTask,
    ...PARTICIPANT_SCOPE_STATE,
});

export const buildParticipantTaskErrorState = (): JourneyStatePatch => ({
    isPending: false,
    isDetailPending: false,
    isError: true,
    isSuccess: false,
    selectedTask: null,
    ...PARTICIPANT_SCOPE_STATE,
});

export const buildFacilitatorMutationPendingState = (): JourneyStatePatch => ({
    isPending: true,
    isMutationPending: true,
    isError: false,
    isSuccess: false,
    ...FACILITATOR_SCOPE_STATE,
});

export const buildFacilitatorMutationSuccessState = (
    journey: IJourneyDraftDto,
): JourneyStatePatch => ({
    isPending: false,
    isMutationPending: false,
    isError: false,
    isSuccess: true,
    journey,
    ...FACILITATOR_SCOPE_STATE,
    ...EMPTY_PERSONALISATION_STATE,
});

export const buildParticipantMutationPendingState = (): JourneyStatePatch => ({
    isPending: true,
    isMutationPending: true,
    isError: false,
    isSuccess: false,
    ...PARTICIPANT_SCOPE_STATE,
});

export const buildParticipantMutationSuccessState = (
    payload: Pick<IJourneyStateContext, "myJourney" | "selectedTask">,
): JourneyStatePatch => ({
    isPending: false,
    isMutationPending: false,
    isError: false,
    isSuccess: true,
    ...PARTICIPANT_SCOPE_STATE,
    ...payload,
});

export const buildManagerPendingState = (): JourneyStatePatch => ({
    isPending: true,
    isDetailPending: true,
    isError: false,
    isSuccess: false,
    ...MANAGER_SCOPE_STATE,
});

export const buildManagerSuccessState = (
    managerWorkspace: IManagerTaskWorkspaceDto | null,
): JourneyStatePatch => ({
    isPending: false,
    isDetailPending: false,
    isError: false,
    isSuccess: true,
    managerWorkspace,
    ...MANAGER_SCOPE_STATE,
});

export const buildManagerErrorState = (): JourneyStatePatch => ({
    isPending: false,
    isDetailPending: false,
    isError: true,
    isSuccess: false,
    managerWorkspace: null,
    ...MANAGER_SCOPE_STATE,
});

export const buildManagerMutationPendingState = (): JourneyStatePatch => ({
    isPending: true,
    isMutationPending: true,
    isError: false,
    isSuccess: false,
    ...MANAGER_SCOPE_STATE,
});

export const buildManagerMutationSuccessState = (
    managerWorkspace: IManagerTaskWorkspaceDto | null,
): JourneyStatePatch => ({
    isPending: false,
    isMutationPending: false,
    isError: false,
    isSuccess: true,
    managerWorkspace,
    ...MANAGER_SCOPE_STATE,
});

export const buildPersonalisationSuccessState = (
    personalisationProposal: IJourneyPersonalisationProposalDto,
): JourneyStatePatch => ({
    isPersonalisationPending: false,
    isError: false,
    isSuccess: true,
    personalisationProposal,
    ...FACILITATOR_SCOPE_STATE,
    personalisationDecisions:
        buildInitialPersonalisationDecisions(personalisationProposal),
});

export const buildClearedPersonalisationState = (): JourneyStatePatch => ({
    isPersonalisationPending: false,
    ...EMPTY_PERSONALISATION_STATE,
});
