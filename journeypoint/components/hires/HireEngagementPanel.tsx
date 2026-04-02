"use client";

import React from "react";
import { Card, Space, Statistic, Typography } from "antd";
import EngagementBadge from "@/components/engagement/EngagementBadge";
import ScoreTrendChart from "@/components/journey/ScoreTrendChart";
import { useStyles } from "@/components/hires/style/style";
import type { HireIntelligenceDetailDto } from "@/types/engagement/engagement";

const { Paragraph } = Typography;

interface HireEngagementPanelProps {
    activatedAt?: string | null;
    intelligence: HireIntelligenceDetailDto | null;
}

/**
 * Renders the engagement snapshot, score trend chart, or empty state
 * for one hire inside the detail view engagement tab.
 */
const HireEngagementPanel: React.FC<HireEngagementPanelProps> = ({
    activatedAt,
    intelligence,
}) => {
    const { styles } = useStyles();
    const currentSnapshot = intelligence?.currentSnapshot;

    if (!currentSnapshot) {
        return (
            <Card>
                <Paragraph type="secondary">
                    Engagement snapshots will appear here after the intelligence
                    service computes the first score for this hire.
                </Paragraph>
            </Card>
        );
    }

    return (
        <Space orientation="vertical" size={16} className={styles.pageRoot}>
            <Card title="Current Engagement">
                <Space orientation="vertical" size={16} className={styles.pageRoot}>
                    <EngagementBadge
                        classification={currentSnapshot.classification}
                        compositeScore={currentSnapshot.compositeScore}
                        hasActiveAtRiskFlag={Boolean(intelligence?.activeFlag)}
                    />
                    <div className={styles.summaryGrid}>
                        <Statistic title="Composite score" value={currentSnapshot.compositeScore} precision={0} suffix="%" />
                        <Statistic title="Completion rate" value={currentSnapshot.completionRate} precision={0} suffix="%" />
                        <Statistic title="Days since activity" value={currentSnapshot.daysSinceLastActivity} />
                        <Statistic title="Overdue tasks" value={currentSnapshot.overdueTaskCount} />
                        <Statistic title="Snapshots" value={intelligence?.snapshotHistory.length ?? 0} />
                    </div>
                    <Paragraph type="secondary">
                        Current stage: {intelligence?.currentStageTitle || "Not available"}
                    </Paragraph>
                </Space>
            </Card>
            <ScoreTrendChart
                activationDate={activatedAt}
                currentSnapshot={currentSnapshot}
                snapshotHistory={intelligence?.snapshotHistory ?? []}
            />
        </Space>
    );
};

export default HireEngagementPanel;
