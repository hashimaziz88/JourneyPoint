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
    message,
} from "antd";
import AtRiskFlagPanel from "@/components/engagement/AtRiskFlagPanel";
import HireEngagementPanel from "@/components/hires/HireEngagementPanel";
import InterventionHistoryPanel from "@/components/engagement/InterventionHistoryPanel";
import WellnessOverviewView from "@/components/wellness/WellnessOverviewView";
import { ArrowRightOutlined, MailOutlined, ReloadOutlined, WarningOutlined } from "@ant-design/icons";
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
import { APP_ROUTES, buildFacilitatorHireJourneyRoute, buildFacilitatorWellnessCheckInRoute } from "@/routes/auth.routes";
import {
    useEngagementActions,
    useEngagementState,
} from "@/providers/engagementProvider";
import { useHireActions, useHireState } from "@/providers/hireProvider";
import type {
    AcknowledgeAtRiskFlagRequest,
    ResolveAtRiskFlagRequest,
} from "@/types/engagement/engagement";
import { WelcomeNotificationStatus } from "@/types/hire/hire";
import type { HireDetailViewProps } from "@/types/hire/components";
import { formatDisplayDate, formatDisplayDateTime } from "@/utils/date";
import { useRouter } from "next/navigation";
import { WellnessProvider } from "@/providers/wellnessProvider";

const { Paragraph, Text, Title } = Typography;

/**
 * Shows one hire record with journey and welcome-delivery summary state.
 */
const HireDetailView: React.FC<HireDetailViewProps> = ({ hireId }) => {
    const { styles } = useStyles();
    const router = useRouter();
    const [messageApi, messageContextHolder] = message.useMessage();
    const { getHireDetail, resendWelcomeNotification, resetSelectedHire } = useHireActions();
    const {
        acknowledgeAtRiskFlag,
        getHireIntelligence,
        resetHireIntelligence,
        resolveAtRiskFlag,
    } = useEngagementActions();
    const { isDetailPending, isError, isMutationPending: isHireMutationPending, selectedHire } = useHireState();
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

    const handleResendWelcome = async (): Promise<void> => {
        const result = await resendWelcomeNotification(hireId);

        if (!result) {
            messageApi.error("Welcome email could not be resent.");
            return;
        }

        if (result.welcomeNotificationFailureReason) {
            messageApi.warning("Resend attempted but delivery failed again.");
        } else {
            messageApi.success("Welcome email resent successfully.");
        }

        await refreshHire();
    };

    const handleOpenJourney = (): void => {
        startTransition(() => {
            router.push(buildFacilitatorHireJourneyRoute(hireId));
        });
    };

    const handleAcknowledgeFlag = async (
        payload: AcknowledgeAtRiskFlagRequest,
    ): Promise<boolean> => Boolean(await acknowledgeAtRiskFlag(hireId, payload));

    const handleResolveFlag = async (
        payload: ResolveAtRiskFlagRequest,
    ): Promise<boolean> => Boolean(await resolveAtRiskFlag(hireId, payload));

    if ((isDetailPending || isPending) && !selectedHire) {
        return <Spin size="large" className={styles.loadingWrap} />;
    }

    if (isError && !selectedHire) {
        return (
            <Alert
                type="error"
                showIcon
                title="Hire details could not be loaded."
                description="The API may be unavailable. Try refreshing the page."
            />
        );
    }

    if (!selectedHire) {
        return <Empty className={styles.emptyState} description="Hire record not found." />;
    }


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
        <HireEngagementPanel
            activatedAt={selectedHire.activatedAt}
            intelligence={selectedHireIntelligence}
        />
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

    const wellnessTab = (
        <WellnessProvider>
            <WellnessOverviewView
                hireId={hireId}
                checkInRoute={(checkInId) => buildFacilitatorWellnessCheckInRoute(hireId, checkInId)}
                readonly
            />
        </WellnessProvider>
    );

    return (
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            {messageContextHolder}
            <Breadcrumb
                items={[
                    { title: <button type="button" onClick={() => startTransition(() => router.push(APP_ROUTES.facilitatorHires))}>Hires</button> },
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
                        <span><Text type="secondary">Status:</Text>{" "}
                        <Tag color={HIRE_STATUS_TAG_COLORS[selectedHire.status]}>
                            {HIRE_STATUS_LABELS[selectedHire.status]}
                        </Tag></span>
                        <span><Text type="secondary">Welcome:</Text>{" "}
                        <Tag color={WELCOME_STATUS_TAG_COLORS[selectedHire.welcomeNotificationStatus]}>
                            {WELCOME_STATUS_LABELS[selectedHire.welcomeNotificationStatus]}
                        </Tag></span>
                        {selectedHire.journey ? (
                            <span><Text type="secondary">Journey:</Text>{" "}
                            <Tag color={JOURNEY_STATUS_TAG_COLORS[selectedHire.journey.status]}>
                                {JOURNEY_STATUS_LABELS[selectedHire.journey.status]}
                            </Tag></span>
                        ) : (
                            <span><Text type="secondary">Journey:</Text>{" "}
                            <Tag>No journey generated</Tag></span>
                        )}
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

            {selectedHire.welcomeNotificationStatus !== WelcomeNotificationStatus.Sent ? (
                <Alert
                    type={selectedHire.welcomeNotificationStatus === WelcomeNotificationStatus.FailedRecoverable ? "warning" : "info"}
                    showIcon
                    message={
                        selectedHire.welcomeNotificationStatus === WelcomeNotificationStatus.FailedRecoverable
                            ? "Welcome email delivery failed."
                            : "Welcome email is pending."
                    }
                    description={
                        <Space orientation="vertical" size={8}>
                            {selectedHire.welcomeNotificationFailureReason && (
                                <Typography.Text type="secondary">
                                    {selectedHire.welcomeNotificationFailureReason}
                                </Typography.Text>
                            )}
                            <Button
                                size="small"
                                icon={<MailOutlined />}
                                loading={isHireMutationPending}
                                onClick={() => void handleResendWelcome()}
                            >
                                Resend Welcome Email
                            </Button>
                        </Space>
                    }
                />
            ) : null}

            <Tabs
                defaultActiveKey="overview"
                items={[
                    { key: "overview", label: "Overview", children: overviewTab },
                    {
                        key: "engagement",
                        label: selectedHireIntelligence?.activeFlag
                            ? <span><WarningOutlined className={styles.tabWarningIcon} />Engagement</span>
                            : "Engagement",
                        children: engagementTab,
                    },
                    { key: "interventions", label: `Interventions (${(selectedHireIntelligence?.resolvedFlags.length ?? 0) + (selectedHireIntelligence?.activeFlag ? 1 : 0)})`, children: interventionsTab },
                    { key: "wellness", label: "Wellness", children: wellnessTab },
                ]}
            />
        </Space>
    );
};

export default HireDetailView;
