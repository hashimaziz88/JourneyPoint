"use client";

import React from "react";
import { Button, Card, Progress, Space, Tag, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useStyles } from "@/components/journey/style/style";
import {
    JOURNEY_TASK_PROGRESS_TEXT,
    JOURNEY_TASK_STATUS_COLORS,
    JOURNEY_TASK_STATUS_LABELS,
} from "@/constants/journey/dashboard";
import type { IManagerDirectReportSectionProps } from "@/types/journey/components";
import { formatDisplayDate, formatDisplayDateTime } from "@/utils/date";
import { getCompletionPercent } from "@/utils/journey/dashboard";

const { Paragraph, Text } = Typography;

/**
 * Renders one manager workspace section for a direct report.
 */
const ManagerDirectReportSection: React.FC<IManagerDirectReportSectionProps> = ({
    directReport,
    isMutationPending,
    onComplete,
}) => {
    const { styles } = useStyles();
    const completionPercent = getCompletionPercent(
        directReport.completedTaskCount,
        directReport.pendingTaskCount + directReport.completedTaskCount,
    );

    return (
        <Card
            title={directReport.hireFullName}
            extra={`${directReport.roleTitle || "Role not set"}${directReport.department ? ` • ${directReport.department}` : ""}`}
            className={styles.moduleCard}
        >
            <Space orientation="vertical" size={16} className={styles.participantModuleBody}>
                <div className={styles.moduleProgressRow}>
                    <div>
                        <Text type="secondary">Task progress</Text>
                        <Paragraph className={styles.inlineParagraph}>
                            {JOURNEY_TASK_PROGRESS_TEXT(
                                directReport.completedTaskCount,
                                directReport.pendingTaskCount + directReport.completedTaskCount,
                            )}
                        </Paragraph>
                    </div>
                    <Progress percent={completionPercent} size="small" className={styles.progressBar} />
                </div>

                <div className={styles.participantTaskList}>
                    {directReport.tasks.map((task) => (
                        <div key={task.journeyTaskId} className={styles.participantTaskCard}>
                            <div className={styles.participantTaskHeader}>
                                <div>
                                    <Text type="secondary">
                                        Module {task.moduleOrderIndex}.{task.taskOrderIndex}
                                    </Text>
                                    <Paragraph className={styles.taskHeading}>
                                        {task.title}
                                    </Paragraph>
                                    <Paragraph type="secondary" className={styles.taskPreview}>
                                        {task.description || "No description provided."}
                                    </Paragraph>
                                </div>

                                <div className={styles.pageActions}>
                                    <Button
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        loading={isMutationPending}
                                        disabled={!task.canComplete}
                                        onClick={() => void onComplete(task)}
                                    >
                                        Mark complete
                                    </Button>
                                </div>
                            </div>

                            <div className={styles.taskMetaTags}>
                                <Tag color={JOURNEY_TASK_STATUS_COLORS[task.status]}>
                                    {JOURNEY_TASK_STATUS_LABELS[task.status]}
                                </Tag>
                                {task.isOverdue ? <Tag color="red">Overdue</Tag> : null}
                                {task.isPersonalised ? <Tag color="processing">Personalised</Tag> : null}
                            </div>

                            <div className={styles.summaryGrid}>
                                <div>
                                    <Text type="secondary">Due on</Text>
                                    <Paragraph className={styles.inlineParagraph}>
                                        {formatDisplayDate(task.dueOn)}
                                    </Paragraph>
                                </div>
                                <div>
                                    <Text type="secondary">Completed</Text>
                                    <Paragraph className={styles.inlineParagraph}>
                                        {formatDisplayDateTime(task.completedAt)}
                                    </Paragraph>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Space>
        </Card>
    );
};

export default ManagerDirectReportSection;
