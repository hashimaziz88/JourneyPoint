import { createContext } from "react";
export type {
    ICreateOnboardingDocumentUploadRequest,
    IExtractedTaskProposalDto,
    IOnboardingDocumentDetailDto,
    IOnboardingDocumentListItemDto,
    IUpdateExtractedTaskProposalRequest,
    OnboardingDocumentStatus,
    ExtractedTaskReviewStatus,
} from "@/types/onboarding-document";
import type {
    ICreateOnboardingDocumentUploadRequest,
    IOnboardingDocumentDetailDto,
    IOnboardingDocumentListItemDto,
    IUpdateExtractedTaskProposalRequest,
} from "@/types/onboarding-document";

export interface IOnboardingDocumentStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isListPending: boolean;
    isDetailPending: boolean;
    isMutationPending: boolean;
    documents?: IOnboardingDocumentListItemDto[] | null;
    selectedDocument?: IOnboardingDocumentDetailDto | null;
}

export interface IOnboardingDocumentActionContext {
    getPlanDocuments: (planId: string) => Promise<void>;
    getDocumentDetail: (documentId: string) => Promise<IOnboardingDocumentDetailDto | null>;
    uploadDocument: (
        payload: ICreateOnboardingDocumentUploadRequest,
    ) => Promise<IOnboardingDocumentDetailDto | null>;
    startExtraction: (documentId: string) => Promise<IOnboardingDocumentDetailDto | null>;
    updateProposal: (
        payload: IUpdateExtractedTaskProposalRequest,
    ) => Promise<IOnboardingDocumentDetailDto | null>;
    acceptProposal: (
        payload: IUpdateExtractedTaskProposalRequest,
    ) => Promise<IOnboardingDocumentDetailDto | null>;
    rejectProposal: (proposalId: string) => Promise<IOnboardingDocumentDetailDto | null>;
    applyAcceptedProposals: (documentId: string) => Promise<IOnboardingDocumentDetailDto | null>;
    resetDocumentState: () => void;
}

export const INITIAL_STATE: IOnboardingDocumentStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    isListPending: false,
    isDetailPending: false,
    isMutationPending: false,
    documents: [],
    selectedDocument: null,
};

export const OnboardingDocumentStateContext =
    createContext<IOnboardingDocumentStateContext>(INITIAL_STATE);
export const OnboardingDocumentActionContext =
    createContext<IOnboardingDocumentActionContext | undefined>(undefined);
