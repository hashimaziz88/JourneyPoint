"use client";

import React, { useEffect, useRef } from "react";
import { Button, Empty, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ModulePanel from "@/components/plans/ModulePanel";
import { useStyles } from "@/components/plans/style/style";
import type { PlanEditorModulesSectionProps } from "@/types/plans/components";

const { Paragraph, Title } = Typography;

/**
 * Renders the ordered module and task builder section for one plan draft.
 */
const PlanEditorModulesSection: React.FC<PlanEditorModulesSectionProps> = ({
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
    const lastModuleRef = useRef<HTMLDivElement>(null);
    const prevCountRef = useRef(modules.length);

    useEffect(() => {
        if (modules.length > prevCountRef.current) {
            lastModuleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        prevCountRef.current = modules.length;
    }, [modules.length]);

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
                modules.map((module, index) => (
                    <div
                        key={module.clientKey}
                        ref={index === modules.length - 1 ? lastModuleRef : undefined}
                    >
                        <ModulePanel
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
                    </div>
                ))
            )}
        </Space>
    );
};

export default PlanEditorModulesSection;
