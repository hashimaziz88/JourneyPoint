import { createContext } from "react";
export type {
    MarkdownImportDraftState,
    MarkdownImportPreviewDto,
    MarkdownImportWarningDto,
    PreviewMarkdownImportRequest,
    SaveMarkdownImportRequest,
} from "@/types/markdown-import/markdown-import";
import type {
    MarkdownImportDraftState,
    MarkdownImportPreviewDto,
} from "@/types/markdown-import/markdown-import";
import type {
    OnboardingPlanDetailDto,
    OnboardingTaskEditorValues,
} from "@/types/onboarding-plan/onboarding-plan";

export interface IMarkdownImportStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isPreviewPending: boolean;
    isSavePending: boolean;
    sourceContent: string;
    sourceFileName?: string | null;
    sourceContentType?: string | null;
    sourceBase64Content?: string | null;
    previewPlan?: MarkdownImportDraftState | null;
}

export interface IMarkdownImportActionContext {
    setSourceContent: (content: string, fileName?: string | null) => void;
    setSourceFile: (payload: {
        fileName: string;
        contentType: string;
        base64Content: string;
        sourceContent?: string | null;
    }) => void;
    previewImport: () => Promise<MarkdownImportPreviewDto | null>;
    saveDraft: () => Promise<OnboardingPlanDetailDto | null>;
    resetImport: () => void;
    setPreviewMetadata: (payload: {
        name?: string;
        description?: string;
        targetAudience?: string;
        durationDays?: number;
    }) => void;
    updatePreviewModule: (
        moduleClientKey: string,
        name: string,
        description: string,
    ) => void;
    removePreviewModule: (moduleClientKey: string) => void;
    updatePreviewTask: (
        moduleClientKey: string,
        taskClientKey: string,
        payload: OnboardingTaskEditorValues,
    ) => void;
    removePreviewTask: (moduleClientKey: string, taskClientKey: string) => void;
}

export const INITIAL_STATE: IMarkdownImportStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    isPreviewPending: false,
    isSavePending: false,
    sourceContent: "",
    sourceFileName: null,
    sourceContentType: null,
    sourceBase64Content: null,
    previewPlan: null,
};

export const MarkdownImportStateContext =
    createContext<IMarkdownImportStateContext>(INITIAL_STATE);
export const MarkdownImportActionContext =
    createContext<IMarkdownImportActionContext | undefined>(undefined);
