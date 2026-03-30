"use client";

import React from "react";
import { Button, Card, Space, Tag, Typography } from "antd";
import { useStyles } from "@/components/journey/style/style";
import {
    PERSONALISATION_CHANGED_FIELD_LABELS,
    PERSONALISATION_DECISION_COLORS,
    PERSONALISATION_DECISION_LABELS,
} from "@/constants/journey/personalisation";
import type { IPersonalisationDiffCardProps } from "@/types/journey/components";
import { getChangedFieldComparisons } from "@/utils/journey/personalisation";

const { Paragraph, Text, Title } = Typography;

/**
 * Renders one AI-proposed journey-task revision with explicit accept or reject controls.
 */
const PersonalisationDiffCard: React.FC<IPersonalisationDiffCardProps> = ({
    decision,
    diff,
    onDecisionChange,
}) => {
    const { styles } = useStyles();
    const fieldComparisons = getChangedFieldComparisons(diff);

    return (
        <Card className={styles.personalisationDiffCard}>
            <div className={styles.personalisationHeader}>
                <div>
                    <Title level={5} className={styles.taskHeading}>
                        {diff.moduleTitle} · Task {diff.taskOrderIndex}
                    </Title>
                    <Paragraph className={styles.inlineParagraph}>
                        {diff.currentTitle}
                    </Paragraph>
                </div>

                <Space wrap>
                    <Tag color={PERSONALISATION_DECISION_COLORS[decision]}>
                        {PERSONALISATION_DECISION_LABELS[decision]}
                    </Tag>
                    {diff.changedFields.map((field) => (
                        <Tag key={field}>{PERSONALISATION_CHANGED_FIELD_LABELS[field]}</Tag>
                    ))}
                </Space>
            </div>

            <Paragraph type="secondary">
                {diff.rationale || "No rationale was returned for this revision."}
            </Paragraph>

            <div className={styles.beforeAfterGrid}>
                {fieldComparisons.map((comparison) => (
                    <div key={comparison.field} className={styles.comparisonBlock}>
                        <Text strong>{comparison.label}</Text>
                        <div className={styles.comparisonValuePair}>
                            <div>
                                <Text type="secondary">Before</Text>
                                <Paragraph className={styles.inlineParagraph}>
                                    {comparison.currentValue}
                                </Paragraph>
                            </div>
                            <div>
                                <Text type="secondary">After</Text>
                                <Paragraph className={styles.inlineParagraph}>
                                    {comparison.proposedValue}
                                </Paragraph>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Space wrap className={styles.personalisationDecisionRow}>
                <Button
                    type={decision === "accepted" ? "primary" : "default"}
                    onClick={() => onDecisionChange(diff.journeyTaskId, "accepted")}
                >
                    Accept
                </Button>
                <Button
                    danger={decision === "rejected"}
                    type={decision === "rejected" ? "primary" : "default"}
                    onClick={() => onDecisionChange(diff.journeyTaskId, "rejected")}
                >
                    Reject
                </Button>
                <Button onClick={() => onDecisionChange(diff.journeyTaskId, "unreviewed")}>
                    Clear
                </Button>
            </Space>
        </Card>
    );
};

export default PersonalisationDiffCard;
