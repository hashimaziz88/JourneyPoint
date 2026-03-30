import { createContext } from "react";
export type {
    IAddJourneyTaskRequest,
    IAcknowledgeJourneyTaskRequest,
    ICompleteJourneyTaskRequest,
    IEnroleeJourneyDashboardDto,
    IEnroleeJourneyTaskDetailDto,
    IGenerateDraftJourneyRequest,
    IJourneyDraftDto,
    IManagerTaskWorkspaceDto,
    IUpdateJourneyTaskRequest,
} from "@/types/journey";
import type {
    IAddJourneyTaskRequest,
    IAcknowledgeJourneyTaskRequest,
    ICompleteJourneyTaskRequest,
    IEnroleeJourneyDashboardDto,
    IEnroleeJourneyTaskDetailDto,
    IGenerateDraftJourneyRequest,
    IJourneyDraftDto,
    IManagerTaskWorkspaceDto,
    IUpdateJourneyTaskRequest,
} from "@/types/journey";

export interface IJourneyStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isDetailPending: boolean;
    isMutationPending: boolean;
    journey?: IJourneyDraftDto | null;
    myJourney?: IEnroleeJourneyDashboardDto | null;
    managerWorkspace?: IManagerTaskWorkspaceDto | null;
    selectedTask?: IEnroleeJourneyTaskDetailDto | null;
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
    activate: (hireId: string) => Promise<IJourneyDraftDto | null>;
    resetJourney: () => void;
}

export const INITIAL_STATE: IJourneyStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    isDetailPending: false,
    isMutationPending: false,
    journey: null,
    myJourney: null,
    managerWorkspace: null,
    selectedTask: null,
};

export const JourneyStateContext = createContext<IJourneyStateContext>(INITIAL_STATE);
export const JourneyActionContext = createContext<IJourneyActionContext | undefined>(undefined);
