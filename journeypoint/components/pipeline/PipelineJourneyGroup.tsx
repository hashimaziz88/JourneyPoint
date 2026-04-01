"use client";

import React from "react";
import { Collapse, Tag, Typography } from "antd";
import PipelineColumn from "@/components/pipeline/PipelineColumn";
import { useStyles } from "@/components/pipeline/style/style";
import type { PipelineJourneyGroupProps } from "@/types/pipeline/components";

const { Text } = Typography;

/**
 * Renders one onboarding-plan group in the pipeline as a collapsible panel.
 * Groups are expanded by default so facilitators see all data on first load.
 */
const PipelineJourneyGroup: React.FC<PipelineJourneyGroupProps> = ({
    group,
    onOpenHire,
    onOpenJourney,
}) => {
    const { styles } = useStyles();

    const groupLabel = (
        <span className={styles.collapseLabel}>
            <span className={styles.collapseLabelTitle}>{group.planName}</span>
            <Tag style={{ marginInlineEnd: 0 }}>{group.totalHires} enrolled</Tag>
            {group.atRiskCount > 0 && (
                <Tag color="error" style={{ marginInlineEnd: 0 }}>{group.atRiskCount} at risk</Tag>
            )}
            <Text type="secondary" className={styles.collapseLabelMeta}>
                {group.columns.length} stage{group.columns.length === 1 ? "" : "s"}
            </Text>
        </span>
    );

    const panelItems = [
        {
            key: group.planId,
            label: groupLabel,
            children: (
                <div className={styles.kanbanScroller}>
                    {group.columns.map((column) => (
                        <PipelineColumn
                            key={column.columnKey}
                            column={column}
                            onOpenHire={onOpenHire}
                            onOpenJourney={onOpenJourney}
                        />
                    ))}
                </div>
            ),
        },
    ];

    return (
        <Collapse
            defaultActiveKey={[group.planId]}
            className={styles.journeyGroup}
            items={panelItems}
        />
    );
};

export default PipelineJourneyGroup;
