"use client";

import React from "react";
import { Card, Input, Space, Typography, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useStyles } from "@/components/plans/style/style";
import type { MarkdownImportSourceCardProps } from "@/types/plans/components";

const { Paragraph, Text, Title } = Typography;

/**
 * Renders the source-input card for document-backed plan import.
 */
const MarkdownImportSourceCard: React.FC<MarkdownImportSourceCardProps> = ({
    sourceContent,
    sourceContentType,
    sourceFileName,
    uploadProps,
    onSourceContentChange,
}) => {
    const { styles } = useStyles();

    return (
        <Card className={styles.importSourceCard}>
            <Space orientation="vertical" size={16} className={styles.pageRoot}>
                <div>
                    <Title level={4}>Source Document</Title>
                    <Paragraph type="secondary">
                        Start with whatever source material you have. Clean markdown still
                        previews fastest, but rough markdown, text, PDFs, and image documents
                        can be normalized on the backend into the required draft shape for
                        review.
                    </Paragraph>
                </div>

                <Upload.Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Drop a document here or click to load one.
                    </p>
                    <p className="ant-upload-hint">
                        Review is mandatory before any draft is created.
                    </p>
                </Upload.Dragger>

                {sourceFileName ? (
                    <Text type="secondary">
                        Loaded file: {sourceFileName}
                        {sourceContentType ? ` (${sourceContentType})` : ""}
                    </Text>
                ) : null}

                <Input.TextArea
                    className={styles.importTextArea}
                    value={sourceContent}
                    onChange={(event) =>
                        onSourceContentChange(event.target.value, sourceFileName)
                    }
                    placeholder="Paste onboarding source text here. Typing here replaces any uploaded binary file as the active preview source."
                    rows={18}
                />
            </Space>
        </Card>
    );
};

export default MarkdownImportSourceCard;
