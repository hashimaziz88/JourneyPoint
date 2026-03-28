import { handleActions } from "redux-actions";
import { INITIAL_STATE, IOnboardingDocumentStateContext } from "./context";
import { OnboardingDocumentActionEnums } from "./actions";

export const OnboardingDocumentReducer = handleActions<
    IOnboardingDocumentStateContext,
    Partial<IOnboardingDocumentStateContext>
>(
    {
        [OnboardingDocumentActionEnums.getDocumentsPending]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [OnboardingDocumentActionEnums.getDocumentsSuccess]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [OnboardingDocumentActionEnums.getDocumentsError]: (state, action) => ({
            ...state,
            ...action.payload,
        }),

        [OnboardingDocumentActionEnums.getDocumentDetailPending]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [OnboardingDocumentActionEnums.getDocumentDetailSuccess]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [OnboardingDocumentActionEnums.getDocumentDetailError]: (state, action) => ({
            ...state,
            ...action.payload,
        }),

        [OnboardingDocumentActionEnums.mutationPending]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [OnboardingDocumentActionEnums.mutationSuccess]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [OnboardingDocumentActionEnums.mutationError]: (state, action) => ({
            ...state,
            ...action.payload,
        }),

        [OnboardingDocumentActionEnums.resetDocumentState]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
    },
    INITIAL_STATE,
);
