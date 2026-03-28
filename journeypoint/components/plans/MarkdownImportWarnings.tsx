"use client";

import React from "react";
import { Alert } from "antd";
import { useStyles } from "@/components/plans/style/style";
import type { IMarkdownImportWarningsProps } from "@/types/plans/components";
import { buildMarkdownWarningMessage } from "@/utils/plans/markdownImport";

/**
 * Renders parser warnings that require facilitator review before save.
 */
const MarkdownImportWarnings: React.FC<IMarkdownImportWarningsProps> = ({
    warnings,
}) => {
    const { styles } = useStyles();

    if (warnings.length === 0) {
        return null;
    }

    return (
        <Alert
            className={styles.alert}
            type="warning"
            showIcon
            title="Review parser warnings before saving the imported draft."
            description={
                <ul className={styles.warningsList}>
                    {warnings.map((warning, index) => (
                        <li key={`${warning.code}-${index}`}>
                            {buildMarkdownWarningMessage(warning)}
                        </li>
                    ))}
                </ul>
            }
        />
    );
};

export default MarkdownImportWarnings;
