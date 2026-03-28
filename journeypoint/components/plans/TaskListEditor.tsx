"use client";

import React from "react";
import { Button, Empty, Space, Tag, Typography } from "antd";
import {
    ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS,
    ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS,
    ONBOARDING_TASK_CATEGORY_OPTIONS,
} from "@/types/onboarding-plan";
import { useStyles } from "@/components/plans/style/style";
import type { ITaskListEditorProps } from "@/types/plans/components";
import { findOptionLabel } from "@/utils/plans/optionLabels";

const { Paragraph, Title } = Typography;

/**
 * Renders ordered module tasks and exposes task editing controls.
 */
const TaskListEditor: React.FC<ITaskListEditorProps> = ({
    isReadOnly,
    onAddTask,
    onDeleteTask,
    onEditTask,
    onMoveTask,
    tasks,
}) => {
    const { styles } = useStyles();

    if (tasks.length === 0) {
        return (
            <Space orientation="vertical" size={16} className={styles.modulesWrap}>
                <Empty
                    className={styles.emptyState}
                    description="No tasks have been added to this module yet."
                />
                <Button type="dashed" onClick={onAddTask} disabled={isReadOnly}>
                    Add First Task
                </Button>
            </Space>
        );
    }

    return (
        <Space orientation="vertical" size={16} className={styles.modulesWrap}>
            {tasks.map((task, index) => (
                <div key={task.clientKey} className={styles.taskRow}>
                    <Space orientation="vertical" size={12} className={styles.modulesWrap}>
                        <div className={styles.taskRowHeader}>
                            <div>
                                <Title level={5}>
                                    {index + 1}. {task.title || "Untitled Task"}
                                </Title>
                                <Paragraph type="secondary">
                                    {task.description || "No description yet."}
                                </Paragraph>
                            </div>

                            <Space wrap className={styles.taskActions}>
                                <Button onClick={() => onEditTask(task.clientKey)}>
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => onMoveTask(task.clientKey, "up")}
                                    disabled={isReadOnly || index === 0}
                                >
                                    Move Up
                                </Button>
                                <Button
                                    onClick={() => onMoveTask(task.clientKey, "down")}
                                    disabled={isReadOnly || index === tasks.length - 1}
                                >
                                    Move Down
                                </Button>
                                <Button
                                    danger
                                    onClick={() => onDeleteTask(task.clientKey)}
                                    disabled={isReadOnly}
                                >
                                    Remove
                                </Button>
                            </Space>
                        </div>

                        <Space wrap className={styles.taskMetaTags}>
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
                            <Tag>Due +{task.dueDayOffset} days</Tag>
                        </Space>
                    </Space>
                </div>
            ))}

            <Button type="dashed" onClick={onAddTask} disabled={isReadOnly}>
                Add Task
            </Button>
        </Space>
    );
};

export default TaskListEditor;
