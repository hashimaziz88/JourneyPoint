import {
    OnboardingTaskAcknowledgementRule,
    OnboardingTaskAssignmentTarget,
    OnboardingTaskCategory,
} from "@/types/onboarding-plan/onboarding-plan";
import {
    ExtractedTaskReviewStatus,
    OnboardingDocumentStatus,
    type ExtractedTaskProposalEditorValues,
} from "@/types/onboarding-document/onboarding-document";

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

export const DEFAULT_EXTRACTED_TASK_PROPOSAL_EDITOR_VALUES: ExtractedTaskProposalEditorValues = {
    suggestedModuleId: null,
    title: "",
    description: "",
    category: OnboardingTaskCategory.Orientation,
    dueDayOffset: 0,
    assignmentTarget: OnboardingTaskAssignmentTarget.Enrolee,
    acknowledgementRule: OnboardingTaskAcknowledgementRule.NotRequired,
};
