"use client";

import React, { useContext, useReducer } from "react";
import {
    acknowledgeAtRiskFlag as acknowledgeAtRiskFlagRequest,
    fetchHireIntelligence,
    resolveAtRiskFlag as resolveAtRiskFlagRequest,
} from "@/utils/engagement/provider";
import {
    getHireIntelligenceError,
    getHireIntelligencePending,
    getHireIntelligenceSuccess,
    mutationError,
    mutationPending,
    mutationSuccess,
    resetHireIntelligence as resetHireIntelligenceAction,
} from "./actions";
import {
    EngagementActionContext,
    EngagementStateContext,
    INITIAL_STATE,
    type IAcknowledgeAtRiskFlagRequest,
    type IEngagementActionContext,
    type IEngagementStateContext,
    type IHireIntelligenceDetailDto,
    type IResolveAtRiskFlagRequest,
} from "./context";
import { EngagementReducer } from "./reducer";

/**
 * Provides typed hire-intelligence and intervention state for facilitator views.
 */
export const EngagementProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(EngagementReducer, INITIAL_STATE);

    const getHireIntelligence = async (
        hireId: string,
    ): Promise<IHireIntelligenceDetailDto | null> => {
        dispatch(getHireIntelligencePending());

        try {
            const selectedHireIntelligence = await fetchHireIntelligence(hireId);
            dispatch(getHireIntelligenceSuccess(selectedHireIntelligence));
            return selectedHireIntelligence;
        } catch (error) {
            console.error(error);
            dispatch(getHireIntelligenceError());
            return null;
        }
    };

    const refreshAfterMutation = async (
        hireId: string,
    ): Promise<IHireIntelligenceDetailDto | null> => {
        try {
            const selectedHireIntelligence = await fetchHireIntelligence(hireId);
            dispatch(mutationSuccess(selectedHireIntelligence));
            return selectedHireIntelligence;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const acknowledgeAtRiskFlag = async (
        hireId: string,
        payload: IAcknowledgeAtRiskFlagRequest,
    ): Promise<IHireIntelligenceDetailDto | null> => {
        dispatch(mutationPending());

        try {
            await acknowledgeAtRiskFlagRequest(payload);
            return await refreshAfterMutation(hireId);
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const resolveAtRiskFlag = async (
        hireId: string,
        payload: IResolveAtRiskFlagRequest,
    ): Promise<IHireIntelligenceDetailDto | null> => {
        dispatch(mutationPending());

        try {
            await resolveAtRiskFlagRequest(payload);
            return await refreshAfterMutation(hireId);
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const resetHireIntelligence = (): void => {
        dispatch(resetHireIntelligenceAction());
    };

    return (
        <EngagementStateContext.Provider value={state}>
            <EngagementActionContext.Provider
                value={{
                    getHireIntelligence,
                    acknowledgeAtRiskFlag,
                    resolveAtRiskFlag,
                    resetHireIntelligence,
                }}
            >
                {children}
            </EngagementActionContext.Provider>
        </EngagementStateContext.Provider>
    );
};

export const useEngagementState = (): IEngagementStateContext => {
    const context = useContext(EngagementStateContext);

    if (context === undefined) {
        throw new Error("useEngagementState must be used within an EngagementProvider");
    }

    return context;
};

export const useEngagementActions = (): IEngagementActionContext => {
    const context = useContext(EngagementActionContext);

    if (context === undefined) {
        throw new Error("useEngagementActions must be used within an EngagementProvider");
    }

    return context;
};
