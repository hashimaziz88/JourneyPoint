"use client";

import React from "react";
import { Button, Card, Empty, Space, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useStyles } from "@/components/journey/style/style";
import type { IJourneyTaskListProps } from "@/types/journey/components";
import { JourneyTaskStatus } from "@/types/journey";
import { formatDisplayDate } from "@/utils/date";
import { findOptionLabel } from "@/utils/plans/optionLabels";
import {
    ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS,
    ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS,
    ONBOARDING_TASK_CATEGORY_OPTIONS,
} from "@/types/onboarding-plan";

const { Paragraph, Text, Title } = Typography;

/**
 * Renders the ordered draft-journey task groups for facilitator review.
 */
const JourneyTaskList: React.FC<IJourneyTaskListProps> = ({
    isEditable,
    isMutationPending,
    modules,
    onEditTask,
    onRemoveTask,
}) => {
    const { styles } = useStyles();

    if (modules.length === 0) {
        return (
            <Empty
                className={styles.emptyState}
                description="No tasks have been added to this journey yet."
            />
        );
    }

    return (
        <div className={styles.moduleList}>
            {modules.map((module) => (
                <Card
                    key={module.moduleKey}
                    title={`${module.moduleOrderIndex}. ${module.moduleTitle}`}
                    className={styles.moduleCard}
                >
                    <div className={styles.taskList}>
                        {module.tasks.map((task) => (
                            <div key={task.id} className={styles.taskCard}>
                                <div className={styles.taskHeader}>
                                    <div>
                                        <Title level={5}>
                                            {task.taskOrderIndex}. {task.title}
                                        </Title>
                                        <Paragraph type="secondary">{task.description}</Paragraph>
                                    </div>

                                    {isEditable ? (
                                        <Space wrap className={styles.taskActions}>
                                            <Button
                                                icon={<EditOutlined />}
                                                onClick={() => onEditTask(task)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                danger
                                                icon={<DeleteOutlined />}
                                                loading={isMutationPending}
                                                onClick={() => void onRemoveTask(task)}
                                            >
                                                Remove
                                            </Button>
                                        </Space>
                                    ) : null}
                                </div>

                                <div className={styles.taskMetaTags}>
                                    <Tag>
                                        {findOptionLabel(ONBOARDING_TASK_CATEGORY_OPTIONS, task.category)}
                                    </Tag>
                                    <Tag>
                                        {findOptionLabel(
                                            ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS,
                                            task.assignmentTarget,
                                        )}
                                    </Tag>
                                    <Tag>
                                        {findOptionLabel(
                                            ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS,
                                            task.acknowledgementRule,
                                        )}
                                    </Tag>
                                    <Tag>Due day {task.dueDayOffset}</Tag>
                                    <Tag color={task.sourceOnboardingTaskId ? "processing" : "purple"}>
                                        {task.sourceOnboardingTaskId ? "Template-derived" : "Facilitator-authored"}
                                    </Tag>
                                </div>

                                <div className={styles.summaryGrid}>
                                    <div>
                                        <Text type="secondary">Due on</Text>
                                        <Paragraph>{formatDisplayDate(task.dueOn)}</Paragraph>
                                    </div>
                                    <div>
                                        <Text type="secondary">Status</Text>
                                        <Paragraph>
                                            {task.status === JourneyTaskStatus.Pending
                                                ? "Pending"
                                                : "Completed"}
                                        </Paragraph>
                                    </div>
                                    <div>
                                        <Text type="secondary">Completed</Text>
                                        <Paragraph>{formatDisplayDate(task.completedAt)}</Paragraph>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default JourneyTaskList;
