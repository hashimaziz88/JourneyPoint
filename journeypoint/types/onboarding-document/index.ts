import {
    OnboardingTaskAcknowledgementRule,
    OnboardingTaskAssignmentTarget,
    OnboardingTaskCategory,
} from "@/types/onboarding-plan";

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

export interface ICreateOnboardingDocumentUploadRequest {
    planId: string;
    fileName: string;
    contentType: string;
    base64Content: string;
}

export interface IDocumentModuleOptionDto {
    id: string;
    name: string;
    orderIndex: number;
}

export interface IExtractedTaskProposalDto {
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
}

export interface IOnboardingDocumentListItemDto {
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
}

export interface IOnboardingDocumentDetailDto {
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
    availableModules: IDocumentModuleOptionDto[];
    proposals: IExtractedTaskProposalDto[];
}

export interface IUpdateExtractedTaskProposalRequest {
    proposalId: string;
    suggestedModuleId?: string | null;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
}

export interface IExtractedTaskProposalEditorValues {
    suggestedModuleId?: string | null;
    title: string;
    description: string;
    category: OnboardingTaskCategory;
    dueDayOffset: number;
    assignmentTarget: OnboardingTaskAssignmentTarget;
    acknowledgementRule: OnboardingTaskAcknowledgementRule;
}

export const ONBOARDING_DOCUMENT_STATUS_LABELS: Record<OnboardingDocumentStatus, string> = {
    [OnboardingDocumentStatus.Uploaded]: "Uploaded",
    [OnboardingDocumentStatus.Extracting]: "Extracting",
    [OnboardingDocumentStatus.ReadyForReview]: "Ready for Review",
    [OnboardingDocumentStatus.Applied]: "Applied",
    [OnboardingDocumentStatus.Failed]: "Failed",
};

export const EXTRACTED_TASK_REVIEW_STATUS_LABELS: Record<ExtractedTaskReviewStatus, string> = {
    [ExtractedTaskReviewStatus.Pending]: "Pending",
    [ExtractedTaskReviewStatus.Accepted]: "Accepted",
    [ExtractedTaskReviewStatus.Rejected]: "Rejected",
    [ExtractedTaskReviewStatus.Applied]: "Applied",
};

export const DEFAULT_EXTRACTED_TASK_PROPOSAL_EDITOR_VALUES: IExtractedTaskProposalEditorValues = {
    suggestedModuleId: null,
    title: "",
    description: "",
    category: OnboardingTaskCategory.Orientation,
    dueDayOffset: 0,
    assignmentTarget: OnboardingTaskAssignmentTarget.Enrolee,
    acknowledgementRule: OnboardingTaskAcknowledgementRule.NotRequired,
};
