"use client";

import React, { useState } from "react";
import { Alert, Button, Card, Empty, Input, Select, Space, Tag, Typography, message } from "antd";
import EngagementBadge from "@/components/engagement/EngagementBadge";
import {
    AT_RISK_FLAG_STATUS_COLORS,
    AT_RISK_FLAG_STATUS_LABELS,
    AT_RISK_RESOLUTION_LABELS,
    FACILITATOR_RESOLUTION_OPTIONS,
} from "@/constants/engagement/interventions";
import { useStyles } from "@/components/engagement/style/style";
import { AtRiskFlagStatus, AtRiskResolutionType } from "@/types/engagement/engagement";
import type { AtRiskFlagPanelProps } from "@/types/engagement/components";
import { formatDisplayDateTime } from "@/utils/date";

const { Paragraph, Text, Title } = Typography;

/**
 * Renders the active at-risk intervention panel with acknowledge and resolve actions.
 */
const AtRiskFlagPanel: React.FC<AtRiskFlagPanelProps> = ({
    activeFlag,
    isPending,
    onAcknowledge,
    onResolve,
}) => {
    const { styles } = useStyles();
    const [messageApi, messageContextHolder] = message.useMessage();
    const [acknowledgementNotes, setAcknowledgementNotes] = useState("");
    const [resolutionNotes, setResolutionNotes] = useState("");
    const [resolutionType, setResolutionType] = useState<AtRiskResolutionType>(
        AtRiskResolutionType.ManualFacilitatorResolution,
    );

    const handleAcknowledge = async (): Promise<void> => {
        if (!activeFlag) {
            return;
        }

        const result = await onAcknowledge({
            flagId: activeFlag.id,
            acknowledgementNotes,
        });

        if (!result) {
            messageApi.error("The at-risk flag could not be acknowledged.");
            return;
        }

        setAcknowledgementNotes("");
        messageApi.success("At-risk flag acknowledged.");
    };

    const handleResolve = async (): Promise<void> => {
        if (!activeFlag) {
            return;
        }

        const result = await onResolve({
            flagId: activeFlag.id,
            resolutionType,
            resolutionNotes,
        });

        if (!result) {
            messageApi.error("The at-risk flag could not be resolved.");
            return;
        }

        setResolutionNotes("");
        setResolutionType(AtRiskResolutionType.ManualFacilitatorResolution);
        messageApi.success("At-risk flag resolved.");
    };

    if (!activeFlag) {
        return (
            <Card title="Active At-Risk Panel" className={styles.panelCard}>
                <Empty
                    className={styles.emptyState}
                    description="No active at-risk intervention is currently open for this hire."
                />
            </Card>
        );
    }

    return (
        <Card title="Active At-Risk Panel" className={styles.panelCard}>
            {messageContextHolder}
            <Space orientation="vertical" size={16} className={styles.sectionStack}>
                <Alert
                    type="warning"
                    title="This hire currently needs intervention."
                    description={`Raised ${formatDisplayDateTime(activeFlag.raisedAt)}.`}
                />

                <div className={styles.detailList}>
                    <div>
                        <Text type="secondary">Flag status</Text>
                        <div>
                            <Tag color={AT_RISK_FLAG_STATUS_COLORS[activeFlag.status]}>
                                {AT_RISK_FLAG_STATUS_LABELS[activeFlag.status]}
                            </Tag>
                        </div>
                    </div>

                    <div>
                        <Text type="secondary">Raised classification</Text>
                        <div>
                            <EngagementBadge
                                classification={activeFlag.classificationAtRaise}
                                hasActiveAtRiskFlag
                                compact
                            />
                        </div>
                    </div>

                    <div>
                        <Text type="secondary">Raised at</Text>
                        <Paragraph>{formatDisplayDateTime(activeFlag.raisedAt)}</Paragraph>
                    </div>

                    <div>
                        <Text type="secondary">Acknowledged by</Text>
                        <Paragraph>
                            {activeFlag.acknowledgedByDisplayName || "Not acknowledged yet"}
                        </Paragraph>
                    </div>

                    <div>
                        <Text type="secondary">Acknowledged at</Text>
                        <Paragraph>
                            {formatDisplayDateTime(activeFlag.acknowledgedAt)}
                        </Paragraph>
                    </div>

                    {activeFlag.acknowledgementNotes ? (
                        <div>
                            <Text type="secondary">Acknowledgement notes</Text>
                            <Paragraph className={styles.noteText}>
                                {activeFlag.acknowledgementNotes}
                            </Paragraph>
                        </div>
                    ) : null}
                </div>

                {activeFlag.status === AtRiskFlagStatus.Active ? (
                    <div className={styles.formStack}>
                        <Title level={5}>Acknowledge intervention</Title>
                        <Paragraph type="secondary">
                            Record the first owner or note so this risk moves from an open
                            alert into an acknowledged intervention.
                        </Paragraph>
                        <Input.TextArea
                            rows={4}
                            maxLength={2000}
                            placeholder="Capture the first intervention note or owner hand-off."
                            value={acknowledgementNotes}
                            onChange={(event) => setAcknowledgementNotes(event.target.value)}
                        />
                        <div className={styles.actionRow}>
                            <Button loading={isPending} onClick={() => void handleAcknowledge()}>
                                Acknowledge Flag
                            </Button>
                        </div>
                    </div>
                ) : null}

                <div className={styles.formStack}>
                    <Title level={5}>Resolve intervention</Title>
                    {activeFlag.status === AtRiskFlagStatus.Acknowledged ? (
                        <Paragraph type="secondary">
                            This flag is acknowledged and still open. Capture the final
                            resolution to move it into history.
                        </Paragraph>
                    ) : (
                        <Paragraph type="secondary">
                            You can resolve immediately, but acknowledgement is recommended
                            first so the intervention timeline stays complete.
                        </Paragraph>
                    )}
                    <Select
                        options={FACILITATOR_RESOLUTION_OPTIONS}
                        value={resolutionType}
                        onChange={(value) => setResolutionType(value as AtRiskResolutionType)}
                    />
                    <Input.TextArea
                        rows={4}
                        maxLength={2000}
                        placeholder="Summarize the intervention outcome or exit reason."
                        value={resolutionNotes}
                        onChange={(event) => setResolutionNotes(event.target.value)}
                    />
                    <div className={styles.actionRow}>
                        <Button type="primary" loading={isPending} onClick={() => void handleResolve()}>
                            Resolve Flag
                        </Button>
                    </div>
                    <Text type="secondary">
                        Resolution type: {AT_RISK_RESOLUTION_LABELS[resolutionType]}
                    </Text>
                </div>
            </Space>
        </Card>
    );
};

export default AtRiskFlagPanel;
