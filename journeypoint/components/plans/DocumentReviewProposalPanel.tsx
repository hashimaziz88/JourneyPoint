"use client";

import React from "react";
import { Card, Space, Typography } from "antd";
import ExtractedProposalList from "@/components/plans/ExtractedProposalList";
import { useStyles } from "@/components/plans/style/style";
import type { IDocumentReviewProposalPanelProps } from "@/types/plans/components";

const { Paragraph, Title } = Typography;

const DocumentReviewProposalPanel: React.FC<IDocumentReviewProposalPanelProps> = ({
    availableModules,
    isPending,
    onAccept,
    onEdit,
    onReject,
    proposals,
}) => {
    const { styles } = useStyles();

    return (
        <Card>
            <Space orientation="vertical" size={16} className={styles.pageRoot}>
                <div>
                    <Title level={3}>Extracted Task Proposals</Title>
                    <Paragraph type="secondary">
                        Edit or reject noisy suggestions, then accept only the tasks that should be added to the plan.
                    </Paragraph>
                </div>

                <ExtractedProposalList
                    availableModules={availableModules}
                    isPending={isPending}
                    onAccept={onAccept}
                    onEdit={onEdit}
                    onReject={onReject}
                    proposals={proposals}
                />
            </Space>
        </Card>
    );
};

export default DocumentReviewProposalPanel;
