"use client";

import React from "react";
import { Button, Card, Input, Space, Typography } from "antd";
import TaskListEditor from "@/components/plans/TaskListEditor";
import { useStyles } from "@/components/plans/style/style";
import type { IModulePanelProps } from "@/types/plans/components";

const { Paragraph, Title } = Typography;

/**
 * Renders one ordered onboarding module and its nested task editor.
 */
const ModulePanel: React.FC<IModulePanelProps> = ({
    isReadOnly,
    module,
    moduleCount,
    onAddTask,
    onDeleteTask,
    onEditTask,
    onModuleChange,
    onMoveModule,
    onMoveTask,
    onRemoveModule,
}) => {
    const { styles } = useStyles();

    return (
        <Card className={styles.moduleCard}>
            <Space orientation="vertical" size={16} className={styles.modulesWrap}>
                <div className={styles.moduleHeader}>
                    <div>
                        <Title level={4}>Module {module.orderIndex}</Title>
                        <Paragraph type="secondary">
                            Order is preserved exactly as shown here in the plan builder.
                        </Paragraph>
                    </div>

                    <Space wrap className={styles.moduleHeaderActions}>
                        <Button
                            onClick={() => onMoveModule("up")}
                            disabled={isReadOnly || module.orderIndex === 1}
                        >
                            Move Up
                        </Button>
                        <Button
                            onClick={() => onMoveModule("down")}
                            disabled={isReadOnly || module.orderIndex === moduleCount}
                        >
                            Move Down
                        </Button>
                        <Button danger onClick={onRemoveModule} disabled={isReadOnly}>
                            Remove Module
                        </Button>
                    </Space>
                </div>

                <Input
                    value={module.name}
                    onChange={(event) =>
                        onModuleChange(event.target.value, module.description)
                    }
                    placeholder="Module name"
                    disabled={isReadOnly}
                    maxLength={200}
                />

                <Input.TextArea
                    value={module.description}
                    onChange={(event) =>
                        onModuleChange(module.name, event.target.value)
                    }
                    placeholder="Describe the purpose of this module."
                    disabled={isReadOnly}
                    rows={4}
                    maxLength={2000}
                />

                <TaskListEditor
                    isReadOnly={isReadOnly}
                    onAddTask={onAddTask}
                    onDeleteTask={onDeleteTask}
                    onEditTask={onEditTask}
                    onMoveTask={onMoveTask}
                    tasks={module.tasks}
                />
            </Space>
        </Card>
    );
};

export default ModulePanel;
