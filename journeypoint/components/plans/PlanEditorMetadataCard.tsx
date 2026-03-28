"use client";

import React from "react";
import { Card, Input, InputNumber, Space } from "antd";
import { useStyles } from "@/components/plans/style/style";
import {
    ONBOARDING_PLAN_STATUS_LABELS,
} from "@/types/onboarding-plan";
import type { IPlanEditorMetadataCardProps } from "@/types/plans/components";

/**
 * Renders the editable onboarding-plan metadata form.
 */
const PlanEditorMetadataCard: React.FC<IPlanEditorMetadataCardProps> = ({
    draftPlan,
    isDraftEditable,
    onMetadataChange,
}) => {
    const { styles } = useStyles();

    return (
        <Card className={styles.editorCard}>
            <Space orientation="vertical" size={16} className={styles.pageRoot}>
                <div className={styles.metadataGrid}>
                    <Input
                        value={draftPlan.name}
                        onChange={(event) => onMetadataChange({ name: event.target.value })}
                        placeholder="Plan name"
                        disabled={!isDraftEditable}
                        maxLength={200}
                    />
                    <Input
                        value={draftPlan.targetAudience}
                        onChange={(event) =>
                            onMetadataChange({ targetAudience: event.target.value })
                        }
                        placeholder="Target audience"
                        disabled={!isDraftEditable}
                        maxLength={200}
                    />
                    <InputNumber
                        min={1}
                        precision={0}
                        value={draftPlan.durationDays}
                        onChange={(value) => onMetadataChange({ durationDays: value ?? 1 })}
                        disabled={!isDraftEditable}
                    />
                    <Input value={ONBOARDING_PLAN_STATUS_LABELS[draftPlan.status]} disabled />
                    <Input.TextArea
                        className={styles.fullWidthField}
                        value={draftPlan.description}
                        onChange={(event) =>
                            onMetadataChange({ description: event.target.value })
                        }
                        placeholder="Describe the purpose and scope of this plan."
                        disabled={!isDraftEditable}
                        rows={5}
                        maxLength={4000}
                    />
                </div>
            </Space>
        </Card>
    );
};

export default PlanEditorMetadataCard;
