"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
    getJourneyError,
    getJourneyPending,
    getJourneySuccess,
    mutationError,
    mutationPending,
    mutationSuccess,
    resetJourney as resetJourneyAction,
} from "./actions";
import {
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

const getApiResult = <T,>(response: { data?: { result?: T } & T }): T =>
    response.data?.result ?? (response.data as T);

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

    const resetJourney = (): void => {
        dispatch(resetJourneyAction());
    };

    return (
        <JourneyStateContext.Provider value={state}>
            <JourneyActionContext.Provider
                value={{
                    getDraft,
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
