"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/utils/axiosInstance";
import type {
    GenerateWellnessAnswerSuggestionRequest,
    HireWellnessOverviewDto,
    SaveWellnessAnswerRequest,
    SubmitWellnessCheckInRequest,
    WellnessCheckInDetailDto,
    WellnessQuestionDto,
} from "@/types/wellness/wellness";
import {
    getDetailError,
    getDetailPending,
    getDetailSuccess,
    getOverviewError,
    getOverviewPending,
    getOverviewSuccess,
    mutationError,
    mutationPending,
    mutationSuccessCheckIn,
    mutationSuccessQuestion,
} from "./actions";
import {
    INITIAL_STATE,
    type IWellnessActionContext,
    type IWellnessStateContext,
    WellnessActionContext,
    WellnessStateContext,
} from "./context";
import { WellnessReducer } from "./reducer";

const WELLNESS_API_BASE = "/api/services/app/Wellness";

const getApiResult = <T,>(response: { data?: { result?: T } & T }): T =>
    response.data?.result ?? (response.data as T);

/**
 * Provides wellness check-in overview, detail, and mutation actions.
 */
export const WellnessProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(WellnessReducer, INITIAL_STATE);

    const getHireWellnessOverview = async (
        hireId: string,
    ): Promise<HireWellnessOverviewDto | null> => {
        dispatch(getOverviewPending());

        try {
            const response = await getAxiosInstance().get(
                `${WELLNESS_API_BASE}/GetHireWellnessOverview`,
                {
                    params: { hireId },
                },
            );
            const data = getApiResult<HireWellnessOverviewDto>(response);

            dispatch(getOverviewSuccess({ overview: data }));
            return data;
        } catch (error) {
            console.error(error);
            dispatch(getOverviewError());
            return null;
        }
    };

    const getCheckInDetail = async (
        checkInId: string,
    ): Promise<WellnessCheckInDetailDto | null> => {
        dispatch(getDetailPending());

        try {
            const response = await getAxiosInstance().get(
                `${WELLNESS_API_BASE}/GetCheckInDetail`,
                {
                    params: { checkInId },
                },
            );
            const data = getApiResult<WellnessCheckInDetailDto>(response);

            dispatch(getDetailSuccess({ checkInDetail: data }));
            return data;
        } catch (error) {
            console.error(error);
            dispatch(getDetailError());
            return null;
        }
    };

    const saveAnswer = async (
        request: SaveWellnessAnswerRequest,
    ): Promise<WellnessQuestionDto | null> => {
        dispatch(mutationPending());

        try {
            const response = await getAxiosInstance().post(
                `${WELLNESS_API_BASE}/SaveAnswer`,
                request,
            );
            const question = getApiResult<WellnessQuestionDto>(response);

            const updatedDetail = state.checkInDetail
                ? {
                      ...state.checkInDetail,
                      questions: state.checkInDetail.questions.map((q) =>
                          q.id === question.id ? question : q,
                      ),
                  }
                : null;

            dispatch(mutationSuccessQuestion({ checkInDetail: updatedDetail }));
            return question;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const generateAnswerSuggestion = async (
        request: GenerateWellnessAnswerSuggestionRequest,
    ): Promise<WellnessQuestionDto | null> => {
        dispatch(mutationPending());

        try {
            const response = await getAxiosInstance().post(
                `${WELLNESS_API_BASE}/GenerateAnswerSuggestion`,
                request,
            );
            const question = getApiResult<WellnessQuestionDto>(response);

            const updatedDetail = state.checkInDetail
                ? {
                      ...state.checkInDetail,
                      questions: state.checkInDetail.questions.map((q) =>
                          q.id === question.id ? question : q,
                      ),
                  }
                : null;

            dispatch(mutationSuccessQuestion({ checkInDetail: updatedDetail }));
            return question;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const submitCheckIn = async (
        request: SubmitWellnessCheckInRequest,
    ): Promise<WellnessCheckInDetailDto | null> => {
        dispatch(mutationPending());

        try {
            const response = await getAxiosInstance().post(
                `${WELLNESS_API_BASE}/SubmitCheckIn`,
                request,
            );
            const detail = getApiResult<WellnessCheckInDetailDto>(response);

            dispatch(mutationSuccessCheckIn({ checkInDetail: detail }));
            return detail;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    return (
        <WellnessStateContext.Provider value={state}>
            <WellnessActionContext.Provider
                value={{
                    getHireWellnessOverview,
                    getCheckInDetail,
                    saveAnswer,
                    generateAnswerSuggestion,
                    submitCheckIn,
                }}
            >
                {children}
            </WellnessActionContext.Provider>
        </WellnessStateContext.Provider>
    );
};

export const useWellnessState = (): IWellnessStateContext => {
    const context = useContext(WellnessStateContext);

    if (context === undefined) {
        throw new Error("useWellnessState must be used within a WellnessProvider");
    }

    return context;
};

export const useWellnessActions = (): IWellnessActionContext => {
    const context = useContext(WellnessActionContext);

    if (context === undefined) {
        throw new Error("useWellnessActions must be used within a WellnessProvider");
    }

    return context;
};
