"use client";

import React from "react";
import { Alert, Card, Empty, Input, InputNumber, Space, Typography } from "antd";
import MarkdownImportWarnings from "@/components/plans/MarkdownImportWarnings";
import MarkdownPreviewTable from "@/components/plans/MarkdownPreviewTable";
import { useStyles } from "@/components/plans/style/style";
import type { IMarkdownImportPreviewCardProps } from "@/types/plans/components";

const { Paragraph, Title } = Typography;

/**
 * Renders the editable import preview and review surface.
 */
const MarkdownImportPreviewCard: React.FC<IMarkdownImportPreviewCardProps> = ({
    previewPlan,
    onEditTask,
    onMetadataChange,
    onModuleChange,
    onRemoveModule,
    onRemoveTask,
}) => {
    const { styles } = useStyles();

    return (
        <Card className={styles.importPreviewCard}>
            <Space orientation="vertical" size={16} className={styles.pageRoot}>
                <div>
                    <Title level={4}>Preview and Review</Title>
                    <Paragraph type="secondary">
                        Edit the parsed metadata, remove bad rows, and fix task content
                        before saving the import as a draft plan.
                    </Paragraph>
                </div>

                {previewPlan?.plan ? (
                    <>
                        <div className={styles.metadataGrid}>
                            <Input
                                value={previewPlan.plan.name}
                                onChange={(event) =>
                                    onMetadataChange({ name: event.target.value })
                                }
                                placeholder="Plan name"
                                maxLength={200}
                            />
                            <Input
                                value={previewPlan.plan.targetAudience}
                                onChange={(event) =>
                                    onMetadataChange({
                                        targetAudience: event.target.value,
                                    })
                                }
                                placeholder="Target audience"
                                maxLength={200}
                            />
                            <InputNumber
                                min={1}
                                precision={0}
                                value={previewPlan.plan.durationDays}
                                onChange={(value) =>
                                    onMetadataChange({ durationDays: value ?? 1 })
                                }
                            />
                            <Input value="Draft preview" disabled />
                            <Input.TextArea
                                className={styles.fullWidthField}
                                value={previewPlan.plan.description}
                                onChange={(event) =>
                                    onMetadataChange({
                                        description: event.target.value,
                                    })
                                }
                                placeholder="Plan description"
                                rows={5}
                                maxLength={4000}
                            />
                        </div>

                        <MarkdownImportWarnings warnings={previewPlan.warnings} />

                        {previewPlan.canSave ? null : (
                            <Alert
                                className={styles.alert}
                                type="warning"
                                showIcon
                                title="This preview still has missing required values. Resolve the highlighted issues before saving."
                            />
                        )}

                        <MarkdownPreviewTable
                            modules={previewPlan.plan.modules}
                            onEditTask={onEditTask}
                            onModuleChange={onModuleChange}
                            onRemoveModule={onRemoveModule}
                            onRemoveTask={onRemoveTask}
                        />
                    </>
                ) : (
                    <Empty
                        className={styles.emptyState}
                        description="Generate a preview to review parsed plan content."
                    />
                )}
            </Space>
        </Card>
    );
};

export default MarkdownImportPreviewCard;
