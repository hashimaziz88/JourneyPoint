"use client";

import React from "react";
import { Alert, Button, Card, Empty, Space, Spin, Statistic, Tag, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import EnroleeJourneyModuleSection from "@/components/journey/EnroleeJourneyModuleSection";
import { useStyles } from "@/components/journey/style/style";
import {
    ENROLEE_JOURNEY_STATUS_COLORS,
    ENROLEE_JOURNEY_STATUS_LABELS,
} from "@/constants/journey/dashboard";
import type { EnroleeJourneyDashboardViewProps } from "@/types/journey/components";
import { formatDisplayDateTime } from "@/utils/date";

const { Paragraph, Title } = Typography;

/**
 * Renders the active journey dashboard for the signed-in enrolee.
 */
const EnroleeJourneyDashboardView: React.FC<EnroleeJourneyDashboardViewProps> = ({
    dashboard,
    isError,
    isPending,
    onRefresh,
}) => {
    const { styles } = useStyles();

    if (!dashboard && isPending) {
        return <Spin size="large" className={styles.loadingWrap} />;
    }

    if (isError && !dashboard) {
        return (
            <Alert
                type="error"
                showIcon
                title="Your journey dashboard could not be loaded."
                description="Please try refreshing. If this persists, contact your facilitator."
            />
        );
    }

    if (!dashboard) {
        return (
            <Card className={styles.sectionCard}>
                <Empty
                    className={styles.emptyState}
                    description="Your onboarding journey is not active yet. Please check back once your facilitator activates it."
                >
                    <Button icon={<ReloadOutlined />} onClick={() => void onRefresh()}>
                        Refresh
                    </Button>
                </Empty>
            </Card>
        );
    }

    return (
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} className={styles.pageHeading}>
                        My Journey
                    </Title>
                    <Paragraph type="secondary">
                        Track your onboarding progress by module and open each task for its
                        full instructions, acknowledgement rules, and completion actions.
                    </Paragraph>
                    <Tag color={ENROLEE_JOURNEY_STATUS_COLORS[dashboard.status]}>
                        {ENROLEE_JOURNEY_STATUS_LABELS[dashboard.status]}
                    </Tag>
                </div>

                <Button
                    icon={<ReloadOutlined />}
                    loading={isPending}
                    onClick={() => void onRefresh()}
                >
                    Refresh
                </Button>
            </div>

            <div className={styles.summaryGrid}>
                <Card className={styles.statCard}>
                    <Statistic title="Modules" value={dashboard.modules.length} />
                </Card>
                <Card className={styles.statCard}>
                    <Statistic title="Tasks" value={dashboard.totalTaskCount} />
                </Card>
                <Card className={styles.statCard}>
                    <Statistic title="Completed" value={dashboard.completedTaskCount} />
                </Card>
                <Card className={styles.statCard}>
                    <Statistic title="Overdue" value={dashboard.overdueTaskCount} />
                </Card>
                <Card className={styles.statCard}>
                    <Statistic
                        title="Activated"
                        value={formatDisplayDateTime(dashboard.activatedAt)}
                    />
                </Card>
            </div>

            {dashboard.modules.map((module) => (
                <EnroleeJourneyModuleSection key={module.moduleKey} module={module} />
            ))}
        </Space>
    );
};

export default EnroleeJourneyDashboardView;
