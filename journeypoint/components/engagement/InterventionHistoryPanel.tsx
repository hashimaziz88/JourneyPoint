"use client";

import React from "react";
import { Card, Empty, Space, Tag, Typography } from "antd";
import {
    AT_RISK_FLAG_STATUS_COLORS,
    AT_RISK_FLAG_STATUS_LABELS,
    AT_RISK_RESOLUTION_LABELS,
} from "@/constants/engagement/interventions";
import { useStyles } from "@/components/engagement/style/style";
import type { InterventionHistoryPanelProps } from "@/types/engagement/components";
import { formatDisplayDateTime } from "@/utils/date";

const { Paragraph, Text, Title } = Typography;

/**
 * Renders resolved intervention history for one hire.
 */
const InterventionHistoryPanel: React.FC<InterventionHistoryPanelProps> = ({
    resolvedFlags,
}) => {
    const { styles } = useStyles();

    return (
        <Card title="Intervention History" className={styles.panelCard}>
            {resolvedFlags.length > 0 ? (
                <div className={styles.historyList}>
                    {resolvedFlags.map((flag) => (
                        <div key={flag.id} className={styles.historyItem}>
                            <Space orientation="vertical" size={12} className={styles.sectionStack}>
                                <div>
                                    <Title level={5}>
                                        {flag.resolutionType
                                            ? AT_RISK_RESOLUTION_LABELS[flag.resolutionType]
                                            : "Resolved intervention"}
                                    </Title>
                                    <Tag color={AT_RISK_FLAG_STATUS_COLORS[flag.status]}>
                                        {AT_RISK_FLAG_STATUS_LABELS[flag.status]}
                                    </Tag>
                                </div>

                                <Text type="secondary">
                                    Raised {formatDisplayDateTime(flag.raisedAt)} and resolved{" "}
                                    {formatDisplayDateTime(flag.resolvedAt)}
                                </Text>

                                <Paragraph>
                                    Resolved by {flag.resolvedByDisplayName || "System"} with{" "}
                                    {flag.resolutionType
                                        ? AT_RISK_RESOLUTION_LABELS[flag.resolutionType]
                                        : "an unspecified resolution"}
                                    .
                                </Paragraph>

                                {flag.acknowledgedByDisplayName ? (
                                    <Paragraph>
                                        Acknowledged by {flag.acknowledgedByDisplayName} on{" "}
                                        {formatDisplayDateTime(flag.acknowledgedAt)}
                                    </Paragraph>
                                ) : null}

                                {flag.acknowledgementNotes ? (
                                    <div>
                                        <Text type="secondary">Acknowledgement notes</Text>
                                        <Paragraph className={styles.noteText}>
                                            {flag.acknowledgementNotes}
                                        </Paragraph>
                                    </div>
                                ) : null}

                                {flag.resolutionNotes ? (
                                    <div>
                                        <Text type="secondary">Resolution notes</Text>
                                        <Paragraph className={styles.noteText}>
                                            {flag.resolutionNotes}
                                        </Paragraph>
                                    </div>
                                ) : null}
                            </Space>
                        </div>
                    ))}
                </div>
            ) : (
                <Empty
                    className={styles.emptyState}
                    description="No resolved interventions have been recorded yet."
                />
            )}
        </Card>
    );
};

export default InterventionHistoryPanel;
