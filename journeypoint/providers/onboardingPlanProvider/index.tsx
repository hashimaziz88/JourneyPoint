"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
    IOnboardingPlanListItemDto,
    ICloneOnboardingPlanRequest,
    ICreateOnboardingPlanRequest,
    IGetOnboardingPlansInput,
    IOnboardingPlanDetailDto,
    IOnboardingPlanDraft,
    IOnboardingModuleDraft,
    IOnboardingTaskDraft,
    IOnboardingTaskEditorValues,
    IUpdateOnboardingPlanRequest,
    OnboardingPlanStatus,
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
    IOnboardingPlanActionContext,
    IOnboardingPlanStateContext,
    OnboardingPlanActionContext,
    OnboardingPlanStateContext,
} from "./context";
import { OnboardingPlanReducer } from "./reducer";

const ONBOARDING_PLAN_API_BASE = "/api/services/app/OnboardingPlan";
const DEFAULT_PLAN_SORTING = "LastUpdatedTime DESC";

const createClientKey = (): string =>
    typeof globalThis.crypto?.randomUUID === "function"
        ? globalThis.crypto.randomUUID()
        : `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeTasks = (tasks: IOnboardingTaskDraft[]): IOnboardingTaskDraft[] =>
    [...tasks]
        .sort((left, right) => left.orderIndex - right.orderIndex)
        .map((task, index) => ({
            ...task,
            orderIndex: index + 1,
        }));

const normalizeModules = (modules: IOnboardingModuleDraft[]): IOnboardingModuleDraft[] =>
    [...modules]
        .sort((left, right) => left.orderIndex - right.orderIndex)
        .map((module, index) => ({
            ...module,
            orderIndex: index + 1,
            tasks: normalizeTasks(module.tasks),
        }));

const normalizeDetail = (
    detail: IOnboardingPlanDetailDto,
): IOnboardingPlanDetailDto => ({
    ...detail,
    modules: [...detail.modules]
        .sort((left, right) => left.orderIndex - right.orderIndex)
        .map((module) => ({
            ...module,
            tasks: [...module.tasks].sort((left, right) => left.orderIndex - right.orderIndex),
        })),
});

const mapDetailToDraft = (detail: IOnboardingPlanDetailDto): IOnboardingPlanDraft => ({
    id: detail.id,
    name: detail.name,
    description: detail.description,
    targetAudience: detail.targetAudience,
    durationDays: detail.durationDays,
    status: detail.status,
    modules: normalizeModules(
        detail.modules.map((module) => ({
            clientKey: module.id,
            id: module.id,
            name: module.name,
            description: module.description,
            orderIndex: module.orderIndex,
            tasks: module.tasks.map((task) => ({
                clientKey: task.id,
                id: task.id,
                title: task.title,
                description: task.description,
                category: task.category,
                orderIndex: task.orderIndex,
                dueDayOffset: task.dueDayOffset,
                assignmentTarget: task.assignmentTarget,
                acknowledgementRule: task.acknowledgementRule,
            })),
        })),
    ),
});

const createEmptyDraft = (): IOnboardingPlanDraft => ({
    name: "",
    description: "",
    targetAudience: "",
    durationDays: 30,
    status: OnboardingPlanStatus.Draft,
    modules: [],
});

const moveItem = <T,>(items: T[], fromIndex: number, toIndex: number): T[] => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) {
        return items;
    }

    const clonedItems = [...items];
    const [movedItem] = clonedItems.splice(fromIndex, 1);
    clonedItems.splice(toIndex, 0, movedItem);
    return clonedItems;
};

const withDraft = (
    draft: IOnboardingPlanDraft | null | undefined,
    updater: (currentDraft: IOnboardingPlanDraft) => IOnboardingPlanDraft,
): IOnboardingPlanDraft | null => {
    if (!draft) {
        return null;
    }

    return updater(draft);
};

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
            const response = await getAxiosInstance().get(`${ONBOARDING_PLAN_API_BASE}/GetPlans`, {
                params: {
                    ...request,
                    sorting: request.sorting ?? DEFAULT_PLAN_SORTING,
                },
            });
            const data = getApiResult<{ items?: IOnboardingPlanListItemDto[]; totalCount?: number }>(response);

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
            const response = await getAxiosInstance().get(`${ONBOARDING_PLAN_API_BASE}/GetDetail`, {
                params: { id },
            });
            const detail = normalizeDetail(getApiResult<IOnboardingPlanDetailDto>(response));
            dispatch(
                getPlanDetailSuccess({
                    selectedPlan: detail,
                    draftPlan: mapDetailToDraft(detail),
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
            const detail = normalizeDetail(getApiResult<IOnboardingPlanDetailDto>(response));
            dispatch(
                mutationSuccess({
                    selectedPlan: detail,
                    draftPlan: mapDetailToDraft(detail),
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
        dispatch(setDraft(createEmptyDraft()));
    };

    const resetDraft = (): void => {
        dispatch(resetDraftAction());
    };

    const updateDraft = (
        updater: (currentDraft: IOnboardingPlanDraft) => IOnboardingPlanDraft,
    ): void => {
        const updatedDraft = withDraft(state.draftPlan, updater);

        if (!updatedDraft) {
            return;
        }

        dispatch(setDraft(updatedDraft));
    };

    const setDraftMetadata: IOnboardingPlanActionContext["setDraftMetadata"] = (payload) => {
        updateDraft((currentDraft) => ({
            ...currentDraft,
            ...payload,
        }));
    };

    const addModule = (): void => {
        updateDraft((currentDraft) => ({
            ...currentDraft,
            modules: normalizeModules([
                ...currentDraft.modules,
                {
                    clientKey: createClientKey(),
                    name: "",
                    description: "",
                    orderIndex: currentDraft.modules.length + 1,
                    tasks: [],
                },
            ]),
        }));
    };

    const updateModule = (
        moduleClientKey: string,
        name: string,
        description: string,
    ): void => {
        updateDraft((currentDraft) => ({
            ...currentDraft,
            modules: currentDraft.modules.map((module) =>
                module.clientKey === moduleClientKey
                    ? { ...module, name, description }
                    : module,
            ),
        }));
    };

    const removeModule = (moduleClientKey: string): void => {
        updateDraft((currentDraft) => ({
            ...currentDraft,
            modules: normalizeModules(
                currentDraft.modules.filter((module) => module.clientKey !== moduleClientKey),
            ),
        }));
    };

    const moveModule = (
        moduleClientKey: string,
        direction: "up" | "down",
    ): void => {
        updateDraft((currentDraft) => {
            const currentIndex = currentDraft.modules.findIndex(
                (module) => module.clientKey === moduleClientKey,
            );
            const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

            return {
                ...currentDraft,
                modules: normalizeModules(moveItem(currentDraft.modules, currentIndex, targetIndex)),
            };
        });
    };

    const addTask = (
        moduleClientKey: string,
        payload: IOnboardingTaskEditorValues,
    ): void => {
        updateDraft((currentDraft) => ({
            ...currentDraft,
            modules: currentDraft.modules.map((module) =>
                module.clientKey === moduleClientKey
                    ? {
                        ...module,
                        tasks: normalizeTasks([
                            ...module.tasks,
                            {
                                clientKey: createClientKey(),
                                orderIndex: module.tasks.length + 1,
                                ...payload,
                            },
                        ]),
                    }
                    : module,
            ),
        }));
    };

    const updateTask = (
        moduleClientKey: string,
        taskClientKey: string,
        payload: IOnboardingTaskEditorValues,
    ): void => {
        updateDraft((currentDraft) => ({
            ...currentDraft,
            modules: currentDraft.modules.map((module) =>
                module.clientKey === moduleClientKey
                    ? {
                        ...module,
                        tasks: module.tasks.map((task) =>
                            task.clientKey === taskClientKey
                                ? { ...task, ...payload }
                                : task,
                        ),
                    }
                    : module,
            ),
        }));
    };

    const removeTask = (
        moduleClientKey: string,
        taskClientKey: string,
    ): void => {
        updateDraft((currentDraft) => ({
            ...currentDraft,
            modules: currentDraft.modules.map((module) =>
                module.clientKey === moduleClientKey
                    ? {
                        ...module,
                        tasks: normalizeTasks(
                            module.tasks.filter((task) => task.clientKey !== taskClientKey),
                        ),
                    }
                    : module,
            ),
        }));
    };

    const moveTask = (
        moduleClientKey: string,
        taskClientKey: string,
        direction: "up" | "down",
    ): void => {
        updateDraft((currentDraft) => ({
            ...currentDraft,
            modules: currentDraft.modules.map((module) => {
                if (module.clientKey !== moduleClientKey) {
                    return module;
                }

                const currentIndex = module.tasks.findIndex(
                    (task) => task.clientKey === taskClientKey,
                );
                const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

                return {
                    ...module,
                    tasks: normalizeTasks(moveItem(module.tasks, currentIndex, targetIndex)),
                };
            }),
        }));
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
