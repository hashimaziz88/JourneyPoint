"use client";

import React from "react";
import { Button, Empty, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ModulePanel from "@/components/plans/ModulePanel";
import { useStyles } from "@/components/plans/style/style";
import type { IPlanEditorModulesSectionProps } from "@/types/plans/components";

const { Paragraph, Title } = Typography;

/**
 * Renders the ordered module and task builder section for one plan draft.
 */
const PlanEditorModulesSection: React.FC<IPlanEditorModulesSectionProps> = ({
    isDraftEditable,
    modules,
    onAddModule,
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
        <Space orientation="vertical" size={16} className={styles.modulesWrap}>
            <div className={styles.pageHeader}>
                <div>
                    <Title level={3}>Modules</Title>
                    <Paragraph type="secondary">
                        Modules become the ordered plan phases used by the builder.
                    </Paragraph>
                </div>

                <Button
                    icon={<PlusOutlined />}
                    type="dashed"
                    onClick={onAddModule}
                    disabled={!isDraftEditable}
                >
                    Add Module
                </Button>
            </div>

            {modules.length === 0 ? (
                <Empty
                    className={styles.emptyState}
                    description="Start by adding the first onboarding module."
                />
            ) : (
                modules.map((module) => (
                    <ModulePanel
                        key={module.clientKey}
                        isReadOnly={!isDraftEditable}
                        module={module}
                        moduleCount={modules.length}
                        onAddTask={() => onAddTask(module.clientKey)}
                        onDeleteTask={(taskClientKey) =>
                            onDeleteTask(module.clientKey, taskClientKey)
                        }
                        onEditTask={(taskClientKey) =>
                            onEditTask(module.clientKey, taskClientKey)
                        }
                        onModuleChange={(name, description) =>
                            onModuleChange(module.clientKey, name, description)
                        }
                        onMoveModule={(direction) =>
                            onMoveModule(module.clientKey, direction)
                        }
                        onMoveTask={(taskClientKey, direction) =>
                            onMoveTask(module.clientKey, taskClientKey, direction)
                        }
                        onRemoveModule={() => onRemoveModule(module.clientKey)}
                    />
                ))
            )}
        </Space>
    );
};

export default PlanEditorModulesSection;
