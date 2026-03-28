"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/utils/axiosInstance";
import type {
    ICreateOnboardingDocumentUploadRequest,
    IOnboardingDocumentDetailDto,
    IOnboardingDocumentListItemDto,
    IUpdateExtractedTaskProposalRequest,
} from "@/types/onboarding-document";
import {
    getDocumentDetailError,
    getDocumentDetailPending,
    getDocumentDetailSuccess,
    getDocumentsError,
    getDocumentsPending,
    getDocumentsSuccess,
    mutationError,
    mutationPending,
    mutationSuccess,
    resetDocumentState as resetDocumentStateAction,
} from "./actions";
import {
    INITIAL_STATE,
    IOnboardingDocumentActionContext,
    IOnboardingDocumentStateContext,
    OnboardingDocumentActionContext,
    OnboardingDocumentStateContext,
} from "./context";
import { OnboardingDocumentReducer } from "./reducer";

const ONBOARDING_DOCUMENT_API_BASE = "/api/services/app/OnboardingDocument";

const getApiResult = <T,>(response: { data?: { result?: T } & T }): T =>
    response.data?.result ?? (response.data as T);

const mapDetailToListItem = (
    document: IOnboardingDocumentDetailDto,
): IOnboardingDocumentListItemDto => ({
    id: document.id,
    planId: document.planId,
    fileName: document.fileName,
    contentType: document.contentType,
    fileSizeBytes: document.fileSizeBytes,
    status: document.status,
    extractedTaskCount: document.extractedTaskCount,
    acceptedTaskCount: document.acceptedTaskCount,
    appliedTaskCount: document.appliedTaskCount,
    failureReason: document.failureReason,
    creationTime: document.creationTime,
    extractionCompletedTime: document.extractionCompletedTime,
});

const mergeDocumentIntoList = (
    documents: IOnboardingDocumentListItemDto[] | null | undefined,
    detail: IOnboardingDocumentDetailDto,
): IOnboardingDocumentListItemDto[] => {
    const nextItem = mapDetailToListItem(detail);
    const existingDocuments = documents ?? [];
    const existingIndex = existingDocuments.findIndex(
        (document) => document.id === detail.id,
    );

    if (existingIndex < 0) {
        return [nextItem, ...existingDocuments];
    }

    return existingDocuments.map((document) =>
        document.id === detail.id ? nextItem : document,
    );
};

/**
 * Provides document upload, extraction, and proposal-review state for onboarding plans.
 */
export const OnboardingDocumentProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(OnboardingDocumentReducer, INITIAL_STATE);

    const getPlanDocuments = async (planId: string): Promise<void> => {
        dispatch(getDocumentsPending());

        try {
            const response = await getAxiosInstance().get(
                `${ONBOARDING_DOCUMENT_API_BASE}/GetPlanDocuments`,
                {
                    params: { id: planId },
                },
            );
            const data = getApiResult<{ items?: IOnboardingDocumentListItemDto[] }>(response);
            dispatch(
                getDocumentsSuccess({
                    documents: data.items ?? [],
                }),
            );
        } catch (error) {
            console.error(error);
            dispatch(getDocumentsError());
        }
    };

    const getDocumentDetail = async (
        documentId: string,
    ): Promise<IOnboardingDocumentDetailDto | null> => {
        dispatch(getDocumentDetailPending());

        try {
            const response = await getAxiosInstance().get(
                `${ONBOARDING_DOCUMENT_API_BASE}/GetDetail`,
                {
                    params: { id: documentId },
                },
            );
            const detail = getApiResult<IOnboardingDocumentDetailDto>(response);
            dispatch(getDocumentDetailSuccess({ selectedDocument: detail }));
            return detail;
        } catch (error) {
            console.error(error);
            dispatch(getDocumentDetailError());
            return null;
        }
    };

    const runMutation = async (
        request: Promise<{ data?: { result?: IOnboardingDocumentDetailDto } & IOnboardingDocumentDetailDto }>,
    ): Promise<IOnboardingDocumentDetailDto | null> => {
        dispatch(mutationPending());

        try {
            const response = await request;
            const detail = getApiResult<IOnboardingDocumentDetailDto>(response);
            dispatch(
                mutationSuccess({
                    selectedDocument: detail,
                    documents: mergeDocumentIntoList(state.documents, detail),
                }),
            );
            return detail;
        } catch (error) {
            console.error(error);
            dispatch(mutationError());
            return null;
        }
    };

    const uploadDocument = async (
        payload: ICreateOnboardingDocumentUploadRequest,
    ): Promise<IOnboardingDocumentDetailDto | null> =>
        runMutation(getAxiosInstance().post(`${ONBOARDING_DOCUMENT_API_BASE}/Upload`, payload));

    const startExtraction = async (
        documentId: string,
    ): Promise<IOnboardingDocumentDetailDto | null> =>
        runMutation(
            getAxiosInstance().post(`${ONBOARDING_DOCUMENT_API_BASE}/StartExtraction`, {
                id: documentId,
            }),
        );

    const updateProposal = async (
        payload: IUpdateExtractedTaskProposalRequest,
    ): Promise<IOnboardingDocumentDetailDto | null> =>
        runMutation(
            getAxiosInstance().put(`${ONBOARDING_DOCUMENT_API_BASE}/UpdateProposal`, payload),
        );

    const acceptProposal = async (
        payload: IUpdateExtractedTaskProposalRequest,
    ): Promise<IOnboardingDocumentDetailDto | null> =>
        runMutation(
            getAxiosInstance().post(`${ONBOARDING_DOCUMENT_API_BASE}/AcceptProposal`, payload),
        );

    const rejectProposal = async (
        proposalId: string,
    ): Promise<IOnboardingDocumentDetailDto | null> =>
        runMutation(
            getAxiosInstance().post(`${ONBOARDING_DOCUMENT_API_BASE}/RejectProposal`, {
                id: proposalId,
            }),
        );

    const applyAcceptedProposals = async (
        documentId: string,
    ): Promise<IOnboardingDocumentDetailDto | null> =>
        runMutation(
            getAxiosInstance().post(
                `${ONBOARDING_DOCUMENT_API_BASE}/ApplyAcceptedProposals`,
                { id: documentId },
            ),
        );

    const resetDocumentState = (): void => {
        dispatch(resetDocumentStateAction());
    };

    return (
        <OnboardingDocumentStateContext.Provider value={state}>
            <OnboardingDocumentActionContext.Provider
                value={{
                    getPlanDocuments,
                    getDocumentDetail,
                    uploadDocument,
                    startExtraction,
                    updateProposal,
                    acceptProposal,
                    rejectProposal,
                    applyAcceptedProposals,
                    resetDocumentState,
                }}
            >
                {children}
            </OnboardingDocumentActionContext.Provider>
        </OnboardingDocumentStateContext.Provider>
    );
};

export const useOnboardingDocumentState = (): IOnboardingDocumentStateContext => {
    const context = useContext(OnboardingDocumentStateContext);

    if (context === undefined) {
        throw new Error(
            "useOnboardingDocumentState must be used within an OnboardingDocumentProvider",
        );
    }

    return context;
};

export const useOnboardingDocumentActions = (): IOnboardingDocumentActionContext => {
    const context = useContext(OnboardingDocumentActionContext);

    if (context === undefined) {
        throw new Error(
            "useOnboardingDocumentActions must be used within an OnboardingDocumentProvider",
        );
    }

    return context;
};
