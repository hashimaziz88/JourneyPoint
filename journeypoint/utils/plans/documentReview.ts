import type {
    IExtractedTaskProposalDto,
    IOnboardingDocumentDetailDto,
    OnboardingDocumentStatus,
} from "@/types/onboarding-document";
import { OnboardingDocumentStatus as DocumentStatus } from "@/types/onboarding-document";
import type { IDocumentStatusAlertContent } from "@/types/plans/components";

export const formatDocumentDateTime = (value?: string | null): string => {
    if (!value) {
        return "Not available";
    }

    return new Intl.DateTimeFormat("en-ZA", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
};

export const formatFileSize = (value: number): string => {
    if (value < 1024) {
        return `${value} B`;
    }

    if (value < 1024 * 1024) {
        return `${(value / 1024).toFixed(1)} KB`;
    }

    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

export const getDocumentStatusColor = (
    status: OnboardingDocumentStatus,
): "blue" | "green" | "default" | "red" => {
    if (status === DocumentStatus.ReadyForReview) {
        return "blue";
    }

    if (status === DocumentStatus.Applied) {
        return "green";
    }

    if (status === DocumentStatus.Failed) {
        return "red";
    }

    return "default";
};

export const getDocumentStatusAlertContent = (
    document: IOnboardingDocumentDetailDto,
): IDocumentStatusAlertContent => {
    if (document.status === DocumentStatus.Failed) {
        return {
            type: "error",
            title: "Extraction failed for this document.",
            description:
                document.failureReason ?? "Review the uploaded file and try extraction again.",
        };
    }

    if (document.status === DocumentStatus.Applied) {
        return {
            type: "success",
            title: "Accepted proposals have been applied to the onboarding plan.",
            description:
                "Existing generated journeys are unchanged. New journeys will include the accepted tasks.",
        };
    }

    return {
        type: "info",
        title: "Accepted proposals affect future journeys only.",
        description:
            "Nothing is added automatically. Existing journeys remain unchanged even after accepted proposals are applied.",
    };
};

export const findDocumentProposal = (
    proposals: IExtractedTaskProposalDto[] | undefined,
    proposalId: string | null,
): IExtractedTaskProposalDto | null => {
    if (!proposalId) {
        return null;
    }

    return proposals?.find((proposal) => proposal.id === proposalId) ?? null;
};
