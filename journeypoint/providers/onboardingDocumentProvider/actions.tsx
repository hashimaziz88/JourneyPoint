import { createAction } from "redux-actions";
import type {
    IOnboardingDocumentDetailDto,
    IOnboardingDocumentListItemDto,
    IOnboardingDocumentStateContext,
} from "./context";

type OnboardingDocumentStatePayload = Partial<IOnboardingDocumentStateContext>;

export enum OnboardingDocumentActionEnums {
    getDocumentsPending = "GET_ONBOARDING_DOCUMENTS_PENDING",
    getDocumentsSuccess = "GET_ONBOARDING_DOCUMENTS_SUCCESS",
    getDocumentsError = "GET_ONBOARDING_DOCUMENTS_ERROR",

    getDocumentDetailPending = "GET_ONBOARDING_DOCUMENT_DETAIL_PENDING",
    getDocumentDetailSuccess = "GET_ONBOARDING_DOCUMENT_DETAIL_SUCCESS",
    getDocumentDetailError = "GET_ONBOARDING_DOCUMENT_DETAIL_ERROR",

    mutationPending = "ONBOARDING_DOCUMENT_MUTATION_PENDING",
    mutationSuccess = "ONBOARDING_DOCUMENT_MUTATION_SUCCESS",
    mutationError = "ONBOARDING_DOCUMENT_MUTATION_ERROR",

    resetDocumentState = "RESET_ONBOARDING_DOCUMENT_STATE",
}

export const getDocumentsPending = createAction<OnboardingDocumentStatePayload>(
    OnboardingDocumentActionEnums.getDocumentsPending,
    () => ({
        isPending: true,
        isListPending: true,
        isDetailPending: false,
        isMutationPending: false,
        isError: false,
        isSuccess: false,
    }),
);

export const getDocumentsSuccess = createAction<
    OnboardingDocumentStatePayload,
    { documents: IOnboardingDocumentListItemDto[] }
>(
    OnboardingDocumentActionEnums.getDocumentsSuccess,
    ({ documents }) => ({
        isPending: false,
        isListPending: false,
        isError: false,
        isSuccess: true,
        documents,
    }),
);

export const getDocumentsError = createAction<OnboardingDocumentStatePayload>(
    OnboardingDocumentActionEnums.getDocumentsError,
    () => ({
        isPending: false,
        isListPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const getDocumentDetailPending = createAction<OnboardingDocumentStatePayload>(
    OnboardingDocumentActionEnums.getDocumentDetailPending,
    () => ({
        isPending: true,
        isListPending: false,
        isDetailPending: true,
        isMutationPending: false,
        isError: false,
        isSuccess: false,
    }),
);

export const getDocumentDetailSuccess = createAction<
    OnboardingDocumentStatePayload,
    { selectedDocument: IOnboardingDocumentDetailDto }
>(
    OnboardingDocumentActionEnums.getDocumentDetailSuccess,
    ({ selectedDocument }) => ({
        isPending: false,
        isDetailPending: false,
        isError: false,
        isSuccess: true,
        selectedDocument,
    }),
);

export const getDocumentDetailError = createAction<OnboardingDocumentStatePayload>(
    OnboardingDocumentActionEnums.getDocumentDetailError,
    () => ({
        isPending: false,
        isDetailPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const mutationPending = createAction<OnboardingDocumentStatePayload>(
    OnboardingDocumentActionEnums.mutationPending,
    () => ({
        isPending: true,
        isMutationPending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const mutationSuccess = createAction<
    OnboardingDocumentStatePayload,
    { selectedDocument: IOnboardingDocumentDetailDto; documents?: IOnboardingDocumentListItemDto[] }
>(
    OnboardingDocumentActionEnums.mutationSuccess,
    ({ selectedDocument, documents }) => ({
        isPending: false,
        isMutationPending: false,
        isError: false,
        isSuccess: true,
        selectedDocument,
        ...(documents ? { documents } : {}),
    }),
);

export const mutationError = createAction<OnboardingDocumentStatePayload>(
    OnboardingDocumentActionEnums.mutationError,
    () => ({
        isPending: false,
        isMutationPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const resetDocumentState = createAction<OnboardingDocumentStatePayload>(
    OnboardingDocumentActionEnums.resetDocumentState,
    () => ({
        isPending: false,
        isListPending: false,
        isDetailPending: false,
        isMutationPending: false,
        isError: false,
        isSuccess: false,
        documents: [],
        selectedDocument: null,
    }),
);
