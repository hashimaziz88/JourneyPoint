import {
    OnboardingTaskAcknowledgementRule,
    OnboardingTaskAssignmentTarget,
    OnboardingTaskCategory,
} from "@/types/onboarding-plan/onboarding-plan";

export enum OnboardingDocumentStatus {
    Uploaded = 1,
    Extracting = 2,
    ReadyForReview = 3,
    Applied = 4,
    Failed = 5,
}

export enum ExtractedTaskReviewStatus {
    Pending = 1,
    Accepted = 2,
    Rejected = 3,
    Applied = 4,
}

export type CreateOnboardingDocumentUploadRequest = {
    planId: string;
    fileName: string;
    contentType: string;
    base64Content: string;
};

export type DocumentModuleOptionDto = {
    id: string;
    name: string;
    orderIndex: number;
};

export type ExtractedTaskProposalDto = {
    id: string;
    suggestedModuleId?: string | null;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
    reviewStatus: ExtractedTaskReviewStatus;
    reviewedByUserId?: number | null;
    reviewedTime?: string | null;
    appliedOnboardingTaskId?: string | null;
};

export type OnboardingDocumentListItemDto = {
    id: string;
    planId: string;
    fileName: string;
    contentType: string;
    fileSizeBytes: number;
    status: OnboardingDocumentStatus;
    extractedTaskCount: number;
    acceptedTaskCount: number;
    appliedTaskCount: number;
    failureReason?: string | null;
    creationTime: string;
    extractionCompletedTime?: string | null;
};

export type OnboardingDocumentDetailDto = {
    id: string;
    planId: string;
    planName: string;
    fileName: string;
    contentType: string;
    fileSizeBytes: number;
    status: OnboardingDocumentStatus;
    extractedTaskCount: number;
    acceptedTaskCount: number;
    appliedTaskCount: number;
    failureReason?: string | null;
    creationTime: string;
    extractionCompletedTime?: string | null;
    availableModules: DocumentModuleOptionDto[];
    proposals: ExtractedTaskProposalDto[];
};

export type UpdateExtractedTaskProposalRequest = {
    proposalId: string;
    suggestedModuleId?: string | null;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
};

export type ExtractedTaskProposalEditorValues = {
    suggestedModuleId?: string | null;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
};
