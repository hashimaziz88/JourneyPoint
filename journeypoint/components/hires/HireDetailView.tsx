"use client";

import React, { startTransition, useEffect, useEffectEvent } from "react";
import {
    Alert,
    Button,
    Card,
    Descriptions,
    Empty,
    Space,
    Spin,
    Statistic,
    Tag,
    Typography,
} from "antd";
import { ArrowRightOutlined, ReloadOutlined } from "@ant-design/icons";
import {
    HIRE_STATUS_LABELS,
    HIRE_STATUS_TAG_COLORS,
    WELCOME_STATUS_LABELS,
    WELCOME_STATUS_TAG_COLORS,
} from "@/constants/hire/list";
import {
    JOURNEY_STATUS_LABELS,
    JOURNEY_STATUS_TAG_COLORS,
} from "@/constants/journey/review";
import { useStyles } from "@/components/hires/style/style";
import { buildFacilitatorHireJourneyRoute } from "@/constants/auth/routes";
import { useHireActions, useHireState } from "@/providers/hireProvider";
import type { IHireDetailViewProps } from "@/types/hire/components";
import { formatDisplayDate, formatDisplayDateTime } from "@/utils/date";
import { useRouter } from "next/navigation";

const { Paragraph, Title } = Typography;

/**
 * Shows one hire record with journey and welcome-delivery summary state.
 */
const HireDetailView: React.FC<IHireDetailViewProps> = ({ hireId }) => {
    const { styles } = useStyles();
    const router = useRouter();
    const { getHireDetail, resetSelectedHire } = useHireActions();
    const { isDetailPending, selectedHire } = useHireState();

    const loadHireEffect = useEffectEvent(async (): Promise<void> => {
        await getHireDetail(hireId);
    });

    const clearSelectedHire = useEffectEvent((): void => {
        resetSelectedHire();
    });

    useEffect(() => {
        void loadHireEffect();

        return () => {
            clearSelectedHire();
        };
    }, [hireId]);

    const refreshHire = async (): Promise<void> => {
        await getHireDetail(hireId);
    };

    const handleOpenJourney = (): void => {
        startTransition(() => {
            router.push(buildFacilitatorHireJourneyRoute(hireId));
        });
    };

    if (isDetailPending && !selectedHire) {
        return <Spin size="large" className={styles.loadingWrap} />;
    }

    if (!selectedHire) {
        return <Empty className={styles.emptyState} description="Hire record not found." />;
    }

    return (
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} className={styles.pageHeading}>
                        {selectedHire.fullName}
                    </Title>
                    <Paragraph type="secondary">{selectedHire.emailAddress}</Paragraph>
                    <Space wrap>
                        <Tag color={HIRE_STATUS_TAG_COLORS[selectedHire.status]}>
                            {HIRE_STATUS_LABELS[selectedHire.status]}
                        </Tag>
                        <Tag color={WELCOME_STATUS_TAG_COLORS[selectedHire.welcomeNotificationStatus]}>
                            {WELCOME_STATUS_LABELS[selectedHire.welcomeNotificationStatus]}
                        </Tag>
                        {selectedHire.journey ? (
                            <Tag color={JOURNEY_STATUS_TAG_COLORS[selectedHire.journey.status]}>
                                {JOURNEY_STATUS_LABELS[selectedHire.journey.status]}
                            </Tag>
                        ) : (
                            <Tag>No journey generated</Tag>
                        )}
                    </Space>
                </div>

                <Space wrap className={styles.pageActions}>
                    <Button
                        icon={<ReloadOutlined />}
                        loading={isDetailPending}
                        onClick={() => void refreshHire()}
                    >
                        Refresh
                    </Button>
                    <Button
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        onClick={handleOpenJourney}
                    >
                        {selectedHire.journey ? "Open Journey Review" : "Generate Journey"}
                    </Button>
                </Space>
            </div>

            {selectedHire.welcomeNotificationFailureReason ? (
                <Alert
                    type="warning"
                    message="Welcome notification needs facilitator follow-up."
                    description={selectedHire.welcomeNotificationFailureReason}
                />
            ) : null}

            <div className={styles.detailGrid}>
                <Card title="Hire Details">
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Plan">
                            {selectedHire.onboardingPlanName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Role title">
                            {selectedHire.roleTitle || "Not supplied"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Department">
                            {selectedHire.department || "Not supplied"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Start date">
                            {formatDisplayDate(selectedHire.startDate)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Platform account">
                            {selectedHire.platformUserDisplayName || "Not linked"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Manager">
                            {selectedHire.managerDisplayName || "No manager assigned"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Welcome sent">
                            {formatDisplayDateTime(selectedHire.welcomeNotificationSentAt)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Last attempted">
                            {formatDisplayDateTime(selectedHire.welcomeNotificationLastAttemptedAt)}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Space direction="vertical" size={16}>
                    <Card title="Journey Summary">
                        {selectedHire.journey ? (
                            <div className={styles.summaryGrid}>
                                <Statistic title="Tasks" value={selectedHire.journey.taskCount} />
                                <Statistic
                                    title="Completed"
                                    value={selectedHire.journey.completedTaskCount}
                                />
                                <Statistic
                                    title="Pending"
                                    value={selectedHire.journey.pendingTaskCount}
                                />
                            </div>
                        ) : (
                            <Paragraph type="secondary">
                                No per-hire journey has been generated yet. Open the
                                review screen to create the first draft from the
                                published plan.
                            </Paragraph>
                        )}
                    </Card>

                    <Card title="Lifecycle">
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="Activated">
                                {formatDisplayDateTime(selectedHire.activatedAt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Completed">
                                {formatDisplayDateTime(selectedHire.completedAt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Exited">
                                {formatDisplayDateTime(selectedHire.exitedAt)}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Space>
            </div>
        </Space>
    );
};

export default HireDetailView;
