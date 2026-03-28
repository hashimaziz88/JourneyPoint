import type {
    IOnboardingModuleDraft,
    IOnboardingPlanDraft,
    OnboardingTaskAcknowledgementRule,
    OnboardingTaskAssignmentTarget,
    OnboardingTaskCategory,
} from "@/types/onboarding-plan";

export interface IMarkdownImportWarningDto {
    code: string;
    message: string;
    lineNumber?: number | null;
    sectionName?: string | null;
}

export interface IMarkdownImportPreviewTaskDto {
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    orderIndex: number;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
}

export interface IMarkdownImportPreviewModuleDto {
    name: string;
    description: string;
    orderIndex: number;
    tasks: IMarkdownImportPreviewTaskDto[];
}

export interface IMarkdownImportPreviewDto {
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
    modules: IMarkdownImportPreviewModuleDto[];
    warnings: IMarkdownImportWarningDto[];
    canSave: boolean;
}

export interface IPreviewMarkdownImportRequest {
    markdownContent: string;
    sourceFileName?: string | null;
    sourceContentType?: string | null;
    base64Content?: string | null;
}

export interface ISaveMarkdownImportRequest {
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
    modules: IMarkdownImportPreviewModuleDto[];
}

export interface IMarkdownImportDraftState {
    plan: IOnboardingPlanDraft | null;
    warnings: IMarkdownImportWarningDto[];
    canSave: boolean;
}

export interface IMarkdownImportModuleTableRow extends IOnboardingModuleDraft {
    warningCount?: number;
}
