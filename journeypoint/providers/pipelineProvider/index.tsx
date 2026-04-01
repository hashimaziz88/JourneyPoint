"use client";

import React, { useContext, useReducer } from "react";
import { buildPipelineBoardRequest, fetchPipelineBoard } from "@/utils/pipeline/board";
import {
    getBoardError,
    getBoardPending,
    getBoardSuccess,
    resetFilters as resetFiltersAction,
    setFilters as setFiltersAction,
} from "./actions";
import {
    INITIAL_STATE,
    PipelineActionContext,
    PipelineStateContext,
    type IPipelineActionContext,
    type PipelineBoardDto,
    type PipelineBoardQueryState,
    type IPipelineStateContext,
} from "./context";
import { PipelineReducer } from "./reducer";

/**
 * Provides typed facilitator pipeline state and actions.
 */
export const PipelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(PipelineReducer, INITIAL_STATE);

    const getBoard = async (
        request: PipelineBoardQueryState = state.filters,
    ): Promise<PipelineBoardDto | null> => {
        dispatch(getBoardPending());

        try {
            const board = await fetchPipelineBoard(buildPipelineBoardRequest(request));
            dispatch(getBoardSuccess(board));
            return board;
        } catch (error) {
            console.error(error);
            dispatch(getBoardError());
            return null;
        }
    };

    const setFilters = (filters: PipelineBoardQueryState): void => {
        dispatch(setFiltersAction(filters));
    };

    const resetFilters = (): void => {
        dispatch(resetFiltersAction());
    };

    return (
        <PipelineStateContext.Provider value={state}>
            <PipelineActionContext.Provider
                value={{
                    getBoard,
                    setFilters,
                    resetFilters,
                }}
            >
                {children}
            </PipelineActionContext.Provider>
        </PipelineStateContext.Provider>
    );
};

export const usePipelineState = (): IPipelineStateContext => {
    const context = useContext(PipelineStateContext);

    if (context === undefined) {
        throw new Error("usePipelineState must be used within a PipelineProvider");
    }

    return context;
};

export const usePipelineActions = (): IPipelineActionContext => {
    const context = useContext(PipelineActionContext);

    if (context === undefined) {
        throw new Error("usePipelineActions must be used within a PipelineProvider");
    }

    return context;
};
