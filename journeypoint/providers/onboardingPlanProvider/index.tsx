"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/utils/axiosInstance";
import { DEFAULT_PLAN_LIST_SORTING } from "@/constants/plans/list";
import type {
    ICloneOnboardingPlanRequest,
    ICreateOnboardingPlanRequest,
    IGetOnboardingPlansInput,
    IOnboardingPlanDetailDto,
    IOnboardingPlanListItemDto,
    IOnboardingTaskEditorValues,
    IUpdateOnboardingPlanRequest,
} from "@/types/onboarding-plan";
import {
    getPlanDetailError,
    getPlanDetailPending,
    getPlanDetailSuccess,
    getPlansError,
    getPlansPending,
    getPlansSuccess,
    mutationError,
    mutationPending,
    mutationSuccess,
    resetDraft as resetDraftAction,
    setDraft,
} from "./actions";
import {
    INITIAL_STATE,
    type IOnboardingPlanActionContext,
    type IOnboardingPlanStateContext,
    OnboardingPlanActionContext,
    OnboardingPlanStateContext,
} from "./context";
import { OnboardingPlanReducer } from "./reducer";
import {
    appendOnboardingPlanDraftModule,
    appendOnboardingPlanDraftTask,
    applyOnboardingPlanDraftMetadata,
    createEmptyOnboardingPlanDraft,
    mapOnboardingPlanDetailToDraft,
    normalizeOnboardingPlanDetail,
    removeOnboardingPlanDraftModule,
    removeOnboardingPlanDraftTask,
    reorderOnboardingPlanDraftModule,
    reorderOnboardingPlanDraftTask,
    updateOnboardingPlanDraft,
    updateOnboardingPlanDraftModule,
    updateOnboardingPlanDraftTask,
} from "@/utils/plans/onboardingPlanDraft";

const ONBOARDING_PLAN_API_BASE = "/api/services/app/OnboardingPlan";

const getApiResult = <T,>(response: { data?: { result?: T } & T }): T =>
    response.data?.result ?? (response.data as T);

/**
 * Provides onboarding plan list, detail, and plan-builder draft actions.
 */
