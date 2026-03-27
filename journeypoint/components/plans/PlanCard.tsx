"use client";

import React from "react";
import { Button, Card, Space, Tag, Typography } from "antd";
import {
    IOnboardingPlanListItemDto,
    ONBOARDING_PLAN_STATUS_LABELS,
    OnboardingPlanStatus,
} from "@/types/onboarding-plan";
import { useStyles } from "@/components/plans/style/style";

const { Paragraph, Text, Title } = Typography;

const formatUpdatedTime = (value: string): string =>
    new Intl.DateTimeFormat("en-ZA", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));

const getStatusColor = (
    status: OnboardingPlanStatus,
): "blue" | "green" | "default" => {
    if (status === OnboardingPlanStatus.Published) {
        return "green";
    }

    if (status === OnboardingPlanStatus.Draft) {
        return "blue";
    }

    return "default";
};

interface IPlanCardProps {
    isActionPending: boolean;
    onArchive: (plan: IOnboardingPlanListItemDto) => Promise<void>;
    onClone: (plan: IOnboardingPlanListItemDto) => Promise<void>;
    onOpen: (planId: string) => void;
    onPublish: (plan: IOnboardingPlanListItemDto) => Promise<void>;
    plan: IOnboardingPlanListItemDto;
}

/**
 * Renders one onboarding-plan list card and its lifecycle actions.
 */
const PlanCard: React.FC<IPlanCardProps> = ({
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

                    <Tag color={getStatusColor(plan.status)}>
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
                    Updated {formatUpdatedTime(plan.lastUpdatedTime)}
                </Text>

                <Space wrap className={styles.planCardActions}>
                    <Button onClick={() => onOpen(plan.id)}>Open</Button>
                    <Button onClick={() => void onClone(plan)} loading={isActionPending}>
                        Clone
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => void onPublish(plan)}
                        disabled={!canPublish}
                        loading={isActionPending}
                    >
                        Publish
                    </Button>
                    <Button
                        danger
                        onClick={() => void onArchive(plan)}
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
