"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
    IMarkdownImportDraftState,
    IMarkdownImportPreviewDto,
    IMarkdownImportPreviewModuleDto,
    ISaveMarkdownImportRequest,
} from "@/types/markdown-import";
import {
    IOnboardingModuleDraft,
    IOnboardingPlanDetailDto,
    IOnboardingPlanDraft,
    IOnboardingTaskEditorValues,
    OnboardingPlanStatus,
} from "@/types/onboarding-plan";
import {
    previewError,
    previewPending,
    previewSuccess,
    resetImport as resetImportAction,
    saveError,
    savePending,
    saveSuccess,
    setPreview,
    setSource,
} from "./actions";
import {
    INITIAL_STATE,
    IMarkdownImportActionContext,
    IMarkdownImportStateContext,
    MarkdownImportActionContext,
    MarkdownImportStateContext,
} from "./context";
import { MarkdownImportReducer } from "./reducer";

const MARKDOWN_IMPORT_API_BASE = "/api/services/app/MarkdownImport";

const createClientKey = (): string =>
    typeof globalThis.crypto?.randomUUID === "function"
        ? globalThis.crypto.randomUUID()
        : `markdown-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const mapPreviewToDraftState = (
    preview: IMarkdownImportPreviewDto,
): IMarkdownImportDraftState => ({
    plan: {
        name: preview.name,
        description: preview.description,
        targetAudience: preview.targetAudience,
        durationDays: preview.durationDays,
        status: OnboardingPlanStatus.Draft,
        modules: preview.modules.map(mapModuleToDraft),
    },
    warnings: preview.warnings,
    canSave: preview.canSave,
});

const mapModuleToDraft = (
    module: IMarkdownImportPreviewModuleDto,
): IOnboardingModuleDraft => ({
    clientKey: createClientKey(),
    name: module.name,
    description: module.description,
    orderIndex: module.orderIndex,
    tasks: module.tasks.map((task) => ({
        clientKey: createClientKey(),
        title: task.title,
        description: task.description,
        category: task.category,
        orderIndex: task.orderIndex,
        dueDayOffset: task.dueDayOffset,
        assignmentTarget: task.assignmentTarget,
        acknowledgementRule: task.acknowledgementRule,
    })),
});

const mapDraftToSaveRequest = (
    draftPlan: IOnboardingPlanDraft,
): ISaveMarkdownImportRequest => ({
    name: draftPlan.name.trim(),
    description: draftPlan.description.trim(),
    targetAudience: draftPlan.targetAudience.trim(),
    durationDays: draftPlan.durationDays,
    modules: draftPlan.modules.map((module) => ({
        name: module.name.trim(),
        description: module.description.trim(),
        orderIndex: module.orderIndex,
        tasks: module.tasks.map((task) => ({
            title: task.title.trim(),
            description: task.description.trim(),
            category: task.category,
            orderIndex: task.orderIndex,
            dueDayOffset: task.dueDayOffset,
            assignmentTarget: task.assignmentTarget,
            acknowledgementRule: task.acknowledgementRule,
        })),
    })),
});

const updatePreviewDraft = (
    previewState: IMarkdownImportDraftState | null | undefined,
    updater: (draftPlan: IOnboardingPlanDraft) => IOnboardingPlanDraft,
): IMarkdownImportDraftState | null => {
    if (!previewState?.plan) {
        return null;
    }

    const updatedPlan = updater(previewState.plan);
    const canSave =
        !!updatedPlan.name.trim() &&
        !!updatedPlan.description.trim() &&
        !!updatedPlan.targetAudience.trim() &&
        updatedPlan.durationDays >= 1 &&
        updatedPlan.modules.length > 0 &&
        updatedPlan.modules.every((module) => !!module.name.trim()) &&
        updatedPlan.modules.every((module) => !!module.description.trim()) &&
        updatedPlan.modules.every((module) =>
            module.tasks.every(
                (task) => !!task.title.trim() && !!task.description.trim(),
            ),
        );

    return {
        ...previewState,
        plan: updatedPlan,
        canSave,
    };
};

const applyPreviewMetadata = (
    draftPlan: IOnboardingPlanDraft,
    payload: {
        name?: string;
        description?: string;
        targetAudience?: string;
        durationDays?: number;
    },
): IOnboardingPlanDraft => ({
    ...draftPlan,
    ...payload,
});

const applyPreviewModuleChange = (
    draftPlan: IOnboardingPlanDraft,
    moduleClientKey: string,
    name: string,
    description: string,
): IOnboardingPlanDraft => ({
    ...draftPlan,
    modules: draftPlan.modules.map((module) =>
        module.clientKey === moduleClientKey
            ? { ...module, name, description }
            : module,
    ),
});

const removePreviewModuleFromDraft = (
    draftPlan: IOnboardingPlanDraft,
    moduleClientKey: string,
): IOnboardingPlanDraft => ({
    ...draftPlan,
    modules: draftPlan.modules
        .filter((module) => module.clientKey !== moduleClientKey)
        .map((module, index) => ({
            ...module,
            orderIndex: index + 1,
            tasks: module.tasks.map((task, taskIndex) => ({
                ...task,
                orderIndex: taskIndex + 1,
            })),
        })),
});

const updatePreviewTaskInDraft = (
    draftPlan: IOnboardingPlanDraft,
    moduleClientKey: string,
    taskClientKey: string,
    payload: IOnboardingTaskEditorValues,
): IOnboardingPlanDraft => ({
    ...draftPlan,
    modules: draftPlan.modules.map((module) =>
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
});

const removePreviewTaskFromDraft = (
    draftPlan: IOnboardingPlanDraft,
    moduleClientKey: string,
    taskClientKey: string,
): IOnboardingPlanDraft => ({
    ...draftPlan,
    modules: draftPlan.modules.map((module) =>
        module.clientKey === moduleClientKey
            ? {
                ...module,
                tasks: module.tasks
                    .filter((task) => task.clientKey !== taskClientKey)
                    .map((task, index) => ({
                        ...task,
                        orderIndex: index + 1,
                    })),
            }
            : module,
    ),
});

const getApiResult = <T,>(response: { data?: { result?: T } & T }): T =>
    response.data?.result ?? (response.data as T);

/**
 * Provides markdown import preview, review, and save-as-draft state.
 */
export const MarkdownImportProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(MarkdownImportReducer, INITIAL_STATE);

    const setSourceContent = (content: string, fileName?: string | null): void => {
        dispatch(setSource({ sourceContent: content, sourceFileName: fileName ?? null }));
    };

    const previewImport = async (): Promise<IMarkdownImportPreviewDto | null> => {
        dispatch(previewPending());

        try {
            const response = await getAxiosInstance().post(
                `${MARKDOWN_IMPORT_API_BASE}/Preview`,
                {
                    markdownContent: state.sourceContent,
                    sourceFileName: state.sourceFileName,
                },
            );
            const preview = getApiResult<IMarkdownImportPreviewDto>(response);
            dispatch(previewSuccess(mapPreviewToDraftState(preview)));
            return preview;
        } catch (error) {
            console.error(error);
            dispatch(previewError());
            return null;
        }
    };

    const saveDraft = async (): Promise<IOnboardingPlanDetailDto | null> => {
        if (!state.previewPlan?.plan) {
            return null;
        }

        dispatch(savePending());

        try {
            const response = await getAxiosInstance().post(
                `${MARKDOWN_IMPORT_API_BASE}/SaveDraft`,
                mapDraftToSaveRequest(state.previewPlan.plan),
            );
            const detail = getApiResult<IOnboardingPlanDetailDto>(response);
            dispatch(saveSuccess());
            return detail;
        } catch (error) {
            console.error(error);
            dispatch(saveError());
            return null;
        }
    };

    const resetImport = (): void => {
        dispatch(resetImportAction());
    };

    const updatePreview = (
        updater: (draftPlan: IOnboardingPlanDraft) => IOnboardingPlanDraft,
    ): void => {
        const updatedPreview = updatePreviewDraft(state.previewPlan, updater);

        if (!updatedPreview) {
            return;
        }

        dispatch(setPreview(updatedPreview));
    };

    const setPreviewMetadata: IMarkdownImportActionContext["setPreviewMetadata"] = (
        payload,
    ) => {
        updatePreview((draftPlan) => applyPreviewMetadata(draftPlan, payload));
    };

    const updatePreviewModule: IMarkdownImportActionContext["updatePreviewModule"] = (
        moduleClientKey,
        name,
        description,
    ) => {
        updatePreview((draftPlan) =>
            applyPreviewModuleChange(draftPlan, moduleClientKey, name, description),
        );
    };

    const removePreviewModule = (moduleClientKey: string): void => {
        updatePreview((draftPlan) =>
            removePreviewModuleFromDraft(draftPlan, moduleClientKey),
        );
    };

    const updatePreviewTask = (
        moduleClientKey: string,
        taskClientKey: string,
        payload: IOnboardingTaskEditorValues,
    ): void => {
        updatePreview((draftPlan) =>
            updatePreviewTaskInDraft(
                draftPlan,
                moduleClientKey,
                taskClientKey,
                payload,
            ),
        );
    };

    const removePreviewTask = (
        moduleClientKey: string,
        taskClientKey: string,
    ): void => {
        updatePreview((draftPlan) =>
            removePreviewTaskFromDraft(
                draftPlan,
                moduleClientKey,
                taskClientKey,
            ),
        );
    };

    return (
        <MarkdownImportStateContext.Provider value={state}>
            <MarkdownImportActionContext.Provider
                value={{
                    setSourceContent,
                    previewImport,
                    saveDraft,
                    resetImport,
                    setPreviewMetadata,
                    updatePreviewModule,
                    removePreviewModule,
                    updatePreviewTask,
                    removePreviewTask,
                }}
            >
                {children}
            </MarkdownImportActionContext.Provider>
        </MarkdownImportStateContext.Provider>
    );
};

export const useMarkdownImportState = (): IMarkdownImportStateContext => {
    const context = useContext(MarkdownImportStateContext);

    if (context === undefined) {
        throw new Error(
            "useMarkdownImportState must be used within a MarkdownImportProvider",
        );
    }

    return context;
};

export const useMarkdownImportActions = (): IMarkdownImportActionContext => {
    const context = useContext(MarkdownImportActionContext);

    if (context === undefined) {
        throw new Error(
            "useMarkdownImportActions must be used within a MarkdownImportProvider",
        );
    }

    return context;
};
