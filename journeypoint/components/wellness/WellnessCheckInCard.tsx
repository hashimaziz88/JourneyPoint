"use client";

import React from "react";
import { Button, Card, Progress, Space, Typography } from "antd";
import { WellnessCheckInStatus, type WellnessCheckInSummaryDto } from "@/types/wellness/wellness";
import WellnessStatusBadge from "@/components/wellness/WellnessStatusBadge";
import { useStyles } from "@/components/wellness/style/style";

interface WellnessCheckInCardProps {
    checkIn: WellnessCheckInSummaryDto;
    onOpen: (checkInId: string) => void;
    readonly?: boolean;
}

/**
 * Renders one wellness check-in summary card with period, status, and progress.
 */
const WellnessCheckInCard: React.FC<WellnessCheckInCardProps> = ({
    checkIn,
    onOpen,
    readonly = false,
}) => {
    const { styles } = useStyles();

    const progressPercent =
        checkIn.totalCount > 0
            ? Math.round((checkIn.answeredCount / checkIn.totalCount) * 100)
            : 0;

    const scheduledDate = new Date(checkIn.scheduledDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const canOpen = checkIn.totalCount > 0;
    const isEditable =
        !readonly && checkIn.status !== WellnessCheckInStatus.Completed;

    return (
        <Card size="small">
            <Space orientation="vertical" className={styles.pageRoot}>
                <div className={styles.cardHeader}>
                    <div>
                        <Typography.Text strong>{checkIn.periodLabel}</Typography.Text>
                        <br />
                        <Typography.Text type="secondary" className={styles.smallText}>
                            Scheduled: {scheduledDate}
                        </Typography.Text>
                    </div>
                    <WellnessStatusBadge status={checkIn.status} />
                </div>

                {checkIn.totalCount > 0 && (
                    <div>
                        <Typography.Text type="secondary" className={styles.smallText}>
                            {checkIn.answeredCount} / {checkIn.totalCount} answered
                        </Typography.Text>
                        <Progress
                            percent={progressPercent}
                            size="small"
                            status={checkIn.status === WellnessCheckInStatus.Completed ? "success" : "active"}
                            showInfo={false}
                        />
                    </div>
                )}

                {checkIn.status === WellnessCheckInStatus.Pending && checkIn.totalCount === 0 && (
                    <Typography.Text type="secondary" className={styles.smallText}>
                        Questions will be generated when this period is reached.
                    </Typography.Text>
                )}

                {canOpen && (
                    <Button
                        size="small"
                        type={isEditable ? "primary" : "default"}
                        onClick={() => onOpen(checkIn.id)}
                    >
                        {isEditable ? "Open" : "View"}
                    </Button>
                )}
            </Space>
        </Card>
    );
};

export default WellnessCheckInCard;
