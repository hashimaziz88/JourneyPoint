"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
    getMyJourneyError,
    getMyJourneyPending,
    getMyJourneySuccess,
    getMyTaskError,
    getMyTaskPending,
    getMyTaskSuccess,
    getJourneyError,
    getJourneyPending,
    getJourneySuccess,
    mutationError,
    mutationPending,
    mutationSuccess,
    participantMutationError,
    participantMutationPending,
    participantMutationSuccess,
    resetJourney as resetJourneyAction,
} from "./actions";
import {
    type IAcknowledgeJourneyTaskRequest,
    type ICompleteJourneyTaskRequest,
    type IEnroleeJourneyDashboardDto,
    type IEnroleeJourneyTaskDetailDto,
    INITIAL_STATE,
    JourneyActionContext,
    JourneyStateContext,
    type IAddJourneyTaskRequest,
    type IGenerateDraftJourneyRequest,
    type IJourneyActionContext,
    type IJourneyDraftDto,
    type IJourneyStateContext,
    type IUpdateJourneyTaskRequest,
} from "./context";
import { JourneyReducer } from "./reducer";

const JOURNEY_API_BASE = "/api/services/app/Journey";

const getApiResult = <T,>(response: { data?: { result?: T } | T }): T => {
    const { data } = response;

    if (
        data &&
        typeof data === "object" &&
        "result" in (data as Record<string, unknown>)
    ) {
        return (data as { result?: T }).result as T;
    }

    return data as T;
};

/**
 * Provides facilitator journey generation, review, and activation state.
 */
