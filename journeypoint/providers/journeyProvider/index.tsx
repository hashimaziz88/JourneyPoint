"use client";

import React, { useContext, useReducer } from "react";
import {
    buildApplyPersonalisationRequest,
    updatePersonalisationDecision,
} from "@/utils/journey/personalisation";
import {
    acknowledgeMyJourneyTask,
    activateJourney,
    addJourneyTask,
    applyJourneyPersonalisation,
    completeManagerJourneyTask,
    completeMyJourneyTask,
    fetchJourneyDraft,
    fetchManagerTasks,
    fetchMyJourney,
    fetchMyTask,
    generateJourneyDraft,
    removePendingJourneyTask,
    requestJourneyPersonalisation,
    updateJourneyTask,
} from "@/utils/journey/provider";
import {
    clearPersonalisationReview as clearPersonalisationReviewAction,
    getJourneyError,
    getJourneyPending,
    getJourneySuccess,
    getManagerTasksError,
    getManagerTasksPending,
    getManagerTasksSuccess,
    getMyJourneyError,
    getMyJourneyPending,
    getMyJourneySuccess,
    getMyTaskError,
    getMyTaskPending,
    getMyTaskSuccess,
    managerMutationError,
    managerMutationPending,
    managerMutationSuccess,
    mutationError,
    mutationPending,
    mutationSuccess,
    participantMutationError,
    participantMutationPending,
    participantMutationSuccess,
    personalisationError,
    personalisationPending,
    personalisationRequestSuccess,
    resetJourney as resetJourneyAction,
    setPersonalisationDecisions,
} from "./actions";
import {
    INITIAL_STATE,
    JourneyActionContext,
    JourneyStateContext,
    type IJourneyActionContext,
    type IJourneyStateContext,
} from "./context";
import { JourneyReducer } from "./reducer";
import type {
    AcknowledgeJourneyTaskRequest,
    AddJourneyTaskRequest,
    CompleteJourneyTaskRequest,
    GenerateDraftJourneyRequest,
    JourneyDraftDto,
    JourneyPersonalisationProposalDto,
    RequestJourneyPersonalisationRequest,
    UpdateJourneyTaskRequest,
    JourneyPersonalisationDecision,
} from "@/types/journey/journey";

/**
 * Provides typed journey state and actions for facilitator, manager, and enrolee flows.
 */
