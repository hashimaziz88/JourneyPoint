"use client";

import React, { startTransition, useEffect, useEffectEvent } from "react";
import {
    Alert,
    Breadcrumb,
    Button,
    Card,
    Descriptions,
    Empty,
    Space,
    Spin,
    Statistic,
    Tabs,
    Tag,
    Typography,
} from "antd";
import AtRiskFlagPanel from "@/components/engagement/AtRiskFlagPanel";
import EngagementBadge from "@/components/engagement/EngagementBadge";
import InterventionHistoryPanel from "@/components/engagement/InterventionHistoryPanel";
import ScoreTrendChart from "@/components/journey/ScoreTrendChart";
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
import { APP_ROUTES, buildFacilitatorHireJourneyRoute } from "@/constants/auth/routes";
import {
    useEngagementActions,
    useEngagementState,
} from "@/providers/engagementProvider";
import { useHireActions, useHireState } from "@/providers/hireProvider";
import type {
    IAcknowledgeAtRiskFlagRequest,
    IResolveAtRiskFlagRequest,
} from "@/types/engagement";
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
    const {
        acknowledgeAtRiskFlag,
        getHireIntelligence,
        resetHireIntelligence,
        resolveAtRiskFlag,
    } = useEngagementActions();
    const { isDetailPending, selectedHire } = useHireState();
    const { isMutationPending, isPending, selectedHireIntelligence } = useEngagementState();

    const loadHireEffect = useEffectEvent(async (): Promise<void> => {
        await Promise.all([getHireDetail(hireId), getHireIntelligence(hireId)]);
    });

    const clearSelectedHire = useEffectEvent((): void => {
        resetSelectedHire();
        resetHireIntelligence();
    });

    useEffect(() => {
        void loadHireEffect();

        return () => {
            clearSelectedHire();
        };
    }, [hireId]);

    const refreshHire = async (): Promise<void> => {
        await Promise.all([getHireDetail(hireId), getHireIntelligence(hireId)]);
    };

    const handleOpenJourney = (): void => {
        startTransition(() => {
            router.push(buildFacilitatorHireJourneyRoute(hireId));
        });
    };

    const handleAcknowledgeFlag = async (
        payload: IAcknowledgeAtRiskFlagRequest,
    ): Promise<boolean> => Boolean(await acknowledgeAtRiskFlag(hireId, payload));

    const handleResolveFlag = async (
        payload: IResolveAtRiskFlagRequest,
    ): Promise<boolean> => Boolean(await resolveAtRiskFlag(hireId, payload));

    if ((isDetailPending || isPending) && !selectedHire) {
        return <Spin size="large" className={styles.loadingWrap} />;
    }

    if (!selectedHire) {
        return <Empty className={styles.emptyState} description="Hire record not found." />;
    }

    const currentSnapshot = selectedHireIntelligence?.currentSnapshot;

    const overviewTab = (
        <Space orientation="vertical" size={16} className={styles.pageRoot}>
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

                <Space orientation="vertical" size={16}>
                    <Card title="Journey Summary">
                        {selectedHire.journey ? (
                            <div className={styles.summaryGrid}>
                                <Statistic title="Tasks" value={selectedHire.journey.taskCount} />
                                <Statistic title="Completed" value={selectedHire.journey.completedTaskCount} />
                                <Statistic title="Pending" value={selectedHire.journey.pendingTaskCount} />
                            </div>
                        ) : (
                            <Paragraph type="secondary">
                                No per-hire journey has been generated yet. Open the
                                review screen to create the first draft from the published plan.
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

    const engagementTab = (
        <Space orientation="vertical" size={16} className={styles.pageRoot}>
            {currentSnapshot ? (
                <>
                    <Card title="Current Engagement">
                        <Space orientation="vertical" size={16} className={styles.pageRoot}>
                            <EngagementBadge
                                classification={currentSnapshot.classification}
                                compositeScore={currentSnapshot.compositeScore}
                                hasActiveAtRiskFlag={Boolean(selectedHireIntelligence?.activeFlag)}
                            />
                            <div className={styles.summaryGrid}>
                                <Statistic title="Composite score" value={currentSnapshot.compositeScore} precision={0} suffix="%" />
                                <Statistic title="Completion rate" value={currentSnapshot.completionRate} precision={0} suffix="%" />
                                <Statistic title="Days since activity" value={currentSnapshot.daysSinceLastActivity} />
                                <Statistic title="Overdue tasks" value={currentSnapshot.overdueTaskCount} />
                                <Statistic title="Snapshots" value={selectedHireIntelligence?.snapshotHistory.length ?? 0} />
                            </div>
                            <Paragraph type="secondary">
                                Current stage: {selectedHireIntelligence?.currentStageTitle || "Not available"}
                            </Paragraph>
                        </Space>
                    </Card>
                    <ScoreTrendChart
                        currentSnapshot={currentSnapshot}
                        snapshotHistory={selectedHireIntelligence?.snapshotHistory ?? []}
                    />
                </>
            ) : (
                <Card>
                    <Paragraph type="secondary">
                        Engagement snapshots will appear here after the intelligence
                        service computes the first score for this hire.
                    </Paragraph>
                </Card>
            )}
        </Space>
    );

    const interventionsTab = (
        <div className={styles.detailGrid}>
            <AtRiskFlagPanel
                activeFlag={selectedHireIntelligence?.activeFlag}
                isPending={isMutationPending}
                onAcknowledge={handleAcknowledgeFlag}
                onResolve={handleResolveFlag}
            />
            <InterventionHistoryPanel
                resolvedFlags={selectedHireIntelligence?.resolvedFlags ?? []}
            />
        </div>
    );

    return (
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            <Breadcrumb
                items={[
                    { title: <a onClick={() => startTransition(() => router.push(APP_ROUTES.facilitatorHires))}>Hires</a> },
                    { title: selectedHire.fullName },
                ]}
            />

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
                        {currentSnapshot ? (
                            <EngagementBadge
                                classification={currentSnapshot.classification}
                                compositeScore={currentSnapshot.compositeScore}
                                hasActiveAtRiskFlag={Boolean(selectedHireIntelligence?.activeFlag)}
                                compact
                            />
                        ) : null}
                    </Space>
                </div>

                <Space wrap className={styles.pageActions}>
                    <Button
                        icon={<ReloadOutlined />}
                        loading={isDetailPending || isPending}
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
                    title="Welcome notification needs facilitator follow-up."
                    description={selectedHire.welcomeNotificationFailureReason}
                />
            ) : null}

            <Tabs
                defaultActiveKey="overview"
                items={[
                    { key: "overview", label: "Overview", children: overviewTab },
                    { key: "engagement", label: `Engagement${selectedHireIntelligence?.activeFlag ? " !" : ""}`, children: engagementTab },
                    { key: "interventions", label: `Interventions (${(selectedHireIntelligence?.resolvedFlags.length ?? 0) + (selectedHireIntelligence?.activeFlag ? 1 : 0)})`, children: interventionsTab },
                ]}
            />
        </Space>
    );
};

export default HireDetailView;
