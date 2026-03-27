"use client";

import React from "react";
import { Alert } from "antd";
import { useStyles } from "@/components/plans/style/style";
import type { IMarkdownImportWarningDto } from "@/types/markdown-import";

interface IMarkdownImportWarningsProps {
    warnings: IMarkdownImportWarningDto[];
}

const buildWarningMessage = (warning: IMarkdownImportWarningDto): string => {
    const locationParts = [
        warning.sectionName ? `Section: ${warning.sectionName}` : null,
        warning.lineNumber ? `Line: ${warning.lineNumber}` : null,
    ].filter(Boolean);

    return locationParts.length > 0
        ? `${warning.message} (${locationParts.join(" | ")})`
        : warning.message;
};

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
                            {buildWarningMessage(warning)}
                        </li>
                    ))}
                </ul>
            }
        />
    );
};

export default MarkdownImportWarnings;
