import type {
    ExtractedTaskReviewStatus,
    ExtractedTaskProposalDto,
    ExtractedTaskProposalEditorValues,
} from "@/types/onboarding-document/onboarding-document";
import {
    ExtractedTaskReviewStatus as ProposalReviewStatus,
} from "@/types/onboarding-document/onboarding-document"
import {
    DEFAULT_EXTRACTED_TASK_PROPOSAL_EDITOR_VALUES,
} from "@/constants/plans/onboarding-document";

export const mapProposalToEditorValues = (
    proposal?: ExtractedTaskProposalDto | null,
): ExtractedTaskProposalEditorValues => {
    if (!proposal) {
        return DEFAULT_EXTRACTED_TASK_PROPOSAL_EDITOR_VALUES;
    }

    return {
        suggestedModuleId: proposal.suggestedModuleId ?? null,
        title: proposal.title,
        description: proposal.description,
        category: proposal.category,
        dueDayOffset: proposal.dueDayOffset,
        assignmentTarget: proposal.assignmentTarget,
        acknowledgementRule: proposal.acknowledgementRule,
    };
};

export const getProposalStatusColor = (
    status: ExtractedTaskReviewStatus,
): "blue" | "green" | "red" | "default" => {
    if (status === ProposalReviewStatus.Accepted) {
        return "green";
    }

    if (status === ProposalReviewStatus.Rejected) {
        return "red";
    }

    if (status === ProposalReviewStatus.Pending) {
        return "blue";
    }

    return "default";
};
