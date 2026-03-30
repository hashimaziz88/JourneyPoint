"use client";

import React from "react";
import { Button, Card, Empty, Space, Spin, Statistic, Typography, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import ManagerDirectReportSection from "@/components/journey/ManagerDirectReportSection";
import { useStyles } from "@/components/journey/style/style";
import { MANAGER_WORKSPACE_EMPTY_DESCRIPTION } from "@/constants/journey/manager";
import type { IManagerTaskWorkspaceViewProps } from "@/types/journey/components";

const { Paragraph, Title } = Typography;

/**
 * Renders the manager task workspace for direct-report tasks.
 */
const ManagerTaskWorkspaceView: React.FC<IManagerTaskWorkspaceViewProps> = ({
    workspace,
    isPending,
    isMutationPending,
    onRefresh,
    onComplete,
}) => {
    const { styles } = useStyles();
    const [messageApi, messageContextHolder] = message.useMessage();

    const handleComplete = async (journeyTaskId: string): Promise<boolean> => {
        const result = await onComplete(journeyTaskId);

        if (!result) {
            messageApi.error("Manager task completion could not be saved.");
            return false;
        }

        messageApi.success("Manager task marked complete.");
        return true;
    };

    if (!workspace && isPending) {
        return <Spin size="large" className={styles.loadingWrap} />;
    }

    if (!workspace || workspace.totalTaskCount === 0) {
        return (
            <Card className={styles.sectionCard}>
                {messageContextHolder}
                <Empty className={styles.emptyState} description={MANAGER_WORKSPACE_EMPTY_DESCRIPTION}>
                    <Button icon={<ReloadOutlined />} onClick={() => void onRefresh()}>
                        Refresh
                    </Button>
                </Empty>
            </Card>
        );
    }

    return (
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            {messageContextHolder}
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} className={styles.pageHeading}>
                        My Manager Tasks
                    </Title>
                    <Paragraph type="secondary">
                        Complete manager-owned tasks for your direct reports without exposing
                        unrelated hires or facilitator-only journey controls.
                    </Paragraph>
                </div>

                <Button
                    icon={<ReloadOutlined />}
                    loading={isPending || isMutationPending}
                    onClick={() => void onRefresh()}
                >
                    Refresh
                </Button>
            </div>

            <div className={styles.summaryGrid}>
                <Card className={styles.statCard}>
                    <Statistic title="Direct reports" value={workspace.directReportCount} />
                </Card>
                <Card className={styles.statCard}>
                    <Statistic title="Tasks" value={workspace.totalTaskCount} />
                </Card>
                <Card className={styles.statCard}>
                    <Statistic title="Pending" value={workspace.pendingTaskCount} />
                </Card>
                <Card className={styles.statCard}>
                    <Statistic title="Completed" value={workspace.completedTaskCount} />
                </Card>
                <Card className={styles.statCard}>
                    <Statistic title="Overdue" value={workspace.overdueTaskCount} />
                </Card>
            </div>

            {workspace.directReports.map((directReport) => (
                <ManagerDirectReportSection
                    key={directReport.hireId}
                    directReport={directReport}
                    isMutationPending={isMutationPending}
                    onComplete={async (task) => {
                        await handleComplete(task.journeyTaskId);
                    }}
                />
            ))}
        </Space>
    );
};

export default ManagerTaskWorkspaceView;
