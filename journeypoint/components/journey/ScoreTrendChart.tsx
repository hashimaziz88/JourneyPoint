"use client";

import React from "react";
import { Card, Empty, Space, Typography } from "antd";
import { useStyles } from "@/components/engagement/style/style";
import type { IScoreTrendChartProps } from "@/types/engagement/components";
import {
    getTrendChartModel,
    getTrendDeltaLabel,
} from "@/utils/engagement/chart";
import { formatDisplayDateTime } from "@/utils/date";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const { Paragraph, Text, Title } = Typography;

/**
 * Renders the hire-level engagement score trend from persisted snapshot history.
 */
const ScoreTrendChart: React.FC<IScoreTrendChartProps> = ({
    activationDate,
    currentSnapshot,
    snapshotHistory,
}) => {
    const { styles } = useStyles();
    const chartModel = getTrendChartModel(
        currentSnapshot,
        snapshotHistory,
        activationDate,
    );

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

    const previousScore = chartModel.previousScore;
    let scoreDelta: number | null = null;
    let scoreDeltaText = "";
    const chartSeries = chartModel.points.map((point) => ({
        key: point.key,
        label: point.label,
        score: Math.round(point.value),
        tooltip: point.tooltip,
    }));

    if (previousScore === undefined) {
        scoreDeltaText = "No prior comparison";
    } else {
        scoreDelta = Math.round(chartModel.latestScore - previousScore);

        if (scoreDelta === 0) {
            scoreDeltaText = "No change";
        } else if (scoreDelta > 0) {
            scoreDeltaText = `+${scoreDelta} points`;
        } else {
            scoreDeltaText = `${scoreDelta} points`;
        }
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
                        <Paragraph type="secondary">
                            Timeline labels are shown as days since activation.
                        </Paragraph>
                    </div>

                    <div className={styles.trendSummaryGrid}>
                        <div className={styles.trendSummaryItem}>
                            <Text type="secondary">Latest</Text>
                            <Title level={4}>{Math.round(chartModel.latestScore)}%</Title>
                        </div>
                        <div className={styles.trendSummaryItem}>
                            <Text type="secondary">Delta</Text>
                            <Title level={4}>{scoreDeltaText}</Title>
                        </div>
                        <div className={styles.trendSummaryItem}>
                            <Text type="secondary">Range</Text>
                            <Title level={4}>
                                {Math.round(chartModel.lowestScore)}-{Math.round(
                                    chartModel.highestScore,
                                )}
                                %
                            </Title>
                        </div>
                    </div>
                </div>

                <div className={styles.trendChartWrap} aria-label="Engagement score trend chart">
                    <div className={styles.trendChartCanvas}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartSeries} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="engagementScoreFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#1677ff" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#1677ff" stopOpacity={0.04} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    interval="preserveStartEnd"
                                    minTickGap={32}
                                    tick={{ fontSize: 11 }}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tickCount={5}
                                    width={36}
                                    tick={{ fontSize: 11 }}
                                />
                                <Tooltip
                                    formatter={(value: unknown) => {
                                        const resolvedValue = Array.isArray(value)
                                            ? value[0]
                                            : value;
                                        const displayValue =
                                            resolvedValue === undefined || resolvedValue === null
                                                ? "-"
                                                : String(resolvedValue);

                                        return [`${displayValue}%`, "Score"];
                                    }}
                                    labelFormatter={(_, payload) => {
                                        if (!payload || payload.length === 0) {
                                            return "";
                                        }

                                        const row = payload[0].payload as { tooltip?: string };
                                        return row.tooltip ?? "";
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#1677ff"
                                    strokeWidth={3}
                                    fill="url(#engagementScoreFill)"
                                    activeDot={{ r: 5 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
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
                        Trend is ordered oldest to newest from left to right.
                    </Text>
                    <Text type="secondary">
                        Day markers are calculated from the hire activation date.
                    </Text>
                </div>
            </Space>
        </Card>
    );
};

export default ScoreTrendChart;
