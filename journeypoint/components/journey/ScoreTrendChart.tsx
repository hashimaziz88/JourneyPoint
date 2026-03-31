"use client";

import React from "react";
import { Card, Empty, Space, Statistic, Typography } from "antd";
import { useStyles } from "@/components/engagement/style/style";
import type { IScoreTrendChartProps } from "@/types/engagement/components";
import {
    getTrendChartModel,
    getTrendDeltaLabel,
    TREND_GRID_LINES,
} from "@/utils/engagement/chart";
import { formatDisplayDateTime } from "@/utils/date";

const { Paragraph, Text, Title } = Typography;

/**
 * Renders the hire-level engagement score trend from persisted snapshot history.
 */
const ScoreTrendChart: React.FC<IScoreTrendChartProps> = ({
    currentSnapshot,
    snapshotHistory,
}) => {
    const { styles } = useStyles();
    const chartModel = getTrendChartModel(currentSnapshot, snapshotHistory);

    if (!chartModel) {
        return (
            <Card title="Score Trend" className={styles.trendCard}>
                <Empty
                    className={styles.emptyState}
                    description="No engagement snapshots have been recorded yet."
                />
            </Card>
        );
    }

    return (
        <Card title="Score Trend" className={styles.trendCard}>
            <Space orientation="vertical" size={16} className={styles.sectionStack}>
                <div className={styles.trendHeader}>
                    <div>
                        <Title level={5}>Engagement over time</Title>
                        <Paragraph type="secondary">
                            {getTrendDeltaLabel(chartModel)}
                        </Paragraph>
                        {chartModel.hasRepeatedSameDaySnapshots ? (
                            <Paragraph type="secondary">
                                Multiple snapshots were recorded on the same day, so the chart
                                is using date-and-time tick labels instead of repeating one date.
                            </Paragraph>
                        ) : null}
                    </div>

                    <Space size={24}>
                        <Statistic
                            title="Latest score"
                            value={chartModel.latestScore}
                            precision={0}
                            suffix="%"
                        />
                        <Statistic
                            title="Range"
                            value={`${Math.round(chartModel.lowestScore)}-${Math.round(
                                chartModel.highestScore,
                            )}%`}
                        />
                    </Space>
                </div>

                <div className={styles.trendChartWrap}>
                    <svg
                        className={styles.trendSvg}
                        viewBox={`0 0 ${chartModel.width} ${180}`}
                        role="img"
                        aria-label="Engagement score trend chart"
                    >
                        {TREND_GRID_LINES.map((gridLine) => (
                            <g key={gridLine.key}>
                                <line
                                    x1={24}
                                    y1={gridLine.y}
                                    x2={chartModel.width - 24}
                                    y2={gridLine.y}
                                    stroke="#d9d9d9"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={0}
                                    y={gridLine.y + 4}
                                    fontSize="12"
                                    fill="#8c8c8c"
                                >
                                    {gridLine.label}
                                </text>
                            </g>
                        ))}

                        <polyline
                            fill="none"
                            stroke="#1677ff"
                            strokeWidth="3"
                            points={chartModel.polylinePoints}
                        />

                        {chartModel.points.map((point) => (
                            <g key={point.key}>
                                <circle cx={point.x} cy={point.y} r="5" fill="#1677ff" />
                                <title>{point.tooltip}</title>
                            </g>
                        ))}

                        {chartModel.ticks.map((tick) => (
                            <g key={tick.key}>
                                <text
                                    x={tick.x}
                                    y={174}
                                    textAnchor="middle"
                                    fontSize="11"
                                    fill="#8c8c8c"
                                >
                                    {tick.label}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>

                <div className={styles.trendLegend}>
                    <Text type="secondary">
                        Latest snapshot: {formatDisplayDateTime(currentSnapshot?.computedAt)}
                    </Text>
                    <Text type="secondary">
                        Snapshot count: {chartModel.points.length}
                    </Text>
                </div>

                <div className={styles.trendLegend}>
                    <Text type="secondary">
                        Hover points to inspect exact snapshot timestamps and scores.
                    </Text>
                    <Text type="secondary">
                        Flat runs indicate unchanged scores across repeated computations.
                    </Text>
                </div>
            </Space>
        </Card>
    );
};

export default ScoreTrendChart;
