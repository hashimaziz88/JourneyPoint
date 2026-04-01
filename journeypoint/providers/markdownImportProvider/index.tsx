"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/utils/axiosInstance";
import type { MarkdownImportPreviewDto } from "@/types/markdown-import/markdown-import";
import type { OnboardingPlanDetailDto } from "@/types/onboarding-plan/onboarding-plan";
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
    setSourceFile as setSourceFileAction,
} from "./actions";
import {
    INITIAL_STATE,
    type IMarkdownImportActionContext,
    type IMarkdownImportStateContext,
    MarkdownImportActionContext,
    MarkdownImportStateContext,
} from "./context";
import { MarkdownImportReducer } from "./reducer";
import {
    applyMarkdownPreviewMetadata,
    mapMarkdownDraftToSaveRequest,
    mapMarkdownPreviewToDraftState,
    removeMarkdownPreviewModule,
    removeMarkdownPreviewTask,
    updateMarkdownPreviewDraft,
    updateMarkdownPreviewModule,
    updateMarkdownPreviewTask,
} from "@/utils/plans/markdownImportDraft";

const MARKDOWN_IMPORT_API_BASE = "/api/services/app/MarkdownImport";

const getApiResult = <T,>(response: { data?: { result?: T } & T }): T =>
    response.data?.result ?? (response.data as T);

/**
 * Provides document import preview, review, and save-as-draft state.
 */
export const MarkdownImportProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(MarkdownImportReducer, INITIAL_STATE);

    const setSourceContent = (content: string, fileName?: string | null): void => {
        dispatch(setSource({
            sourceContent: content,
            sourceFileName: fileName ?? null,
            sourceContentType: "text/markdown",
        }));
    };

    const setSourceFile: IMarkdownImportActionContext["setSourceFile"] = ({
        fileName,
        contentType,
        base64Content,
        sourceContent,
    }) => {
        dispatch(setSourceFileAction({
            sourceFileName: fileName,
            sourceContentType: contentType,
            sourceBase64Content: base64Content,
            sourceContent: sourceContent ?? "",
        }));
    };

    const previewImport = async (): Promise<MarkdownImportPreviewDto | null> => {
        dispatch(previewPending());

        try {
            const response = await getAxiosInstance().post(
                `${MARKDOWN_IMPORT_API_BASE}/Preview`,
                {
                    markdownContent: state.sourceContent,
                    sourceFileName: state.sourceFileName,
                    sourceContentType: state.sourceContentType,
                    base64Content: state.sourceBase64Content,
                },
            );
            const preview = getApiResult<MarkdownImportPreviewDto>(response);
            dispatch(previewSuccess(mapMarkdownPreviewToDraftState(preview)));
            return preview;
        } catch (error) {
            console.error(error);
            dispatch(previewError());
            return null;
        }
    };

    const saveDraft = async (): Promise<OnboardingPlanDetailDto | null> => {
        if (!state.previewPlan?.plan) {
            return null;
        }

        dispatch(savePending());

        try {
            const response = await getAxiosInstance().post(
                `${MARKDOWN_IMPORT_API_BASE}/SaveDraft`,
                mapMarkdownDraftToSaveRequest(state.previewPlan.plan),
            );
            const detail = getApiResult<OnboardingPlanDetailDto>(response);
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
        updater: Parameters<typeof updateMarkdownPreviewDraft>[1],
    ): void => {
        const updatedPreview = updateMarkdownPreviewDraft(state.previewPlan, updater);

        if (!updatedPreview) {
            return;
        }

        dispatch(setPreview(updatedPreview));
    };

    const setPreviewMetadata: IMarkdownImportActionContext["setPreviewMetadata"] = (
        payload,
    ) => {
        updatePreview((draftPlan) => applyMarkdownPreviewMetadata(draftPlan, payload));
    };

    const updatePreviewModule: IMarkdownImportActionContext["updatePreviewModule"] = (
        moduleClientKey,
        name,
        description,
    ) => {
        updatePreview((draftPlan) =>
            updateMarkdownPreviewModule(draftPlan, moduleClientKey, name, description),
        );
    };

    const removePreviewModule = (moduleClientKey: string): void => {
        updatePreview((draftPlan) =>
            removeMarkdownPreviewModule(draftPlan, moduleClientKey),
        );
    };

    const updatePreviewTask = (
        moduleClientKey: string,
        taskClientKey: string,
        payload: IMarkdownImportActionContext["updatePreviewTask"] extends (
            moduleKey: string,
            taskKey: string,
            values: infer TPayload,
        ) => void
            ? TPayload
            : never,
    ): void => {
        updatePreview((draftPlan) =>
            updateMarkdownPreviewTask(
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
            removeMarkdownPreviewTask(draftPlan, moduleClientKey, taskClientKey),
        );
    };

    return (
        <MarkdownImportStateContext.Provider value={state}>
            <MarkdownImportActionContext.Provider
                value={{
                    setSourceContent,
                    setSourceFile,
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
