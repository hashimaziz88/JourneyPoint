"use client";

import React, { useContext, useReducer } from "react";
import { DEFAULT_HIRE_LIST_SORTING } from "@/constants/hire/list";
import { DEFAULT_PLAN_LIST_SORTING } from "@/constants/plans/list";
import { OnboardingPlanStatus } from "@/types/onboarding-plan/onboarding-plan";
import type { OnboardingPlanListItemDto } from "@/types/onboarding-plan/onboarding-plan";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
    getHireDetailError,
    getHireDetailPending,
    getHireDetailSuccess,
    getHiresError,
    getHiresPending,
    getHiresSuccess,
    mutationError,
    mutationPending,
    mutationSuccess,
    referenceError,
    referencePending,
    referenceSuccess,
    resetSelectedHire as resetSelectedHireAction,
} from "./actions";
import {
    HireActionContext,
    HireStateContext,
    INITIAL_STATE,
    type CreateHireRequest,
    type IHireActionContext,
    type HireDetailDto,
    type HireEnrolmentResultDto,
    type GetHiresInput,
    type HireManagerOption,
    type IHireStateContext,
} from "./context";
import { HireReducer } from "./reducer";
import { mapHirePlanOptions } from "@/types/hire/hire";

const HIRE_API_BASE = "/api/services/app/Hire";
const ONBOARDING_PLAN_API_BASE = "/api/services/app/OnboardingPlan";

const getApiResult = <T,>(response: { data?: { result?: T } & T }): T =>
    response.data?.result ?? (response.data as T);

/**
 * Provides facilitator hire list, detail, enrolment, and reference-option state.
 */
export const HireProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(HireReducer, INITIAL_STATE);

    const getHires = async (request: GetHiresInput): Promise<void> => {
        dispatch(getHiresPending());

        try {
            const response = await getAxiosInstance().get(`${HIRE_API_BASE}/GetHires`, {
                params: {
                    ...request,
                    sorting: request.sorting ?? DEFAULT_HIRE_LIST_SORTING,
                },
            });
            const data = getApiResult<{ items?: IHireStateContext["hires"]; totalCount?: number }>(
                response,
            );

            dispatch(
                getHiresSuccess({
                    hires: data.items ?? [],
                    totalCount: data.totalCount ?? 0,
                }),
            );
        } catch (error) {
            console.error(error);
            dispatch(getHiresError());
        }
    };

    const getHireDetail = async (id: string): Promise<HireDetailDto | null> => {
        dispatch(getHireDetailPending());

        try {
            const response = await getAxiosInstance().get(`${HIRE_API_BASE}/GetDetail`, {
                params: { id },
            });
            const detail = getApiResult<HireDetailDto>(response);

            dispatch(getHireDetailSuccess(detail));
            return detail;
        } catch (error) {
            console.error(error);
            dispatch(getHireDetailError());
            return null;
        }
    };

    const createHire = async (
        payload: CreateHireRequest,
    ): Promise<HireEnrolmentResultDto | null> => {
        dispatch(mutationPending());

        try {
            const response = await getAxiosInstance().post(`${HIRE_API_BASE}/Create`, payload);
            const result = getApiResult<HireEnrolmentResultDto>(response);

            dispatch(mutationSuccess({}));
            return result;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const resendWelcomeNotification = async (
        hireId: string,
    ): Promise<HireEnrolmentResultDto | null> => {
        dispatch(mutationPending());

        try {
            const response = await getAxiosInstance().post(
                `${HIRE_API_BASE}/ResendWelcomeNotification`,
                { id: hireId },
            );
            const result = getApiResult<HireEnrolmentResultDto>(response);

            dispatch(mutationSuccess({}));
            return result;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const getPublishedPlanOptions = async (): Promise<void> => {
        dispatch(referencePending());

        try {
            const response = await getAxiosInstance().get(`${ONBOARDING_PLAN_API_BASE}/GetPlans`, {
                params: {
                    status: OnboardingPlanStatus.Published,
                    skipCount: 0,
                    maxResultCount: 100,
                    sorting: DEFAULT_PLAN_LIST_SORTING,
                },
            });
            const data = getApiResult<{ items?: OnboardingPlanListItemDto[] }>(response);

            dispatch(referenceSuccess({ planOptions: mapHirePlanOptions(data.items) }));
        } catch (error) {
            console.error(error);
            dispatch(referenceError());
        }
    };

    const getManagerOptions = async (): Promise<void> => {
        dispatch(referencePending());

        try {
            const response = await getAxiosInstance().get(`${HIRE_API_BASE}/GetManagerOptions`);
            const data = getApiResult<{ items?: HireManagerOption[] }>(response);

            dispatch(
                referenceSuccess({
                    managerOptions: data.items ?? [],
                }),
            );
        } catch (error) {
            console.error(error);
            dispatch(referenceError());
        }
    };

    const resetSelectedHire = (): void => {
        dispatch(resetSelectedHireAction());
    };

    return (
        <HireStateContext.Provider value={state}>
            <HireActionContext.Provider
                value={{
                    getHires,
                    getHireDetail,
                    createHire,
                    resendWelcomeNotification,
                    getPublishedPlanOptions,
                    getManagerOptions,
                    resetSelectedHire,
                }}
            >
                {children}
            </HireActionContext.Provider>
        </HireStateContext.Provider>
    );
};

export const useHireState = (): IHireStateContext => {
    const context = useContext(HireStateContext);

    if (context === undefined) {
        throw new Error("useHireState must be used within a HireProvider");
    }

    return context;
};

export const useHireActions = (): IHireActionContext => {
    const context = useContext(HireActionContext);

    if (context === undefined) {
        throw new Error("useHireActions must be used within a HireProvider");
    }

    return context;
};
