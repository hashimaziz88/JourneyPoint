"use client";

import React from "react";
import Link from "next/link";
import { Collapse, Progress, Tag, Typography } from "antd";
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
 * Renders one module section in the enrolee dashboard as a collapsible panel.
 * Completed modules start collapsed; active or pending modules start expanded.
 */
const EnroleeJourneyModuleSection: React.FC<IEnroleeJourneyModuleSectionProps> = ({
    module,
}) => {
    const { styles } = useStyles();
    const completionPercent = getCompletionPercent(
        module.completedTaskCount,
        module.totalTaskCount,
    );
    const isComplete = completionPercent >= 100;

    const moduleLabel = (
        <span className={styles.collapseLabel}>
            <span className={styles.collapseLabelTitle}>
                {module.moduleOrderIndex}. {module.moduleTitle}
            </span>
            <span className={styles.collapseLabelProgress}>
                <Progress percent={completionPercent} size="small" showInfo={false} />
            </span>
            <Text type="secondary" className={styles.collapseLabelMeta}>
                {JOURNEY_TASK_PROGRESS_TEXT(module.completedTaskCount, module.totalTaskCount)}
            </Text>
        </span>
    );

    const panelItems = [
        {
            key: module.moduleKey,
            label: moduleLabel,
            children: (
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
            ),
        },
    ];

    return (
        <Collapse
            defaultActiveKey={isComplete ? [] : [module.moduleKey]}
            className={styles.moduleCard}
            items={panelItems}
        />
    );
};

export default EnroleeJourneyModuleSection;
