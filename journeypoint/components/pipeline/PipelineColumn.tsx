"use client";

import React from "react";
import { Card, Empty, Tag, Typography } from "antd";
import HirePipelineCard from "@/components/pipeline/HirePipelineCard";
import { useStyles } from "@/components/pipeline/style/style";
import type { IPipelineColumnProps } from "@/types/pipeline/components";
import { getPipelineColumnSummary } from "@/utils/pipeline/board";

const { Paragraph, Title } = Typography;

/**
 * Renders one ordered facilitator pipeline column with its hire cards.
 */
const PipelineColumn: React.FC<IPipelineColumnProps> = ({
    column,
    onOpenHire,
    onOpenJourney,
}) => {
    const { styles } = useStyles();
    const summary = getPipelineColumnSummary(column.hires);

    return (
        <Card className={styles.columnCard}>
            <div className={styles.columnHeader}>
                <div>
                    <Title level={4}>{column.columnTitle}</Title>
                    <Paragraph type="secondary">
                        {summary.totalHires} hire{summary.totalHires === 1 ? "" : "s"} in this stage.
                    </Paragraph>
                </div>
                <div className={styles.columnMeta}>
                    <Tag>{summary.totalHires} total</Tag>
                    {summary.atRiskHireCount > 0 ? (
                        <Tag color="error">{summary.atRiskHireCount} flagged</Tag>
                    ) : null}
                </div>
            </div>

            {column.hires.length > 0 ? (
                <div className={styles.columnList}>
                    {column.hires.map((hire) => (
                        <HirePipelineCard
                            key={hire.hireId}
                            hire={hire}
                            onOpenHire={onOpenHire}
                            onOpenJourney={onOpenJourney}
                        />
                    ))}
                </div>
            ) : (
                <Empty description="No hires in this column." />
            )}
        </Card>
    );
};

export default PipelineColumn;
