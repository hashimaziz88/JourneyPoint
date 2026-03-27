"use client";

import React, { startTransition, useEffect, useEffectEvent } from "react";
import { Alert, Button, Card, Empty, Space, Tag, Typography, Upload, message } from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { buildFacilitatorPlanDocumentRoute } from "@/constants/auth/routes";
import { useStyles } from "@/components/plans/style/style";
import {
    useOnboardingDocumentActions,
    useOnboardingDocumentState,
} from "@/providers/onboardingDocumentProvider";
import {
    ONBOARDING_DOCUMENT_STATUS_LABELS,
    OnboardingDocumentStatus,
} from "@/types/onboarding-document";
import { OnboardingPlanStatus } from "@/types/onboarding-plan";
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

const formatFileSize = (value: number): string => {
    if (value < 1024) {
        return `${value} B`;
    }

    if (value < 1024 * 1024) {
        return `${(value / 1024).toFixed(1)} KB`;
    }

    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
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

const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== "string") {
                reject(new Error("The uploaded file could not be read."));
                return;
            }

            const base64Content = reader.result.includes(",")
                ? reader.result.split(",")[1]
                : reader.result;
            resolve(base64Content);
        };

        reader.onerror = () => {
            reject(new Error("The uploaded file could not be read."));
        };

        reader.readAsDataURL(file);
    });

interface IDocumentUploadPanelProps {
    planId?: string | null;
    planStatus: OnboardingPlanStatus;
}

/**
 * Handles document upload and document-list access for one onboarding plan.
 */
const DocumentUploadPanel: React.FC<IDocumentUploadPanelProps> = ({
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
    const canUpload = hasSavedPlan && planStatus === OnboardingPlanStatus.Published;

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
        accept: ".pdf,.md,.markdown,text/plain,application/pdf,text/markdown",
        disabled: !canUpload || isMutationPending,
        showUploadList: false,
        beforeUpload: async (file) => {
            if (!planId) {
                messageApi.error("Save and publish the plan before uploading enrichment documents.");
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

    return (
        <Space orientation="vertical" size={16} className={styles.documentPanel}>
            {messageContextHolder}
            <div>
                <Title level={3}>Plan Documents</Title>
                <Paragraph type="secondary">
                    Upload a published plan document for backend extraction and facilitator review.
                    Accepted proposals affect future journeys only.
                </Paragraph>
            </div>

            {!hasSavedPlan ? (
                <Alert
                    className={styles.alert}
                    type="info"
                    showIcon
                    title="Save the draft before adding enrichment documents."
                />
            ) : null}

            {hasSavedPlan && planStatus !== OnboardingPlanStatus.Published ? (
                <Alert
                    className={styles.alert}
                    type="info"
                    showIcon
                    title="Document enrichment is available only for published plans."
                    description="Publish the current draft first, then upload supporting PDF or markdown documents for review."
                />
            ) : null}

            <Card className={styles.documentPanel}>
                <Upload.Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Drop a PDF or markdown file here, or click to browse
                    </p>
                    <p className="ant-upload-hint">
                        Extraction runs on the backend only, and nothing is applied until a facilitator reviews the proposals.
                    </p>
                </Upload.Dragger>
            </Card>

            {isListPending ? (
                <Card className={styles.documentPanel} loading />
            ) : (documents ?? []).length === 0 ? (
                <Empty
                    className={styles.emptyState}
                    description="No enrichment documents have been uploaded for this plan yet."
                />
            ) : (
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
                                        Uploaded {formatDateTime(document.creationTime)}
                                    </Text>
                                    {document.extractionCompletedTime ? (
                                        <Text type="secondary">
                                            Extraction finished {formatDateTime(document.extractionCompletedTime)}
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
            )}
        </Space>
    );
};

export default DocumentUploadPanel;
