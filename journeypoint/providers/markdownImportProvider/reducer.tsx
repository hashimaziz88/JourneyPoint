import { handleActions } from "redux-actions";
import { INITIAL_STATE, IMarkdownImportStateContext } from "./context";
import { MarkdownImportActionEnums } from "./actions";

export const MarkdownImportReducer = handleActions<
    IMarkdownImportStateContext,
    Partial<IMarkdownImportStateContext>
>(
    {
        [MarkdownImportActionEnums.setSource]: (state, action) => ({
            ...state,
            previewPlan: null,
            ...action.payload,
        }),
        [MarkdownImportActionEnums.setSourceFile]: (state, action) => ({
            ...state,
            previewPlan: null,
            ...action.payload,
        }),
        [MarkdownImportActionEnums.previewPending]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [MarkdownImportActionEnums.previewSuccess]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [MarkdownImportActionEnums.previewError]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [MarkdownImportActionEnums.savePending]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [MarkdownImportActionEnums.saveSuccess]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [MarkdownImportActionEnums.saveError]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [MarkdownImportActionEnums.setPreview]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
        [MarkdownImportActionEnums.reset]: (state, action) => ({
            ...state,
            ...action.payload,
        }),
    },
    INITIAL_STATE,
);
