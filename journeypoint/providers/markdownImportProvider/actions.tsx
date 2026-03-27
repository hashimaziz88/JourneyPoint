import { createAction } from "redux-actions";
import type { IMarkdownImportDraftState } from "@/types/markdown-import";
import type { IMarkdownImportStateContext } from "./context";

type MarkdownImportStatePayload = Partial<IMarkdownImportStateContext>;

export enum MarkdownImportActionEnums {
    setSource = "SET_MARKDOWN_IMPORT_SOURCE",
    previewPending = "PREVIEW_MARKDOWN_IMPORT_PENDING",
    previewSuccess = "PREVIEW_MARKDOWN_IMPORT_SUCCESS",
    previewError = "PREVIEW_MARKDOWN_IMPORT_ERROR",
    savePending = "SAVE_MARKDOWN_IMPORT_PENDING",
    saveSuccess = "SAVE_MARKDOWN_IMPORT_SUCCESS",
    saveError = "SAVE_MARKDOWN_IMPORT_ERROR",
    setPreview = "SET_MARKDOWN_IMPORT_PREVIEW",
    reset = "RESET_MARKDOWN_IMPORT",
}

export const setSource = createAction<
    MarkdownImportStatePayload,
    { sourceContent: string; sourceFileName?: string | null }
>(
    MarkdownImportActionEnums.setSource,
    ({ sourceContent, sourceFileName }) => ({
        sourceContent,
        sourceFileName: sourceFileName ?? null,
    }),
);

export const previewPending = createAction<MarkdownImportStatePayload>(
    MarkdownImportActionEnums.previewPending,
    () => ({
        isPending: true,
        isPreviewPending: true,
        isSavePending: false,
        isError: false,
        isSuccess: false,
    }),
);

export const previewSuccess = createAction<
    MarkdownImportStatePayload,
    IMarkdownImportDraftState
>(
    MarkdownImportActionEnums.previewSuccess,
    (previewPlan) => ({
        isPending: false,
        isPreviewPending: false,
        isError: false,
        isSuccess: true,
        previewPlan,
    }),
);

export const previewError = createAction<MarkdownImportStatePayload>(
    MarkdownImportActionEnums.previewError,
    () => ({
        isPending: false,
        isPreviewPending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const savePending = createAction<MarkdownImportStatePayload>(
    MarkdownImportActionEnums.savePending,
    () => ({
        isPending: true,
        isSavePending: true,
        isError: false,
        isSuccess: false,
    }),
);

export const saveSuccess = createAction<MarkdownImportStatePayload>(
    MarkdownImportActionEnums.saveSuccess,
    () => ({
        isPending: false,
        isSavePending: false,
        isError: false,
        isSuccess: true,
    }),
);

export const saveError = createAction<MarkdownImportStatePayload>(
    MarkdownImportActionEnums.saveError,
    () => ({
        isPending: false,
        isSavePending: false,
        isError: true,
        isSuccess: false,
    }),
);

export const setPreview = createAction<
    MarkdownImportStatePayload,
    IMarkdownImportDraftState | null
>(
    MarkdownImportActionEnums.setPreview,
    (previewPlan) => ({ previewPlan }),
);

export const resetImport = createAction<MarkdownImportStatePayload>(
    MarkdownImportActionEnums.reset,
    () => ({
        isPending: false,
        isPreviewPending: false,
        isSavePending: false,
        isError: false,
        isSuccess: false,
        sourceContent: "",
        sourceFileName: null,
        previewPlan: null,
    }),
);
