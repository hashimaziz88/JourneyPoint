"use client";

import React, {
    startTransition,
    useEffect,
    useEffectEvent,
    useMemo,
    useState,
} from "react";
import { Alert, Button, Empty, Space, Spin, Typography, message } from "antd";
import {
    ReloadOutlined,
    RollbackOutlined,
    SaveOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import { buildFacilitatorPlanRoute } from "@/constants/auth/routes";
import ExtractedProposalEditorModal from "@/components/plans/ExtractedProposalEditorModal";
import DocumentReviewProposalPanel from "@/components/plans/DocumentReviewProposalPanel";
import DocumentReviewSummaryCard from "@/components/plans/DocumentReviewSummaryCard";
import { useStyles } from "@/components/plans/style/style";
import {
    useOnboardingDocumentActions,
    useOnboardingDocumentState,
} from "@/providers/onboardingDocumentProvider";
import type { IExtractedTaskProposalEditorValues } from "@/types/onboarding-document";
import {
    OnboardingDocumentStatus,
    ExtractedTaskReviewStatus,
} from "@/types/onboarding-document";
import type {
    IDocumentReviewWorkspaceProps,
    IProposalModalState,
} from "@/types/plans/components";
import { useRouter } from "next/navigation";
import {
    findDocumentProposal,
    getDocumentStatusAlertContent,
} from "@/utils/plans/documentReview";

const { Paragraph, Title } = Typography;

/**
 * Provides facilitator review over one uploaded enrichment document and its proposals.
 */
const DocumentReviewWorkspace: React.FC<IDocumentReviewWorkspaceProps> = ({
    documentId,
    planId,
}) => {
    const { styles } = useStyles();
    const router = useRouter();
    const [messageApi, messageContextHolder] = message.useMessage();
    const {
        acceptProposal,
        applyAcceptedProposals,
        getDocumentDetail,
        rejectProposal,
        resetDocumentState,
        startExtraction,
        updateProposal,
    } = useOnboardingDocumentActions();
    const { isDetailPending, isMutationPending, selectedDocument } =
        useOnboardingDocumentState();
    const [proposalModalState, setProposalModalState] = useState<IProposalModalState | null>(
        null,
    );

    const loadDocumentForEffect = useEffectEvent(async (): Promise<void> => {
        const detail = await getDocumentDetail(documentId);

        if (!detail) {
            messageApi.error("The requested document could not be loaded.");
        }
    });

    const resetWorkspace = useEffectEvent((): void => {
        resetDocumentState();
    });

    useEffect(() => {
        void loadDocumentForEffect();

        return () => {
            resetWorkspace();
        };
    }, [documentId]);

    const editingProposal = useMemo(
        () =>
            findDocumentProposal(
                selectedDocument?.proposals,
                proposalModalState?.proposalId ?? null,
            ),
        [proposalModalState?.proposalId, selectedDocument?.proposals],
    );

    const acceptedProposalCount = useMemo(
        () =>
            selectedDocument?.proposals.filter(
                (proposal) => proposal.reviewStatus === ExtractedTaskReviewStatus.Accepted,
            ).length ?? 0,
        [selectedDocument?.proposals],
    );

    const pendingProposalCount = useMemo(
        () =>
            selectedDocument?.proposals.filter(
                (proposal) => proposal.reviewStatus === ExtractedTaskReviewStatus.Pending,
            ).length ?? 0,
        [selectedDocument?.proposals],
    );

    const handleRefresh = async (): Promise<void> => {
        const detail = await getDocumentDetail(documentId);

        if (!detail) {
            messageApi.error("The requested document could not be loaded.");
        }
    };

    const handleStartExtraction = async (): Promise<void> => {
        const detail = await startExtraction(documentId);

        if (!detail) {
            messageApi.error("Extraction could not be started.");
            return;
        }

        if (detail.status === OnboardingDocumentStatus.Failed) {
            messageApi.error(detail.failureReason ?? "Extraction failed.");
            return;
        }

        messageApi.success("Extraction completed. Review the generated proposals.");
    };

    const handleApplyAcceptedProposals = async (): Promise<void> => {
        const detail = await applyAcceptedProposals(documentId);

        if (!detail) {
            messageApi.error("Accepted proposals could not be applied.");
            return;
        }

        messageApi.success("Accepted proposals were added to the onboarding plan.");
    };

    const handleAcceptAll = async (): Promise<void> => {
        if (!selectedDocument) {
            return;
        }

        const pendingProposals = selectedDocument.proposals.filter(
            (proposal) => proposal.reviewStatus === ExtractedTaskReviewStatus.Pending,
        );

        if (pendingProposals.length === 0) {
            messageApi.info("No pending proposals to accept.");
            return;
        }

        let successCount = 0;
        let failCount = 0;

        for (const proposal of pendingProposals) {
            const payload = {
                proposalId: proposal.id,
                suggestedModuleId: proposal.suggestedModuleId,
                title: proposal.title,
                description: proposal.description,
                category: proposal.category,
                dueDayOffset: proposal.dueDayOffset,
                assignmentTarget: proposal.assignmentTarget,
                acknowledgementRule: proposal.acknowledgementRule,
            };

            const result = await acceptProposal(payload);
            if (result) {
                successCount++;
            } else {
                failCount++;
            }
        }

        if (failCount === 0) {
            messageApi.success(`All ${successCount} proposals accepted.`);
        } else if (successCount === 0) {
            messageApi.error(`Failed to accept all ${failCount} proposals.`);
        } else {
            messageApi.warning(
                `Accepted ${successCount} proposals, but ${failCount} failed.`,
            );
        }
    };

    const handleReject = async (proposalId: string): Promise<void> => {
        const detail = await rejectProposal(proposalId);

        if (!detail) {
            messageApi.error("The proposal could not be rejected.");
            return;
        }

        messageApi.success("Proposal rejected.");
    };

    const handleProposalSubmit = async (
        values: IExtractedTaskProposalEditorValues,
    ): Promise<void> => {
        if (!editingProposal || !proposalModalState) {
            return;
        }

        const payload = {
            proposalId: editingProposal.id,
            suggestedModuleId: values.suggestedModuleId ?? null,
            title: values.title,
            description: values.description,
            category: values.category,
            dueDayOffset: values.dueDayOffset,
            assignmentTarget: values.assignmentTarget,
            acknowledgementRule: values.acknowledgementRule,
        };

        const detail =
            proposalModalState.mode === "accept"
                ? await acceptProposal(payload)
                : await updateProposal(payload);

        if (!detail) {
            messageApi.error(
                proposalModalState.mode === "accept"
                    ? "The proposal could not be accepted."
                    : "The proposal could not be updated.",
            );
            return;
        }

        messageApi.success(
            proposalModalState.mode === "accept"
                ? "Proposal accepted."
                : "Proposal updated.",
        );
        setProposalModalState(null);
    };

    const canRetryExtraction =
        selectedDocument?.status === OnboardingDocumentStatus.Uploaded ||
        selectedDocument?.status === OnboardingDocumentStatus.Failed;

    if (isDetailPending && !selectedDocument) {
        return <Spin size="large" className={styles.loadingWrap} />;
    }

    if (!selectedDocument) {
        return (
            <Empty
                className={styles.emptyState}
                description="The requested enrichment document could not be found."
            />
        );
    }

    const statusAlert = getDocumentStatusAlertContent(selectedDocument);

    return (
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            {messageContextHolder}
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} className={styles.pageHeading}>
                        Document Review
                    </Title>
                    <Paragraph type="secondary">
                        Review extracted task proposals before adding anything to the onboarding plan.
                    </Paragraph>
                </div>

                <Space wrap className={styles.pageActions}>
                    <Button
                        icon={<RollbackOutlined />}
                        onClick={() =>
                            startTransition(() =>
                                router.push(buildFacilitatorPlanRoute(planId)),
                            )
                        }
                    >
                        Back to Plan
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            void handleRefresh();
                        }}
                        loading={isDetailPending}
                    >
                        Refresh
                    </Button>
                    {canRetryExtraction ? (
                        <Button
                            icon={<SyncOutlined />}
                            onClick={() => {
                                void handleStartExtraction();
                            }}
                            loading={isMutationPending}
                        >
                            {selectedDocument.status === OnboardingDocumentStatus.Failed
                                ? "Retry Extraction"
                                : "Start Extraction"}
                        </Button>
                    ) : null}
                    <Button
                        onClick={() => {
                            void handleAcceptAll();
                        }}
                        loading={isMutationPending}
                        disabled={pendingProposalCount === 0}
                    >
                        Accept All ({pendingProposalCount})
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() => {
                            void handleApplyAcceptedProposals();
                        }}
                        loading={isMutationPending}
                        disabled={acceptedProposalCount === 0}
                    >
                        Apply Accepted Proposals
                    </Button>
                </Space>
            </div>

            <Alert
                className={styles.alert}
                type={statusAlert.type}
                showIcon
                title={statusAlert.title}
                description={statusAlert.description}
            />

            <div className={styles.reviewGrid}>
                <DocumentReviewSummaryCard document={selectedDocument} />
                <DocumentReviewProposalPanel
                    availableModules={selectedDocument.availableModules}
                    isPending={isMutationPending}
                    onAccept={(proposalId) =>
                        setProposalModalState({
                            mode: "accept",
                            proposalId,
                        })
                    }
                    onEdit={(proposalId) =>
                        setProposalModalState({
                            mode: "edit",
                            proposalId,
                        })
                    }
                    onReject={handleReject}
                    proposals={selectedDocument.proposals}
                />
            </div>

            <ExtractedProposalEditorModal
                availableModules={selectedDocument.availableModules}
                isPending={isMutationPending}
                isVisible={proposalModalState !== null}
                mode={proposalModalState?.mode ?? "edit"}
                onCancel={() => setProposalModalState(null)}
                onSubmit={handleProposalSubmit}
                proposal={editingProposal}
            />
        </Space>
    );
};

export default DocumentReviewWorkspace;