export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(JourneyReducer, INITIAL_STATE);

    const getDraft = async (hireId: string): Promise<IJourneyDraftDto | null> => {
        dispatch(getJourneyPending());

        try {
            const response = await getAxiosInstance().get(`${JOURNEY_API_BASE}/GetDraft`, {
                params: { hireId },
            });
            const journey = getApiResult<IJourneyDraftDto>(response);

            dispatch(getJourneySuccess(journey));
            return journey;
        } catch (error) {
            console.error(error);
            dispatch(getJourneyError());
            return null;
        }
    };

    const getMyJourney = async (): Promise<IEnroleeJourneyDashboardDto | null> => {
        dispatch(getMyJourneyPending());

        try {
            const response = await getAxiosInstance().get(`${JOURNEY_API_BASE}/GetMyJourney`);
            const myJourney = getApiResult<IEnroleeJourneyDashboardDto | null>(response);

            dispatch(getMyJourneySuccess(myJourney));
            return myJourney;
        } catch (error) {
            console.error(error);
            dispatch(getMyJourneyError());
            return null;
        }
    };

    const getMyTask = async (
        journeyTaskId: string,
    ): Promise<IEnroleeJourneyTaskDetailDto | null> => {
        dispatch(getMyTaskPending());

        try {
            const response = await getAxiosInstance().get(`${JOURNEY_API_BASE}/GetMyTask`, {
                params: { journeyTaskId },
            });
            const selectedTask = getApiResult<IEnroleeJourneyTaskDetailDto>(response);

            dispatch(getMyTaskSuccess(selectedTask));
            return selectedTask;
        } catch (error) {
            console.error(error);
            dispatch(getMyTaskError());
            return null;
        }
    };

    const generateDraft = async (
        payload: IGenerateDraftJourneyRequest,
    ): Promise<IJourneyDraftDto | null> => {
        dispatch(mutationPending());

        try {
            const response = await getAxiosInstance().post(
                `${JOURNEY_API_BASE}/GenerateDraft`,
                payload,
            );
            const journey = getApiResult<IJourneyDraftDto>(response);

            dispatch(mutationSuccess(journey));
            return journey;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const refreshAfterMutation = async (hireId: string): Promise<IJourneyDraftDto | null> => {
        try {
            const response = await getAxiosInstance().get(`${JOURNEY_API_BASE}/GetDraft`, {
                params: { hireId },
            });
            const journey = getApiResult<IJourneyDraftDto>(response);

            dispatch(mutationSuccess(journey));
            return journey;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const updateTask = async (
        hireId: string,
        journeyTaskId: string,
        payload: IUpdateJourneyTaskRequest,
    ): Promise<IJourneyDraftDto | null> => {
        dispatch(mutationPending());

        try {
            await getAxiosInstance().put(`${JOURNEY_API_BASE}/UpdateTask`, payload, {
                params: { journeyTaskId },
            });
            return await refreshAfterMutation(hireId);
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const addTask = async (
        hireId: string,
        journeyId: string,
        payload: IAddJourneyTaskRequest,
    ): Promise<IJourneyDraftDto | null> => {
        dispatch(mutationPending());

        try {
            await getAxiosInstance().post(`${JOURNEY_API_BASE}/AddTask`, payload, {
                params: { journeyId },
            });
            return await refreshAfterMutation(hireId);
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const removePendingTask = async (
        hireId: string,
        journeyTaskId: string,
    ): Promise<IJourneyDraftDto | null> => {
        dispatch(mutationPending());

        try {
            await getAxiosInstance().delete(`${JOURNEY_API_BASE}/RemovePendingTask`, {
                params: { journeyTaskId },
            });
            return await refreshAfterMutation(hireId);
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const activate = async (hireId: string): Promise<IJourneyDraftDto | null> => {
        dispatch(mutationPending());

        try {
            const response = await getAxiosInstance().post(`${JOURNEY_API_BASE}/Activate`, null, {
                params: { hireId },
            });
            const journey = getApiResult<IJourneyDraftDto>(response);

            dispatch(mutationSuccess(journey));
            return journey;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const refreshMyJourneyState = async (
        journeyTaskId: string,
    ): Promise<IEnroleeJourneyTaskDetailDto | null> => {
        try {
            const [myJourneyResponse, taskResponse] = await Promise.all([
                getAxiosInstance().get(`${JOURNEY_API_BASE}/GetMyJourney`),
                getAxiosInstance().get(`${JOURNEY_API_BASE}/GetMyTask`, {
                    params: { journeyTaskId },
                }),
            ]);
            const myJourney = getApiResult<IEnroleeJourneyDashboardDto | null>(myJourneyResponse);
            const selectedTask = getApiResult<IEnroleeJourneyTaskDetailDto>(taskResponse);

            dispatch(participantMutationSuccess({ myJourney, selectedTask }));
            return selectedTask;
        } catch (error) {
            console.error(error);
            dispatch(participantMutationError());
            return null;
        }
    };

    const acknowledgeMyTask = async (
        payload: IAcknowledgeJourneyTaskRequest,
    ): Promise<IEnroleeJourneyTaskDetailDto | null> => {
        dispatch(participantMutationPending());

        try {
            await getAxiosInstance().post(`${JOURNEY_API_BASE}/AcknowledgeMyTask`, payload);
            return await refreshMyJourneyState(payload.journeyTaskId);
        } catch (error) {
            console.error(error);
            dispatch(participantMutationError());
            return null;
        }
    };

    const completeMyTask = async (
        payload: ICompleteJourneyTaskRequest,
    ): Promise<IEnroleeJourneyTaskDetailDto | null> => {
        dispatch(participantMutationPending());

        try {
            await getAxiosInstance().post(`${JOURNEY_API_BASE}/CompleteMyTask`, payload);
            return await refreshMyJourneyState(payload.journeyTaskId);
        } catch (error) {
            console.error(error);
            dispatch(participantMutationError());
            return null;
        }
    };

    const resetJourney = (): void => {
        dispatch(resetJourneyAction());
    };

    return (
        <JourneyStateContext.Provider value={state}>
            <JourneyActionContext.Provider
                value={{
                    getDraft,
                    getMyJourney,
                    getMyTask,
                    acknowledgeMyTask,
                    completeMyTask,
                    generateDraft,
                    updateTask,
                    addTask,
                    removePendingTask,
                    activate,
                    resetJourney,
                }}
            >
                {children}
            </JourneyActionContext.Provider>
        </JourneyStateContext.Provider>
    );
};

export const useJourneyState = (): IJourneyStateContext => {
    const context = useContext(JourneyStateContext);

    if (context === undefined) {
        throw new Error("useJourneyState must be used within a JourneyProvider");
    }

    return context;
};

export const useJourneyActions = (): IJourneyActionContext => {
    const context = useContext(JourneyActionContext);

    if (context === undefined) {
        throw new Error("useJourneyActions must be used within a JourneyProvider");
    }

    return context;
};
