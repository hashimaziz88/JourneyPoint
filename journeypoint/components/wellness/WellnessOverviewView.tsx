"use client";

import React, { startTransition, useEffect, useEffectEvent } from "react";
import { Alert, Empty, Space, Spin, Statistic, Typography } from "antd";
import {
    useWellnessActions,
    useWellnessState,
} from "@/providers/wellnessProvider";
import WellnessCheckInCard from "@/components/wellness/WellnessCheckInCard";
import { useStyles } from "@/components/wellness/style/style";
import { useRouter } from "next/navigation";

interface WellnessOverviewViewProps {
    hireId: string;
    checkInRoute: (checkInId: string) => string;
    readonly?: boolean;
}

/**
 * Renders the list of all wellness check-ins for one hire with period timeline and progress.
 * Used by HR facilitators, managers (read-only), and the hire (interactive).
 */
const WellnessOverviewView: React.FC<WellnessOverviewViewProps> = ({
    hireId,
    checkInRoute,
    readonly = false,
}) => {
    const { styles } = useStyles();
    const router = useRouter();
    const { getHireWellnessOverview } = useWellnessActions();
    const { overview, isOverviewPending } = useWellnessState();

    const loadOverview = useEffectEvent(async (): Promise<void> => {
        await getHireWellnessOverview(hireId);
    });

    useEffect(() => {
        void loadOverview();
    }, [hireId]);

    const handleOpenCheckIn = (checkInId: string): void => {
        startTransition(() => {
            router.push(checkInRoute(checkInId));
        });
    };

    if (isOverviewPending) {
        return <Spin size="large" />;
    }

    if (!overview) {
        return (
            <Alert
                type="error"
                showIcon
                title="Wellness data could not be loaded."
                description="Try refreshing the page."
            />
        );
    }

    if (overview.checkIns.length === 0) {
        return (
            <Empty description="No wellness check-ins have been scheduled yet. They are generated when the journey is activated." />
        );
    }

    return (
        <Space orientation="vertical" size={16} className={styles.pageRoot}>
            <div className={styles.statsRow}>
                <Statistic title="Completed" value={overview.completedCount} suffix={`/ ${overview.totalCount}`} />
            </div>

            <Typography.Text type="secondary">
                Check-ins are scheduled at Day 1, Day 2, end of Week 1, then monthly.
            </Typography.Text>

            <div className={styles.checkInGrid}>
                {overview.checkIns.map((checkIn) => (
                    <WellnessCheckInCard
                        key={checkIn.id}
                        checkIn={checkIn}
                        onOpen={handleOpenCheckIn}
                        readonly={readonly}
                    />
                ))}
            </div>
        </Space>
    );
};

export default WellnessOverviewView;