export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(JourneyReducer, INITIAL_STATE);

    const getDraft = async (hireId: string): Promise<JourneyDraftDto | null> => {
        dispatch(getJourneyPending());

        try {
            const journey = await fetchJourneyDraft(hireId);
            dispatch(getJourneySuccess(journey));
            return journey;
        } catch (error) {
            console.error(error);
            dispatch(getJourneyError());
            return null;
        }
    };

    const getMyJourney = async () => {
        dispatch(getMyJourneyPending());

        try {
            const myJourney = await fetchMyJourney();
            dispatch(getMyJourneySuccess(myJourney));
            return myJourney;
        } catch (error) {
            console.error(error);
            dispatch(getMyJourneyError());
            return null;
        }
    };

    const getManagerTasks = async () => {
        dispatch(getManagerTasksPending());

        try {
            const managerWorkspace = await fetchManagerTasks();
            dispatch(getManagerTasksSuccess(managerWorkspace));
            return managerWorkspace;
        } catch (error) {
            console.error(error);
            dispatch(getManagerTasksError());
            return null;
        }
    };

    const getMyTask = async (journeyTaskId: string) => {
        dispatch(getMyTaskPending());

        try {
            const selectedTask = await fetchMyTask(journeyTaskId);
            dispatch(getMyTaskSuccess(selectedTask));
            return selectedTask;
        } catch (error) {
            console.error(error);
            dispatch(getMyTaskError());
            return null;
        }
    };

    const generateDraft = async (
        payload: GenerateDraftJourneyRequest,
    ): Promise<JourneyDraftDto | null> => {
        dispatch(mutationPending());

        try {
            const journey = await generateJourneyDraft(payload);
            dispatch(mutationSuccess(journey));
            return journey;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const refreshAfterDraftMutation = async (
        hireId: string,
    ): Promise<JourneyDraftDto | null> => {
        try {
            const journey = await fetchJourneyDraft(hireId);
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
        payload: UpdateJourneyTaskRequest,
    ): Promise<JourneyDraftDto | null> => {
        dispatch(mutationPending());

        try {
            await updateJourneyTask(journeyTaskId, payload);
            return await refreshAfterDraftMutation(hireId);
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const addTask = async (
        hireId: string,
        journeyId: string,
        payload: AddJourneyTaskRequest,
    ): Promise<JourneyDraftDto | null> => {
        dispatch(mutationPending());

        try {
            await addJourneyTask(journeyId, payload);
            return await refreshAfterDraftMutation(hireId);
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const removePendingTask = async (
        hireId: string,
        journeyTaskId: string,
    ): Promise<JourneyDraftDto | null> => {
        dispatch(mutationPending());

        try {
            await removePendingJourneyTask(journeyTaskId);
            return await refreshAfterDraftMutation(hireId);
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const requestPersonalisationAction = async (
        payload: RequestJourneyPersonalisationRequest,
    ): Promise<JourneyPersonalisationProposalDto | null> => {
        dispatch(personalisationPending());

        try {
            const proposal = await requestJourneyPersonalisation(payload);
            dispatch(personalisationRequestSuccess(proposal));
            return proposal;
        } catch (error) {
            console.error(error);
            dispatch(personalisationError());
            return null;
        }
    };

    const applyPersonalisationAction = async (): Promise<JourneyDraftDto | null> => {
        const payload = buildApplyPersonalisationRequest(
            state.personalisationProposal,
            state.personalisationDecisions,
        );

        if (!payload) {
            return null;
        }

        dispatch(personalisationPending());

        try {
            const journey = await applyJourneyPersonalisation(payload);
            dispatch(mutationSuccess(journey));
            return journey;
        } catch (error) {
            console.error(error);
            dispatch(personalisationError());
            return null;
        }
    };

    const setPersonalisationDecisionAction = (
        journeyTaskId: string,
        decision: JourneyPersonalisationDecision,
    ): void => {
        const nextDecisions = updatePersonalisationDecision(
            state.personalisationDecisions,
            journeyTaskId,
            decision,
        );

        dispatch(setPersonalisationDecisions(nextDecisions));
    };

    const clearPersonalisationReview = (): void => {
        dispatch(clearPersonalisationReviewAction());
    };

    const activate = async (hireId: string): Promise<JourneyDraftDto | null> => {
        dispatch(mutationPending());

        try {
            const journey = await activateJourney(hireId);
            dispatch(mutationSuccess(journey));
            return journey;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const refreshParticipantState = async (journeyTaskId: string) => {
        try {
            const [myJourney, selectedTask] = await Promise.all([
                fetchMyJourney(),
                fetchMyTask(journeyTaskId),
            ]);

            dispatch(participantMutationSuccess({ myJourney, selectedTask }));
            return selectedTask;
        } catch (error) {
            console.error(error);
            dispatch(participantMutationError());
            return null;
        }
    };

    const acknowledgeMyTask = async (
        payload: AcknowledgeJourneyTaskRequest,
    ) => {
        dispatch(participantMutationPending());

        try {
            await acknowledgeMyJourneyTask(payload);
            return await refreshParticipantState(payload.journeyTaskId);
        } catch (error) {
            console.error(error);
            dispatch(participantMutationError());
            return null;
        }
    };

    const completeMyTask = async (payload: CompleteJourneyTaskRequest) => {
        dispatch(participantMutationPending());

        try {
            await completeMyJourneyTask(payload);
            return await refreshParticipantState(payload.journeyTaskId);
        } catch (error) {
            console.error(error);
            dispatch(participantMutationError());
            return null;
        }
    };

    const completeManagerTask = async (payload: CompleteJourneyTaskRequest) => {
        dispatch(managerMutationPending());

        try {
            const managerWorkspace = await completeManagerJourneyTask(payload);
            dispatch(managerMutationSuccess(managerWorkspace));
            return managerWorkspace;
        } catch (error) {
            console.error(error);
            dispatch(managerMutationError());
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
                    getManagerTasks,
                    getMyTask,
                    acknowledgeMyTask,
                    completeMyTask,
                    completeManagerTask,
                    generateDraft,
                    updateTask,
                    addTask,
                    removePendingTask,
                    requestPersonalisation: requestPersonalisationAction,
                    applyPersonalisation: applyPersonalisationAction,
                    setPersonalisationDecision: setPersonalisationDecisionAction,
                    clearPersonalisationReview,
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
