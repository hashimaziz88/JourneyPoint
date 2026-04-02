"use client";

import React, { startTransition, useEffect, useEffectEvent } from "react";
import { Alert, Button, Card, Empty, Space, Tag, Typography, Upload, message } from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { buildFacilitatorPlanDocumentRoute } from "@/routes/auth.routes";
import { useStyles } from "@/components/plans/style/style";
import {
    useOnboardingDocumentActions,
    useOnboardingDocumentState,
} from "@/providers/onboardingDocumentProvider";
import {
    OnboardingDocumentStatus,
} from "@/types/onboarding-document/onboarding-document"
import {
    ONBOARDING_DOCUMENT_STATUS_LABELS,
} from "@/constants/plans/onboarding-document";
import { OnboardingPlanStatus } from "@/types/onboarding-plan/onboarding-plan";
import type { DocumentUploadPanelProps } from "@/types/plans/components";
import {
    formatDocumentDateTime,
    formatFileSize,
    getDocumentStatusColor,
} from "@/utils/plans/documentReview";
import { readFileAsBase64 } from "@/utils/plans/fileUpload";
import { useRouter } from "next/navigation";

const { Paragraph, Text, Title } = Typography;

/**
 * Handles document upload and document-list access for one onboarding plan.
 */
const DocumentUploadPanel: React.FC<DocumentUploadPanelProps> = ({
    planId,
    planStatus,
}) => {
    const { styles } = useStyles();
    const router = useRouter();
    const [messageApi, messageContextHolder] = message.useMessage();
    const {
        getPlanDocuments,
        resetDocumentState,
        startExtraction,
        uploadDocument,
    } = useOnboardingDocumentActions();
    const { documents, isListPending, isMutationPending } = useOnboardingDocumentState();
    const hasSavedPlan = Boolean(planId);
    const canUpload = hasSavedPlan && planStatus === OnboardingPlanStatus.Draft;

    const loadDocuments = useEffectEvent(async (): Promise<void> => {
        if (!planId) {
            return;
        }

        await getPlanDocuments(planId);
    });

    const resetDocuments = useEffectEvent((): void => {
        resetDocumentState();
    });

    useEffect(() => {
        void loadDocuments();

        return () => {
            resetDocuments();
        };
    }, [planId]);

    const handleOpenReview = (documentId: string): void => {
        if (!planId) {
            return;
        }

        startTransition(() => {
            router.push(buildFacilitatorPlanDocumentRoute(planId, documentId));
        });
    };

    const uploadProps: UploadProps = {
        accept: ".pdf,.md,.markdown,.txt,.png,.jpg,.jpeg,.webp,text/plain,application/pdf,text/markdown,image/png,image/jpeg,image/webp",
        disabled: !canUpload || isMutationPending,
        showUploadList: false,
        beforeUpload: async (file) => {
            if (!planId) {
                messageApi.error("Save the plan before uploading enrichment documents.");
                return Upload.LIST_IGNORE;
            }

            try {
                const base64Content = await readFileAsBase64(file);
                const uploadedDocument = await uploadDocument({
                    planId,
                    fileName: file.name,
                    contentType: file.type || "application/octet-stream",
                    base64Content,
                });

                if (!uploadedDocument) {
                    messageApi.error("The document could not be uploaded.");
                    return Upload.LIST_IGNORE;
                }

                const extractedDocument = await startExtraction(uploadedDocument.id);

                if (!extractedDocument) {
                    messageApi.error("The document was uploaded, but extraction could not be started.");
                    await getPlanDocuments(planId);
                    return Upload.LIST_IGNORE;
                }

                if (extractedDocument.status === OnboardingDocumentStatus.Failed) {
                    messageApi.error(
                        extractedDocument.failureReason ??
                        "Extraction failed. Open the document review page for details.",
                    );
                } else {
                    messageApi.success("Document uploaded and extraction started.");
                }

                await getPlanDocuments(planId);
                handleOpenReview(extractedDocument.id);
            } catch (error) {
                console.error(error);
                messageApi.error("The document could not be prepared for upload.");
            }

            return Upload.LIST_IGNORE;
        },
    };

    let documentContent: React.ReactNode;
    if (isListPending) {
        documentContent = <Card className={styles.documentPanel} loading />;
    } else if ((documents ?? []).length === 0) {
        documentContent = (
            <Empty
                className={styles.emptyState}
                description="No enrichment documents have been uploaded for this plan yet."
            />
        );
    } else {
        documentContent = (
            <div className={styles.documentList}>
                {(documents ?? []).map((document) => (
                    <Card key={document.id} className={styles.documentCard}>
                        <div className={styles.documentCardBody}>
                            <div className={styles.documentCardHeader}>
                                <div>
                                    <Title level={4}>{document.fileName}</Title>
                                    <Text type="secondary">
                                        {formatFileSize(document.fileSizeBytes)}
                                    </Text>
                                </div>

                                <Tag color={getDocumentStatusColor(document.status)}>
                                    {ONBOARDING_DOCUMENT_STATUS_LABELS[document.status]}
                                </Tag>
                            </div>

                            <div className={styles.documentStatGrid}>
                                <div className={styles.statBlock}>
                                    <Text type="secondary">Proposals</Text>
                                    <Title level={5}>{document.extractedTaskCount}</Title>
                                </div>
                                <div className={styles.statBlock}>
                                    <Text type="secondary">Accepted</Text>
                                    <Title level={5}>{document.acceptedTaskCount}</Title>
                                </div>
                                <div className={styles.statBlock}>
                                    <Text type="secondary">Applied</Text>
                                    <Title level={5}>{document.appliedTaskCount}</Title>
                                </div>
                            </div>

                            <Space orientation="vertical" size={8}>
                                <Text type="secondary">
                                    Uploaded {formatDocumentDateTime(document.creationTime)}
                                </Text>
                                {document.extractionCompletedTime ? (
                                    <Text type="secondary">
                                        Extraction finished {formatDocumentDateTime(document.extractionCompletedTime)}
                                    </Text>
                                ) : null}
                                {document.failureReason ? (
                                    <Text type="danger">{document.failureReason}</Text>
                                ) : null}
                            </Space>

                            <Space wrap className={styles.documentCardActions}>
                                <Button onClick={() => handleOpenReview(document.id)}>
                                    Open Review
                                </Button>
                            </Space>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <Space orientation="vertical" size={16} className={styles.documentPanel}>
            {messageContextHolder}
            <div>
                <Title level={3}>Plan Enrichment Documents</Title>
                <Paragraph type="secondary">
                    Upload a saved plan document for backend extraction and HR Facilitator review.
                    Accepted proposals affect future journeys only.
                </Paragraph>
            </div>

            {hasSavedPlan ? null : (
                <Alert
                    className={styles.alert}
                    type="info"
                    showIcon
                    title="Save the draft before adding enrichment documents."
                />
            )}

            {hasSavedPlan && planStatus === OnboardingPlanStatus.Archived ? (
                <Alert
                    className={styles.alert}
                    type="info"
                    showIcon
                    title="Archived plans cannot receive new enrichment documents."
                    description="Clone the plan or reopen the content in a draft workflow before uploading supporting documents for review."
                />
            ) : null}

            {hasSavedPlan && planStatus === OnboardingPlanStatus.Published ? (
                <Alert
                    className={styles.alert}
                    type="info"
                    showIcon
                    title="Published plans cannot receive new enrichment documents."
                    description="Clone the plan to create a draft version before uploading supporting documents for review."
                />
            ) : null}

            <Card className={styles.documentPanel}>
                <Upload.Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Drop a PDF, markdown, text, or image file here, or click to browse
                    </p>
                    <p className="ant-upload-hint">
                        Extraction runs on the backend only, and nothing is applied until an HR Facilitator reviews the proposals.
                    </p>
                </Upload.Dragger>
            </Card>

            {documentContent}
        </Space>
    );
};

export default DocumentUploadPanel;
