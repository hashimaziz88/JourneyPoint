"use client";

import React from "react";
import { Button, Card, Space, Tag, Typography } from "antd";
import {
    OnboardingPlanStatus,
} from "@/types/onboarding-plan/onboarding-plan"
import {
    ONBOARDING_PLAN_STATUS_LABELS,
} from "@/constants/plans/onboarding-plan";
import { useStyles } from "@/components/plans/style/style";
import type { PlanCardProps } from "@/types/plans/components";
import { formatPlanUpdatedTime, getPlanStatusColor } from "@/utils/plans/planCard";

const { Paragraph, Text, Title } = Typography;

/**
 * Renders one onboarding-plan list card and its lifecycle actions.
 */
const PlanCard: React.FC<PlanCardProps> = ({
    isActionPending,
    onArchive,
    onClone,
    onOpen,
    onPublish,
    plan,
}) => {
    const { styles } = useStyles();
    const canPublish = plan.status === OnboardingPlanStatus.Draft;
    const canArchive = plan.status !== OnboardingPlanStatus.Archived;
    const handleCloneClick = async (): Promise<void> => {
        await onClone(plan);
    };
    const handlePublishClick = async (): Promise<void> => {
        await onPublish(plan);
    };
    const handleArchiveClick = async (): Promise<void> => {
        await onArchive(plan);
    };

    return (
        <Card className={styles.planCard}>
            <div className={styles.planCardBody}>
                <div className={styles.planCardHeader}>
                    <div>
                        <Title level={4} className={styles.planCardTitle}>
                            {plan.name}
                        </Title>
                        <Paragraph type="secondary">{plan.targetAudience}</Paragraph>
                    </div>

                    <Tag color={getPlanStatusColor(plan.status)}>
                        {ONBOARDING_PLAN_STATUS_LABELS[plan.status]}
                    </Tag>
                </div>

                <div className={styles.planStats}>
                    <div className={styles.statBlock}>
                        <Text type="secondary">Duration</Text>
                        <Title level={5}>{plan.durationDays} days</Title>
                    </div>
                    <div className={styles.statBlock}>
                        <Text type="secondary">Modules</Text>
                        <Title level={5}>{plan.moduleCount}</Title>
                    </div>
                    <div className={styles.statBlock}>
                        <Text type="secondary">Tasks</Text>
                        <Title level={5}>{plan.taskCount}</Title>
                    </div>
                </div>

                <Text type="secondary">
                    Updated {formatPlanUpdatedTime(plan.lastUpdatedTime)}
                </Text>

                <Space wrap className={styles.planCardActions}>
                    <Button onClick={() => onOpen(plan.id)}>Open</Button>
                    <Button onClick={handleCloneClick} loading={isActionPending}>
                        Clone
                    </Button>
                    <Button
                        type="primary"
                        onClick={handlePublishClick}
                        disabled={!canPublish}
                        loading={isActionPending}
                    >
                        Publish
                    </Button>
                    <Button
                        danger
                        onClick={handleArchiveClick}
                        disabled={!canArchive}
                        loading={isActionPending}
                    >
                        Archive
                    </Button>
                </Space>
            </div>
        </Card>
    );
};

export default PlanCard;
