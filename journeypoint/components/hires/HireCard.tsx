"use client";

import React from "react";
import { Button, Card, Space, Tag, Typography } from "antd";
import {
    HIRE_STATUS_LABELS,
    HIRE_STATUS_TAG_COLORS,
} from "@/constants/hire/list";
import {
    JOURNEY_STATUS_LABELS,
    JOURNEY_STATUS_TAG_COLORS,
} from "@/constants/journey/review";
import type { HireCardProps } from "@/types/hire/components";
import { formatDisplayDate } from "@/utils/date";
import { useStyles } from "@/components/hires/style/style";

const { Paragraph, Text, Title } = Typography;

/**
 * Presents one hire summary card for the facilitator list view.
 */
const HireCard: React.FC<HireCardProps> = ({ hire, onOpenDetail, onOpenJourney }) => {
    const { styles } = useStyles();

    return (
        <Card className={styles.hireCard}>
            <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                    <div>
                        <Title level={4}>{hire.fullName}</Title>
                        <Paragraph type="secondary">{hire.emailAddress}</Paragraph>
                    </div>

                    <div className={styles.statusTags}>
                        <span><Text type="secondary">Status:</Text>{" "}
                            <Tag color={HIRE_STATUS_TAG_COLORS[hire.status]}>
                                {HIRE_STATUS_LABELS[hire.status]}
                            </Tag></span>
                        {hire.journeyStatus ? (
                            <span><Text type="secondary">Journey:</Text>{" "}
                                <Tag color={JOURNEY_STATUS_TAG_COLORS[hire.journeyStatus]}>
                                    {JOURNEY_STATUS_LABELS[hire.journeyStatus]}
                                </Tag></span>
                        ) : (
                            <span><Text type="secondary">Journey:</Text>{" "}
                                <Tag>No journey yet</Tag></span>
                        )}
                    </div>
                </div>

                <div className={styles.detailMeta}>
                    <div className={styles.statBlock}>
                        <Text type="secondary">Plan</Text>
                        <Paragraph>{hire.onboardingPlanName}</Paragraph>
                    </div>
                    <div className={styles.statBlock}>
                        <Text type="secondary">Start date</Text>
                        <Paragraph>{formatDisplayDate(hire.startDate)}</Paragraph>
                    </div>
                    <div className={styles.statBlock}>
                        <Text type="secondary">Role</Text>
                        <Paragraph>{hire.roleTitle || "Not supplied"}</Paragraph>
                    </div>
                    <div className={styles.statBlock}>
                        <Text type="secondary">Department</Text>
                        <Paragraph>{hire.department || "Not supplied"}</Paragraph>
                    </div>
                </div>

                <Space wrap className={styles.actionRow}>
                    <Button type="primary" onClick={() => onOpenDetail(hire.id)}>
                        View Hire
                    </Button>
                    <Button onClick={() => onOpenJourney(hire.id)}>
                        {hire.journeyId ? "Review Journey" : "Generate Journey"}
                    </Button>
                </Space>
            </div>
        </Card>
    );
};

export default HireCard;
