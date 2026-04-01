import { createContext } from "react";
import type {
    AddJourneyTaskRequest,
    AcknowledgeJourneyTaskRequest,
    CompleteJourneyTaskRequest,
    EnroleeJourneyDashboardDto,
    EnroleeJourneyTaskDetailDto,
    GenerateDraftJourneyRequest,
    JourneyPersonalisationDecisionItem,
    JourneyPersonalisationProposalDto,
    JourneyDraftDto,
    ManagerTaskWorkspaceDto,
    RequestJourneyPersonalisationRequest,
    UpdateJourneyTaskRequest,
    JourneyPersonalisationDecision,
} from "@/types/journey/journey";

export interface IJourneyStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isDetailPending: boolean;
    isMutationPending: boolean;
    isPersonalisationPending: boolean;
    journey?: JourneyDraftDto | null;
    myJourney?: EnroleeJourneyDashboardDto | null;
    managerWorkspace?: ManagerTaskWorkspaceDto | null;
    selectedTask?: EnroleeJourneyTaskDetailDto | null;
    personalisationProposal?: JourneyPersonalisationProposalDto | null;
    personalisationDecisions: JourneyPersonalisationDecisionItem[];
}

export interface IJourneyActionContext {
    getDraft: (hireId: string) => Promise<JourneyDraftDto | null>;
    getMyJourney: () => Promise<EnroleeJourneyDashboardDto | null>;
    getManagerTasks: () => Promise<ManagerTaskWorkspaceDto | null>;
    getMyTask: (journeyTaskId: string) => Promise<EnroleeJourneyTaskDetailDto | null>;
    acknowledgeMyTask: (
        payload: AcknowledgeJourneyTaskRequest,
    ) => Promise<EnroleeJourneyTaskDetailDto | null>;
    completeMyTask: (
        payload: CompleteJourneyTaskRequest,
    ) => Promise<EnroleeJourneyTaskDetailDto | null>;
    completeManagerTask: (payload: CompleteJourneyTaskRequest) => Promise<ManagerTaskWorkspaceDto | null>;
    generateDraft: (payload: GenerateDraftJourneyRequest) => Promise<JourneyDraftDto | null>;
    updateTask: (
        hireId: string,
        journeyTaskId: string,
        payload: UpdateJourneyTaskRequest,
    ) => Promise<JourneyDraftDto | null>;
    addTask: (
        hireId: string,
        journeyId: string,
        payload: AddJourneyTaskRequest,
    ) => Promise<JourneyDraftDto | null>;
    removePendingTask: (hireId: string, journeyTaskId: string) => Promise<JourneyDraftDto | null>;
    requestPersonalisation: (
        payload: RequestJourneyPersonalisationRequest,
    ) => Promise<JourneyPersonalisationProposalDto | null>;
    applyPersonalisation: () => Promise<JourneyDraftDto | null>;
    setPersonalisationDecision: (
        journeyTaskId: string,
        decision: JourneyPersonalisationDecision,
    ) => void;
    clearPersonalisationReview: () => void;
    activate: (hireId: string) => Promise<JourneyDraftDto | null>;
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
