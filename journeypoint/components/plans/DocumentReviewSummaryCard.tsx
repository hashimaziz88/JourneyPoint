"use client";

import React from "react";
import { Card, Space, Tag, Typography } from "antd";
import { useStyles } from "@/components/plans/style/style";
import {
    formatDocumentDateTime,
    getDocumentStatusColor,
} from "@/utils/plans/documentReview";
import {
    ONBOARDING_DOCUMENT_STATUS_LABELS,
} from "@/types/onboarding-document";
import type { IDocumentReviewSummaryCardProps } from "@/types/plans/components";

const { Text, Title } = Typography;

const DocumentReviewSummaryCard: React.FC<IDocumentReviewSummaryCardProps> = ({
    document,
}) => {
    const { styles } = useStyles();

    return (
        <Card>
            <Space orientation="vertical" size={16} className={styles.pageRoot}>
                <div className={styles.documentCardHeader}>
                    <div>
                        <Title level={4}>{document.fileName}</Title>
                        <Typography.Paragraph type="secondary">
                            {document.planName}
                        </Typography.Paragraph>
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
                    <Text type="secondary">
                        Extraction finished {formatDocumentDateTime(
                            document.extractionCompletedTime,
                        )}
                    </Text>
                </Space>
            </Space>
        </Card>
    );
};

export default DocumentReviewSummaryCard;
