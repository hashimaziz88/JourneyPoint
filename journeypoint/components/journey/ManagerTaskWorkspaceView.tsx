"use client";

import React from "react";
import { Alert, Badge, Button, Card, Collapse, Empty, Space, Spin, Statistic, Typography, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import ManagerDirectReportSection from "@/components/journey/ManagerDirectReportSection";
import { useStyles } from "@/components/journey/style/style";
import { MANAGER_WORKSPACE_EMPTY_DESCRIPTION } from "@/constants/journey/manager";
import type { ManagerTaskWorkspaceViewProps } from "@/types/journey/components";

const { Paragraph, Title } = Typography;

/**
 * Renders the manager task workspace for direct-report tasks.
 */
const ManagerTaskWorkspaceView: React.FC<ManagerTaskWorkspaceViewProps> = ({
    workspace,
    isError,
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

    if (isError && !workspace) {
        return (
            <Alert
                type="error"
                showIcon
                title="Manager tasks could not be loaded."
                description="The API may be unavailable. Try refreshing the page."
            />
        );
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
            <div className={styles.managerWorkspace}>
                <Card className={styles.managerSidebar}>
                    <div className={styles.managerSidebarSticky}>
                        <div>
                            <Title level={3} className={styles.pageHeading}>
                                My Manager Tasks
                            </Title>
                            <Paragraph type="secondary" className={styles.inlineParagraph}>
                                Prioritize overdue and pending work first, then complete each direct report section
                                without jumping across long pages.
                            </Paragraph>
                        </div>

                        <div className={styles.sidebarStatGrid}>
                            <Statistic title="Direct reports" value={workspace.directReportCount} />
                            <Statistic title="Tasks" value={workspace.totalTaskCount} />
                            <Statistic title="Pending" value={workspace.pendingTaskCount} />
                            <Statistic title="Completed" value={workspace.completedTaskCount} />
                            <Statistic title="Overdue" value={workspace.overdueTaskCount} />
                        </div>

                        <div className={styles.sidebarActions}>
                            <Button
                                icon={<ReloadOutlined />}
                                loading={isPending || isMutationPending}
                                onClick={() => void onRefresh()}
                            >
                                Refresh Workspace
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className={styles.managerMain}>
                    <div className={styles.pageHeader}>
                        <div>
                            <Title level={2} className={styles.pageHeading}>
                                Direct Report Task Queue
                            </Title>
                            <Paragraph type="secondary">
                                Sections are collapsible so you can focus on one direct report at a time.
                            </Paragraph>
                        </div>
                    </div>

                    <Collapse
                        className={styles.managerReportCollapse}
                        defaultActiveKey={workspace.directReports
                            .filter((report) => report.pendingTaskCount > 0)
                            .slice(0, 2)
                            .map((report) => report.hireId)}
                        items={workspace.directReports.map((directReport) => ({
                            key: directReport.hireId,
                            label: (
                                <div className={styles.managerReportLabel}>
                                    <span className={styles.managerReportName}>{directReport.hireFullName}</span>
                                    <Space wrap className={styles.managerReportMeta}>
                                        <Badge count={directReport.pendingTaskCount} color="#faad14" showZero />
                                        <Badge count={directReport.completedTaskCount} color="#52c41a" showZero />
                                        {directReport.tasks.some((task) => task.isOverdue) ? (
                                            <Badge count="Overdue" color="#ff4d4f" />
                                        ) : null}
                                    </Space>
                                </div>
                            ),
                            children: (
                                <ManagerDirectReportSection
                                    directReport={directReport}
                                    isMutationPending={isMutationPending}
                                    onComplete={async (task) => {
                                        await handleComplete(task.journeyTaskId);
                                    }}
                                />
                            ),
                        }))}
                    />
                </div>
            </div>
        </Space>
    );
};

export default ManagerTaskWorkspaceView;
