"use client";

import React from "react";
import { Button, Progress, Typography } from "antd";
import EngagementBadge from "@/components/engagement/EngagementBadge";
import { useStyles } from "@/components/pipeline/style/style";
import type { IHirePipelineCardProps } from "@/types/pipeline/components";
import { formatDisplayDate } from "@/utils/date";
import { formatPercentage } from "@/utils/pipeline/board";

const { Text, Title } = Typography;

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
                <div className={styles.cardIdentity}>
                    <Title level={5} className={styles.cardName}>{hire.fullName}</Title>
                    <Text type="secondary" className={styles.cardEmail}>{hire.emailAddress}</Text>
                </div>
                <EngagementBadge
                    classification={hire.classification}
                    compositeScore={hire.compositeScore}
                    hasActiveAtRiskFlag={hire.hasActiveAtRiskFlag}
                />
            </div>

            <div className={styles.cardInlineMeta}>
                <Text type="secondary">{hire.currentStageTitle}</Text>
                <Text type="secondary">·</Text>
                <Text type="secondary">{formatDisplayDate(hire.startDate)}</Text>
                {hire.roleTitle ? (
                    <>
                        <Text type="secondary">·</Text>
                        <Text type="secondary">{hire.roleTitle}</Text>
                    </>
                ) : null}
            </div>

            <div className={styles.progressWrap}>
                <div className={styles.progressLabel}>
                    <Text type="secondary">Completion</Text>
                    <Text type="secondary">{formatPercentage(hire.completionRate)}</Text>
                </div>
                <Progress percent={Math.round(hire.completionRate)} showInfo={false} size="small" />
            </div>

            <div className={styles.actionRow}>
                <Button size="small" onClick={() => onOpenHire(hire.hireId)}>Open Hire</Button>
                <Button size="small" type="primary" onClick={() => onOpenJourney(hire.hireId)}>
                    Open Journey
                </Button>
            </div>
        </div>
    );
};

export default HirePipelineCard;
