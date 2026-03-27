import { createContext } from "react";
export type {
    IMarkdownImportDraftState,
    IMarkdownImportPreviewDto,
    IMarkdownImportWarningDto,
    IPreviewMarkdownImportRequest,
    ISaveMarkdownImportRequest,
} from "@/types/markdown-import";
import type {
    IMarkdownImportDraftState,
    IMarkdownImportPreviewDto,
} from "@/types/markdown-import";
import type {
    IOnboardingPlanDetailDto,
    IOnboardingTaskEditorValues,
} from "@/types/onboarding-plan";

export interface IMarkdownImportStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isPreviewPending: boolean;
    isSavePending: boolean;
    sourceContent: string;
    sourceFileName?: string | null;
    previewPlan?: IMarkdownImportDraftState | null;
}

export interface IMarkdownImportActionContext {
    setSourceContent: (content: string, fileName?: string | null) => void;
    previewImport: () => Promise<IMarkdownImportPreviewDto | null>;
    saveDraft: () => Promise<IOnboardingPlanDetailDto | null>;
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
        payload: IOnboardingTaskEditorValues,
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
    previewPlan: null,
};

export const MarkdownImportStateContext =
    createContext<IMarkdownImportStateContext>(INITIAL_STATE);
export const MarkdownImportActionContext =
    createContext<IMarkdownImportActionContext | undefined>(undefined);
