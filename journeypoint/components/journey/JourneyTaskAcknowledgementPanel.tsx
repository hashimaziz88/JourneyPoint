"use client";

import React from "react";
import { Alert, Button, Space } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useStyles } from "@/components/journey/style/style";
import type { IJourneyTaskAcknowledgementPanelProps } from "@/types/journey/components";
import { getAcknowledgementLabel } from "@/utils/journey/dashboard";

/**
 * Renders acknowledgement guidance and action controls for one participant task.
 */
const JourneyTaskAcknowledgementPanel: React.FC<IJourneyTaskAcknowledgementPanelProps> = ({
    task,
    isPending,
    onAcknowledge,
}) => {
    const { styles } = useStyles();

    if (!task.canAcknowledge && !task.acknowledgedAt) {
        return (
            <Alert
                type="info"
                title={getAcknowledgementLabel(task.acknowledgementRule)}
                description="This task can be completed immediately without a separate acknowledgement step."
            />
        );
    }

    if (task.acknowledgedAt) {
        return (
            <Alert
                type="success"
                title="Task acknowledged"
                description="You have already acknowledged this task and can complete it when ready."
            />
        );
    }

    return (
        <Space orientation="vertical" size={12} className={styles.fullWidthStack}>
            <Alert
                type="warning"
                title={getAcknowledgementLabel(task.acknowledgementRule)}
                description="Please acknowledge this task before marking it complete."
            />
            <Button
                icon={<CheckOutlined />}
                loading={isPending}
                onClick={() => void onAcknowledge()}
            >
                Acknowledge task
            </Button>
        </Space>
    );
};

export default JourneyTaskAcknowledgementPanel;
