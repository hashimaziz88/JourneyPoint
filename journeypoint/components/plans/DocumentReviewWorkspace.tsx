"use client";

import React, {
    startTransition,
    useEffect,
    useEffectEvent,
    useMemo,
    useState,
} from "react";
import { Alert, Button, Card, Empty, Space, Spin, Tag, Typography, message } from "antd";
import {
    ReloadOutlined,
    RollbackOutlined,
    SaveOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import { buildFacilitatorPlanRoute } from "@/constants/auth/routes";
import ExtractedProposalEditorModal from "@/components/plans/ExtractedProposalEditorModal";
import ExtractedProposalList from "@/components/plans/ExtractedProposalList";
import { useStyles } from "@/components/plans/style/style";
import {
    useOnboardingDocumentActions,
    useOnboardingDocumentState,
} from "@/providers/onboardingDocumentProvider";
import type {
    IExtractedTaskProposalDto,
    IExtractedTaskProposalEditorValues,
} from "@/types/onboarding-document";
import {
    ONBOARDING_DOCUMENT_STATUS_LABELS,
    OnboardingDocumentStatus,
    ExtractedTaskReviewStatus,
} from "@/types/onboarding-document";
import { useRouter } from "next/navigation";

const { Paragraph, Text, Title } = Typography;

const formatDateTime = (value?: string | null): string => {
    if (!value) {
        return "Not available";
    }

    return new Intl.DateTimeFormat("en-ZA", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
};

const getDocumentStatusColor = (
    status: OnboardingDocumentStatus,
): "blue" | "green" | "default" | "red" => {
    if (status === OnboardingDocumentStatus.ReadyForReview) {
        return "blue";
    }

    if (status === OnboardingDocumentStatus.Applied) {
        return "green";
    }

    if (status === OnboardingDocumentStatus.Failed) {
        return "red";
    }

    return "default";
};

const findProposal = (
    proposals: IExtractedTaskProposalDto[] | undefined,
    proposalId: string | null,
): IExtractedTaskProposalDto | null => {
    if (!proposalId) {
        return null;
    }

    return proposals?.find((proposal) => proposal.id === proposalId) ?? null;
};

interface IDocumentReviewWorkspaceProps {
    documentId: string;
    planId: string;
}

interface IProposalModalState {
    mode: "accept" | "edit";
    proposalId: string;
}

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
        () => findProposal(selectedDocument?.proposals, proposalModalState?.proposalId ?? null),
        [proposalModalState?.proposalId, selectedDocument?.proposals],
    );

    const acceptedProposalCount = useMemo(
        () =>
            selectedDocument?.proposals.filter(
                (proposal) => proposal.reviewStatus === ExtractedTaskReviewStatus.Accepted,
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

        messageApi.success("Accepted proposals were added to the published plan.");
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

    return (
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            {messageContextHolder}
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} className={styles.pageHeading}>
                        Document Review
                    </Title>
                    <Paragraph type="secondary">
                        Review extracted task proposals before adding anything to the published plan.
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
                type={
                    selectedDocument.status === OnboardingDocumentStatus.Failed
                        ? "error"
                        : selectedDocument.status === OnboardingDocumentStatus.Applied
                            ? "success"
                            : "info"
                }
                showIcon
                title={
                    selectedDocument.status === OnboardingDocumentStatus.Failed
                        ? "Extraction failed for this document."
                        : selectedDocument.status === OnboardingDocumentStatus.Applied
                            ? "Accepted proposals have been applied to the published plan."
                            : "Accepted proposals affect future journeys only."
                }
                description={
                    selectedDocument.status === OnboardingDocumentStatus.Failed
                        ? selectedDocument.failureReason ??
                            "Review the uploaded file and try extraction again."
                        : selectedDocument.status === OnboardingDocumentStatus.Applied
                            ? "Existing generated journeys are unchanged. New journeys will include the accepted tasks."
                            : "Nothing is added automatically. Existing journeys remain unchanged even after accepted proposals are applied."
                }
            />

            <div className={styles.reviewGrid}>
                <Card>
                    <Space orientation="vertical" size={16} className={styles.pageRoot}>
                        <div className={styles.documentCardHeader}>
                            <div>
                                <Title level={4}>{selectedDocument.fileName}</Title>
                                <Paragraph type="secondary">
                                    {selectedDocument.planName}
                                </Paragraph>
                            </div>

                            <Tag color={getDocumentStatusColor(selectedDocument.status)}>
                                {ONBOARDING_DOCUMENT_STATUS_LABELS[selectedDocument.status]}
                            </Tag>
                        </div>

                        <div className={styles.documentStatGrid}>
                            <div className={styles.statBlock}>
                                <Text type="secondary">Proposals</Text>
                                <Title level={5}>{selectedDocument.extractedTaskCount}</Title>
                            </div>
                            <div className={styles.statBlock}>
                                <Text type="secondary">Accepted</Text>
                                <Title level={5}>{selectedDocument.acceptedTaskCount}</Title>
                            </div>
                            <div className={styles.statBlock}>
                                <Text type="secondary">Applied</Text>
                                <Title level={5}>{selectedDocument.appliedTaskCount}</Title>
                            </div>
                        </div>

                        <Space orientation="vertical" size={8}>
                            <Text type="secondary">
                                Uploaded {formatDateTime(selectedDocument.creationTime)}
                            </Text>
                            <Text type="secondary">
                                Extraction finished {formatDateTime(selectedDocument.extractionCompletedTime)}
                            </Text>
                        </Space>
                    </Space>
                </Card>

                <Card>
                    <Space orientation="vertical" size={16} className={styles.pageRoot}>
                        <div>
                            <Title level={3}>Extracted Task Proposals</Title>
                            <Paragraph type="secondary">
                                Edit or reject noisy suggestions, then accept only the tasks that should be added to the plan.
                            </Paragraph>
                        </div>

                        <ExtractedProposalList
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
                    </Space>
                </Card>
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
