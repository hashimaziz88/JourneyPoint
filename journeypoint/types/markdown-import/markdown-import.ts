import type {
    OnboardingModuleDraft,
    OnboardingPlanDraft,
    OnboardingTaskAcknowledgementRule,
    OnboardingTaskAssignmentTarget,
    OnboardingTaskCategory,
} from "@/types/onboarding-plan/onboarding-plan";

export type MarkdownImportWarningDto = {
    code: string;
    message: string;
    lineNumber?: number | null;
    sectionName?: string | null;
};

export type MarkdownImportPreviewTaskDto = {
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    orderIndex: number;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
};

export type MarkdownImportPreviewModuleDto = {
    name: string;
    description: string;
    orderIndex: number;
    tasks: MarkdownImportPreviewTaskDto[];
};

export type MarkdownImportPreviewDto = {
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
    modules: MarkdownImportPreviewModuleDto[];
    warnings: MarkdownImportWarningDto[];
    canSave: boolean;
};

export type PreviewMarkdownImportRequest = {
    markdownContent: string;
    sourceFileName?: string | null;
    sourceContentType?: string | null;
    base64Content?: string | null;
};

export type SaveMarkdownImportRequest = {
    name: string;
    description: string;
    targetAudience: string;
    durationDays: number;
    modules: MarkdownImportPreviewModuleDto[];
};

export type MarkdownImportDraftState = {
    plan: OnboardingPlanDraft | null;
    warnings: MarkdownImportWarningDto[];
    canSave: boolean;
};

export type MarkdownImportModuleTableRow = OnboardingModuleDraft & {
    warningCount?: number;
};
