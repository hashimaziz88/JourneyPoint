"use client";

import React from "react";
import { Button, Progress, Typography } from "antd";
import EngagementBadge from "@/components/engagement/EngagementBadge";
import { useStyles } from "@/components/pipeline/style/style";
import type { IHirePipelineCardProps } from "@/types/pipeline/components";
import { formatDisplayDate } from "@/utils/date";
import { formatPercentage } from "@/utils/pipeline/board";

const { Paragraph, Text, Title } = Typography;

/**
 * Renders one facilitator pipeline card with drill-in actions and engagement status.
 */
const HirePipelineCard: React.FC<IHirePipelineCardProps> = ({
    hire,
    onOpenHire,
    onOpenJourney,
}) => {
    const { styles, cx } = useStyles();

    return (
        <div
            className={cx(
                styles.pipelineCard,
                hire.hasActiveAtRiskFlag ? styles.pipelineCardFlagged : undefined,
            )}
        >
            <div className={styles.cardHeader}>
                <div>
                    <Title level={5}>{hire.fullName}</Title>
                    <Paragraph type="secondary">{hire.emailAddress}</Paragraph>
                </div>
                <EngagementBadge
                    classification={hire.classification}
                    compositeScore={hire.compositeScore}
                    hasActiveAtRiskFlag={hire.hasActiveAtRiskFlag}
                />
            </div>

            <div className={styles.cardMetaGrid}>
                <div className={styles.statTile}>
                    <Text type="secondary">Current stage</Text>
                    <Title level={5}>{hire.currentStageTitle}</Title>
                </div>
                <div className={styles.statTile}>
                    <Text type="secondary">Start date</Text>
                    <Title level={5}>{formatDisplayDate(hire.startDate)}</Title>
                </div>
                <div className={styles.statTile}>
                    <Text type="secondary">Role title</Text>
                    <Title level={5}>{hire.roleTitle || "Not supplied"}</Title>
                </div>
                <div className={styles.statTile}>
                    <Text type="secondary">Department</Text>
                    <Title level={5}>{hire.department || "Not supplied"}</Title>
                </div>
            </div>

            <div className={styles.progressWrap}>
                <Text type="secondary">
                    Completion {formatPercentage(hire.completionRate)}
                </Text>
                <Progress percent={Math.round(hire.completionRate)} showInfo={false} />
            </div>

            <div className={styles.actionRow}>
                <Button onClick={() => onOpenHire(hire.hireId)}>Open Hire</Button>
                <Button type="primary" onClick={() => onOpenJourney(hire.hireId)}>
                    Open Journey
                </Button>
            </div>
        </div>
    );
};

export default HirePipelineCard;
