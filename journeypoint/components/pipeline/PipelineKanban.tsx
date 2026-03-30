"use client";

import React from "react";
import PipelineColumn from "@/components/pipeline/PipelineColumn";
import { useStyles } from "@/components/pipeline/style/style";
import type { IPipelineKanbanProps } from "@/types/pipeline/components";

/**
 * Renders the facilitator pipeline board from backend-ordered column payloads.
 */
const PipelineKanban: React.FC<IPipelineKanbanProps> = ({
    columns,
    onOpenHire,
    onOpenJourney,
}) => {
    const { styles } = useStyles();

    return (
        <div className={styles.kanbanScroller}>
            {columns.map((column) => (
                <PipelineColumn
                    key={column.columnKey}
                    column={column}
                    onOpenHire={onOpenHire}
                    onOpenJourney={onOpenJourney}
                />
            ))}
        </div>
    );
};

export default PipelineKanban;
