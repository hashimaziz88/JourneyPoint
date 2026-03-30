import { createContext } from "react";
import type {
    IAddJourneyTaskRequest,
    IAcknowledgeJourneyTaskRequest,
    ICompleteJourneyTaskRequest,
    IEnroleeJourneyDashboardDto,
    IEnroleeJourneyTaskDetailDto,
    IGenerateDraftJourneyRequest,
    IJourneyPersonalisationDecisionItem,
    IJourneyPersonalisationProposalDto,
    IJourneyDraftDto,
    IManagerTaskWorkspaceDto,
    IRequestJourneyPersonalisationRequest,
    IUpdateJourneyTaskRequest,
    JourneyPersonalisationDecision,
} from "@/types/journey";

export interface IJourneyStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isDetailPending: boolean;
    isMutationPending: boolean;
    isPersonalisationPending: boolean;
    journey?: IJourneyDraftDto | null;
    myJourney?: IEnroleeJourneyDashboardDto | null;
    managerWorkspace?: IManagerTaskWorkspaceDto | null;
    selectedTask?: IEnroleeJourneyTaskDetailDto | null;
    personalisationProposal?: IJourneyPersonalisationProposalDto | null;
    personalisationDecisions: IJourneyPersonalisationDecisionItem[];
}

export interface IJourneyActionContext {
    getDraft: (hireId: string) => Promise<IJourneyDraftDto | null>;
    getMyJourney: () => Promise<IEnroleeJourneyDashboardDto | null>;
    getManagerTasks: () => Promise<IManagerTaskWorkspaceDto | null>;
    getMyTask: (journeyTaskId: string) => Promise<IEnroleeJourneyTaskDetailDto | null>;
    acknowledgeMyTask: (
        payload: IAcknowledgeJourneyTaskRequest,
    ) => Promise<IEnroleeJourneyTaskDetailDto | null>;
    completeMyTask: (
        payload: ICompleteJourneyTaskRequest,
    ) => Promise<IEnroleeJourneyTaskDetailDto | null>;
    completeManagerTask: (payload: ICompleteJourneyTaskRequest) => Promise<IManagerTaskWorkspaceDto | null>;
    generateDraft: (payload: IGenerateDraftJourneyRequest) => Promise<IJourneyDraftDto | null>;
    updateTask: (
        hireId: string,
        journeyTaskId: string,
        payload: IUpdateJourneyTaskRequest,
    ) => Promise<IJourneyDraftDto | null>;
    addTask: (
        hireId: string,
        journeyId: string,
        payload: IAddJourneyTaskRequest,
    ) => Promise<IJourneyDraftDto | null>;
    removePendingTask: (hireId: string, journeyTaskId: string) => Promise<IJourneyDraftDto | null>;
    requestPersonalisation: (
        payload: IRequestJourneyPersonalisationRequest,
    ) => Promise<IJourneyPersonalisationProposalDto | null>;
    applyPersonalisation: () => Promise<IJourneyDraftDto | null>;
    setPersonalisationDecision: (
        journeyTaskId: string,
        decision: JourneyPersonalisationDecision,
    ) => void;
    clearPersonalisationReview: () => void;
    activate: (hireId: string) => Promise<IJourneyDraftDto | null>;
    resetJourney: () => void;
}

export const INITIAL_STATE: IJourneyStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    isDetailPending: false,
    isMutationPending: false,
    isPersonalisationPending: false,
    journey: null,
    myJourney: null,
    managerWorkspace: null,
    selectedTask: null,
    personalisationProposal: null,
    personalisationDecisions: [],
};

export const JourneyStateContext = createContext<IJourneyStateContext>(INITIAL_STATE);
export const JourneyActionContext = createContext<IJourneyActionContext | undefined>(undefined);
