"use client";

import React from "react";
import { Button, Card, Input, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
    IOnboardingModuleDraft,
    IOnboardingTaskDraft,
} from "@/types/onboarding-plan";
import {
    ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS,
    ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS,
    ONBOARDING_TASK_CATEGORY_OPTIONS,
} from "@/types/onboarding-plan";
import { useStyles } from "@/components/plans/style/style";

const { Paragraph, Title } = Typography;

const findOptionLabel = (
    options: ReadonlyArray<{ label: string; value: number }>,
    value: number,
): string => options.find((option) => option.value === value)?.label ?? "Unknown";

interface IMarkdownPreviewTableProps {
    modules: IOnboardingModuleDraft[];
    onEditTask: (moduleClientKey: string, taskClientKey: string) => void;
    onModuleChange: (
        moduleClientKey: string,
        name: string,
        description: string,
    ) => void;
    onRemoveModule: (moduleClientKey: string) => void;
    onRemoveTask: (moduleClientKey: string, taskClientKey: string) => void;
}

interface IMarkdownPreviewTaskRow extends IOnboardingTaskDraft {
    key: string;
    moduleClientKey: string;
}

/**
 * Renders editable markdown-import preview modules and parsed task rows.
 */
const MarkdownPreviewTable: React.FC<IMarkdownPreviewTableProps> = ({
    modules,
    onEditTask,
    onModuleChange,
    onRemoveModule,
    onRemoveTask,
}) => {
    const { styles } = useStyles();

    const columns: ColumnsType<IMarkdownPreviewTaskRow> = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (value: number) =>
                findOptionLabel(ONBOARDING_TASK_CATEGORY_OPTIONS, value),
        },
        {
            title: "Due Offset",
            dataIndex: "dueDayOffset",
            key: "dueDayOffset",
            render: (value: number) => `${value} days`,
        },
        {
            title: "Assigned To",
            dataIndex: "assignmentTarget",
            key: "assignmentTarget",
            render: (value: number) =>
                findOptionLabel(ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS, value),
        },
        {
            title: "Acknowledgement",
            dataIndex: "acknowledgementRule",
            key: "acknowledgementRule",
            render: (value: number) =>
                findOptionLabel(
                    ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS,
                    value,
                ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, task) => (
                <Space wrap>
                    <Button onClick={() => onEditTask(task.moduleClientKey, task.clientKey)}>
                        Edit
                    </Button>
                    <Button
                        danger
                        onClick={() => onRemoveTask(task.moduleClientKey, task.clientKey)}
                    >
                        Remove
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Space orientation="vertical" size={16} className={styles.modulesWrap}>
            {modules.map((module) => {
                const tableData: IMarkdownPreviewTaskRow[] = module.tasks.map((task) => ({
                    ...task,
                    key: task.clientKey,
                    moduleClientKey: module.clientKey,
                }));

                return (
                    <Card key={module.clientKey} className={styles.previewModuleCard}>
                        <Space orientation="vertical" size={16} className={styles.modulesWrap}>
                            <div className={styles.moduleHeader}>
                                <div>
                                    <Title level={4}>Module {module.orderIndex}</Title>
                                    <Paragraph type="secondary">
                                        Review parsed values before creating the draft.
                                    </Paragraph>
                                </div>

                                <Button
                                    danger
                                    onClick={() => onRemoveModule(module.clientKey)}
                                >
                                    Remove Module
                                </Button>
                            </div>

                            <Input
                                value={module.name}
                                onChange={(event) =>
                                    onModuleChange(
                                        module.clientKey,
                                        event.target.value,
                                        module.description,
                                    )
                                }
                                placeholder="Module name"
                                maxLength={200}
                            />

                            <Input.TextArea
                                value={module.description}
                                onChange={(event) =>
                                    onModuleChange(
                                        module.clientKey,
                                        module.name,
                                        event.target.value,
                                    )
                                }
                                placeholder="Module description"
                                rows={4}
                                maxLength={2000}
                            />

                            <div className={styles.previewTableWrap}>
                                <Table<IMarkdownPreviewTaskRow>
                                    columns={columns}
                                    dataSource={tableData}
                                    pagination={false}
                                    rowKey="clientKey"
                                    scroll={{ x: "max-content" }}
                                />
                            </div>
                        </Space>
                    </Card>
                );
            })}
        </Space>
    );
};

export default MarkdownPreviewTable;
