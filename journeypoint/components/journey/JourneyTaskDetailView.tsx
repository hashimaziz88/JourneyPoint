"use client";

import React from "react";
import Link from "next/link";
import { Breadcrumb, Button, Card, Empty, Space, Spin, Tabs, Tag, Typography, message } from "antd";
import {
    CheckCircleOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import JourneyTaskAcknowledgementPanel from "@/components/journey/JourneyTaskAcknowledgementPanel";
import { useStyles } from "@/components/journey/style/style";
import { APP_ROUTES } from "@/constants/auth/routes";
import {
    JOURNEY_TASK_STATUS_COLORS,
    JOURNEY_TASK_STATUS_LABELS,
} from "@/constants/journey/dashboard";
import type { IJourneyTaskDetailViewProps } from "@/types/journey/components";
import { formatDisplayDate, formatDisplayDateTime } from "@/utils/date";
import { canRenderTaskActions } from "@/utils/journey/dashboard";

const { Paragraph, Text, Title } = Typography;

/**
 * Renders the participant task-detail workflow for one enrolee task.
 */
const JourneyTaskDetailView: React.FC<IJourneyTaskDetailViewProps> = ({
    task,
    isPending,
    isMutationPending,
    onRefresh,
    onAcknowledge,
    onComplete,
}) => {
    const { styles } = useStyles();
    const [messageApi, messageContextHolder] = message.useMessage();

    const handleAcknowledge = async (): Promise<boolean> => {
        if (!task) {
            return false;
        }

        const result = await onAcknowledge(task);
        if (!result) {
            messageApi.error("Task acknowledgement could not be saved.");
            return false;
        }

        messageApi.success("Task acknowledged.");
        return true;
    };

    const handleComplete = async (): Promise<void> => {
        if (!task) {
            return;
        }

        const result = await onComplete(task);
        if (!result) {
            messageApi.error("Task completion could not be saved.");
            return;
        }

        messageApi.success("Task marked complete.");
    };

    if (!task && isPending) {
        return <Spin size="large" className={styles.loadingWrap} />;
    }

    if (!task) {
        return <Empty className={styles.emptyState} description="Task not found." />;
    }

    const detailsTab = (
        <Space direction="vertical" size={16} className={styles.pageRoot}>
            <Card>
                <Title level={4}>Task details</Title>
                <Paragraph className={styles.detailBody}>{task.description}</Paragraph>
            </Card>
        </Space>
    );

    const acknowledgementTab = (
        <Card>
            <JourneyTaskAcknowledgementPanel
                task={task}
                isPending={isMutationPending}
                onAcknowledge={handleAcknowledge}
            />
        </Card>
    );

    return (
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            {messageContextHolder}
            <Breadcrumb
                items={[
                    { title: <Link href={APP_ROUTES.enroleeMyJourney}>My Journey</Link> },
                    { title: task.title },
                ]}
            />

            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} className={styles.pageHeading}>
                        {task.title}
                    </Title>
                    <Paragraph type="secondary">
                        Module {task.moduleOrderIndex}.{task.taskOrderIndex} in {task.moduleTitle}
                    </Paragraph>
                    <div className={styles.taskMetaTags}>
                        <Tag color={JOURNEY_TASK_STATUS_COLORS[task.status]}>
                            {JOURNEY_TASK_STATUS_LABELS[task.status]}
                        </Tag>
                        {task.isOverdue ? <Tag color="red">Overdue</Tag> : null}
                        {task.isPersonalised ? <Tag color="processing">Personalised</Tag> : null}
                    </div>
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
                <div>
                    <Text type="secondary">Due on</Text>
                    <Paragraph className={styles.inlineParagraph}>
                        {formatDisplayDate(task.dueOn)}
                    </Paragraph>
                </div>
                <div>
                    <Text type="secondary">Acknowledged</Text>
                    <Paragraph className={styles.inlineParagraph}>
                        {formatDisplayDateTime(task.acknowledgedAt)}
                    </Paragraph>
                </div>
                <div>
                    <Text type="secondary">Completed</Text>
                    <Paragraph className={styles.inlineParagraph}>
                        {formatDisplayDateTime(task.completedAt)}
                    </Paragraph>
                </div>
                <div>
                    <Text type="secondary">Personalised</Text>
                    <Paragraph className={styles.inlineParagraph}>
                        {formatDisplayDateTime(task.personalisedAt)}
                    </Paragraph>
                </div>
            </div>

            <Tabs
                items={[
                    { key: "details", label: "Details", children: detailsTab },
                    { key: "acknowledgement", label: "Acknowledgement", children: acknowledgementTab },
                ]}
            />

            {canRenderTaskActions(task) ? (
                <div className={styles.pageActions}>
                    <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        loading={isMutationPending}
                        disabled={!task.canComplete}
                        onClick={() => void handleComplete()}
                    >
                        Mark complete
                    </Button>
                </div>
            ) : null}
        </Space>
    );
};

export default JourneyTaskDetailView;
