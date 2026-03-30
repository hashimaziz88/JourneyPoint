"use client";

import React from "react";
import Link from "next/link";
import { Card, Progress, Space, Tag, Typography } from "antd";
import { useStyles } from "@/components/journey/style/style";
import { buildEnroleeJourneyTaskRoute } from "@/constants/auth/routes";
import {
    JOURNEY_TASK_PROGRESS_TEXT,
    JOURNEY_TASK_STATUS_COLORS,
    JOURNEY_TASK_STATUS_LABELS,
    needsAcknowledgementTag,
} from "@/constants/journey/dashboard";
import type { IEnroleeJourneyModuleSectionProps } from "@/types/journey/components";
import { formatDisplayDate } from "@/utils/date";
import { getCompletionPercent } from "@/utils/journey/dashboard";

const { Paragraph, Text, Title } = Typography;

/**
 * Renders one module section in the enrolee dashboard.
 */
const EnroleeJourneyModuleSection: React.FC<IEnroleeJourneyModuleSectionProps> = ({
    module,
}) => {
    const { styles } = useStyles();
    const completionPercent = getCompletionPercent(
        module.completedTaskCount,
        module.totalTaskCount,
    );

    return (
        <Card
            title={`${module.moduleOrderIndex}. ${module.moduleTitle}`}
            className={styles.moduleCard}
        >
            <Space orientation="vertical" size={16} className={styles.participantModuleBody}>
                <div className={styles.moduleProgressRow}>
                    <div>
                        <Text type="secondary">Progress</Text>
                        <Paragraph className={styles.inlineParagraph}>
                            {JOURNEY_TASK_PROGRESS_TEXT(
                                module.completedTaskCount,
                                module.totalTaskCount,
                            )}
                        </Paragraph>
                    </div>
                    <Progress percent={completionPercent} size="small" className={styles.progressBar} />
                </div>

                <div className={styles.participantTaskList}>
                    {module.tasks.map((task) => (
                        <div key={task.journeyTaskId} className={styles.participantTaskCard}>
                            <div className={styles.participantTaskHeader}>
                                <div>
                                    <Title level={5} className={styles.taskHeading}>
                                        {task.title}
                                    </Title>
                                    <Paragraph type="secondary" className={styles.taskPreview}>
                                        {task.descriptionPreview || "No description provided."}
                                    </Paragraph>
                                </div>
                                <Link
                                    href={buildEnroleeJourneyTaskRoute(task.journeyTaskId)}
                                    className={styles.taskLink}
                                >
                                    Open task
                                </Link>
                            </div>

                            <div className={styles.taskMetaTags}>
                                <Tag color={JOURNEY_TASK_STATUS_COLORS[task.status]}>
                                    {JOURNEY_TASK_STATUS_LABELS[task.status]}
                                </Tag>
                                {task.isOverdue ? <Tag color="red">Overdue</Tag> : null}
                                {task.isPersonalised ? <Tag color="processing">Personalised</Tag> : null}
                                {needsAcknowledgementTag(task) ? <Tag color="purple">Needs acknowledgement</Tag> : null}
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
                                        {formatDisplayDate(task.acknowledgedAt)}
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

export default EnroleeJourneyModuleSection;