export const OnboardingPlanProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(OnboardingPlanReducer, INITIAL_STATE);

    const getPlans = async (request: IGetOnboardingPlansInput): Promise<void> => {
        dispatch(getPlansPending());

        try {
            const response = await getAxiosInstance().get(
                `${ONBOARDING_PLAN_API_BASE}/GetPlans`,
                {
                    params: {
                        ...request,
                        sorting: request.sorting ?? DEFAULT_PLAN_LIST_SORTING,
                    },
                },
            );
            const data = getApiResult<{ items?: IOnboardingPlanListItemDto[]; totalCount?: number }>(
                response,
            );

            dispatch(
                getPlansSuccess({
                    plans: data.items ?? [],
                    totalCount: data.totalCount ?? 0,
                }),
            );
        } catch (error) {
            console.error(error);
            dispatch(getPlansError());
        }
    };

    const getPlanDetail = async (id: string): Promise<IOnboardingPlanDetailDto | null> => {
        dispatch(getPlanDetailPending());

        try {
            const response = await getAxiosInstance().get(
                `${ONBOARDING_PLAN_API_BASE}/GetDetail`,
                {
                    params: { id },
                },
            );
            const detail = normalizeOnboardingPlanDetail(
                getApiResult<IOnboardingPlanDetailDto>(response),
            );

            dispatch(
                getPlanDetailSuccess({
                    selectedPlan: detail,
                    draftPlan: mapOnboardingPlanDetailToDraft(detail),
                }),
            );
            return detail;
        } catch (error) {
            console.error(error);
            dispatch(getPlanDetailError());
            return null;
        }
    };

    const runMutation = async (
        request: Promise<{ data?: { result?: IOnboardingPlanDetailDto } & IOnboardingPlanDetailDto }>,
    ): Promise<IOnboardingPlanDetailDto | null> => {
        dispatch(mutationPending());

        try {
            const response = await request;
            const detail = normalizeOnboardingPlanDetail(
                getApiResult<IOnboardingPlanDetailDto>(response),
            );

            dispatch(
                mutationSuccess({
                    selectedPlan: detail,
                    draftPlan: mapOnboardingPlanDetailToDraft(detail),
                }),
            );
            return detail;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const createPlan = async (
        payload: ICreateOnboardingPlanRequest,
    ): Promise<IOnboardingPlanDetailDto | null> =>
        runMutation(getAxiosInstance().post(`${ONBOARDING_PLAN_API_BASE}/Create`, payload));

    const updatePlan = async (
        payload: IUpdateOnboardingPlanRequest,
    ): Promise<IOnboardingPlanDetailDto | null> =>
        runMutation(getAxiosInstance().put(`${ONBOARDING_PLAN_API_BASE}/Update`, payload));

    const publishPlan = async (id: string): Promise<IOnboardingPlanDetailDto | null> =>
        runMutation(getAxiosInstance().post(`${ONBOARDING_PLAN_API_BASE}/Publish`, { id }));

    const archivePlan = async (id: string): Promise<IOnboardingPlanDetailDto | null> =>
        runMutation(getAxiosInstance().post(`${ONBOARDING_PLAN_API_BASE}/Archive`, { id }));

    const clonePlan = async (
        payload: ICloneOnboardingPlanRequest,
    ): Promise<IOnboardingPlanDetailDto | null> =>
        runMutation(getAxiosInstance().post(`${ONBOARDING_PLAN_API_BASE}/Clone`, payload));

    const initialiseDraft = (): void => {
        dispatch(setDraft(createEmptyOnboardingPlanDraft()));
    };

    const resetDraft = (): void => {
        dispatch(resetDraftAction());
    };

    const updateDraft = (
        updater: Parameters<typeof updateOnboardingPlanDraft>[1],
    ): void => {
        const updatedDraft = updateOnboardingPlanDraft(state.draftPlan, updater);

        if (!updatedDraft) {
            return;
        }

        dispatch(setDraft(updatedDraft));
    };

    const setDraftMetadata: IOnboardingPlanActionContext["setDraftMetadata"] = (payload) => {
        updateDraft((currentDraft) => applyOnboardingPlanDraftMetadata(currentDraft, payload));
    };

    const addModule = (): void => {
        updateDraft(appendOnboardingPlanDraftModule);
    };

    const updateModule = (
        moduleClientKey: string,
        name: string,
        description: string,
    ): void => {
        updateDraft((currentDraft) =>
            updateOnboardingPlanDraftModule(currentDraft, moduleClientKey, name, description),
        );
    };

    const removeModule = (moduleClientKey: string): void => {
        updateDraft((currentDraft) =>
            removeOnboardingPlanDraftModule(currentDraft, moduleClientKey),
        );
    };

    const moveModule = (
        moduleClientKey: string,
        direction: "up" | "down",
    ): void => {
        updateDraft((currentDraft) =>
            reorderOnboardingPlanDraftModule(currentDraft, moduleClientKey, direction),
        );
    };

    const addTask = (
        moduleClientKey: string,
        payload: IOnboardingTaskEditorValues,
    ): void => {
        updateDraft((currentDraft) =>
            appendOnboardingPlanDraftTask(currentDraft, moduleClientKey, payload),
        );
    };

    const updateTask = (
        moduleClientKey: string,
        taskClientKey: string,
        payload: IOnboardingTaskEditorValues,
    ): void => {
        updateDraft((currentDraft) =>
            updateOnboardingPlanDraftTask(
                currentDraft,
                moduleClientKey,
                taskClientKey,
                payload,
            ),
        );
    };

    const removeTask = (
        moduleClientKey: string,
        taskClientKey: string,
    ): void => {
        updateDraft((currentDraft) =>
            removeOnboardingPlanDraftTask(currentDraft, moduleClientKey, taskClientKey),
        );
    };

    const moveTask = (
        moduleClientKey: string,
        taskClientKey: string,
        direction: "up" | "down",
    ): void => {
        updateDraft((currentDraft) =>
            reorderOnboardingPlanDraftTask(
                currentDraft,
                moduleClientKey,
                taskClientKey,
                direction,
            ),
        );
    };

    return (
        <OnboardingPlanStateContext.Provider value={state}>
            <OnboardingPlanActionContext.Provider
                value={{
                    getPlans,
                    getPlanDetail,
                    createPlan,
                    updatePlan,
                    publishPlan,
                    archivePlan,
                    clonePlan,
                    initialiseDraft,
                    resetDraft,
                    setDraftMetadata,
                    addModule,
                    updateModule,
                    removeModule,
                    moveModule,
                    addTask,
                    updateTask,
                    removeTask,
                    moveTask,
                }}
            >
                {children}
            </OnboardingPlanActionContext.Provider>
        </OnboardingPlanStateContext.Provider>
    );
};

export const useOnboardingPlanState = (): IOnboardingPlanStateContext => {
    const context = useContext(OnboardingPlanStateContext);

    if (context === undefined) {
        throw new Error("useOnboardingPlanState must be used within an OnboardingPlanProvider");
    }

    return context;
};

export const useOnboardingPlanActions = (): IOnboardingPlanActionContext => {
    const context = useContext(OnboardingPlanActionContext);

    if (context === undefined) {
        throw new Error("useOnboardingPlanActions must be used within an OnboardingPlanProvider");
    }

    return context;
};
