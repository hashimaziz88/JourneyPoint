import { createContext } from "react";
export type {
    CreateOnboardingDocumentUploadRequest,
    ExtractedTaskProposalDto,
    OnboardingDocumentDetailDto,
    OnboardingDocumentListItemDto,
    UpdateExtractedTaskProposalRequest,
    OnboardingDocumentStatus,
    ExtractedTaskReviewStatus,
} from "@/types/onboarding-document/onboarding-document";
import type {
    CreateOnboardingDocumentUploadRequest,
    OnboardingDocumentDetailDto,
    OnboardingDocumentListItemDto,
    UpdateExtractedTaskProposalRequest,
} from "@/types/onboarding-document/onboarding-document";

export interface IOnboardingDocumentStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isListPending: boolean;
    isDetailPending: boolean;
    isMutationPending: boolean;
    documents?: OnboardingDocumentListItemDto[] | null;
    selectedDocument?: OnboardingDocumentDetailDto | null;
}

export interface IOnboardingDocumentActionContext {
    getPlanDocuments: (planId: string) => Promise<void>;
    getDocumentDetail: (documentId: string) => Promise<OnboardingDocumentDetailDto | null>;
    uploadDocument: (
        payload: CreateOnboardingDocumentUploadRequest,
    ) => Promise<OnboardingDocumentDetailDto | null>;
    startExtraction: (documentId: string) => Promise<OnboardingDocumentDetailDto | null>;
    updateProposal: (
        payload: UpdateExtractedTaskProposalRequest,
    ) => Promise<OnboardingDocumentDetailDto | null>;
    acceptProposal: (
        payload: UpdateExtractedTaskProposalRequest,
    ) => Promise<OnboardingDocumentDetailDto | null>;
    rejectProposal: (proposalId: string) => Promise<OnboardingDocumentDetailDto | null>;
    applyAcceptedProposals: (documentId: string) => Promise<OnboardingDocumentDetailDto | null>;
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
