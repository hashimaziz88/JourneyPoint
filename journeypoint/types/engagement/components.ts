import type {
    AcknowledgeAtRiskFlagRequest,
    AtRiskFlagDto,
    EngagementClassification,
    EngagementSnapshotDto,
    ResolveAtRiskFlagRequest,
} from "@/types/engagement/engagement";

export type EngagementBadgeProps = {
    classification: EngagementClassification;
    compositeScore?: number;
    hasActiveAtRiskFlag?: boolean;
    compact?: boolean;
};

export type ScoreTrendChartProps = {
    activationDate?: string | null;
    currentSnapshot?: EngagementSnapshotDto | null;
    snapshotHistory: EngagementSnapshotDto[];
};

export type AtRiskFlagPanelProps = {
    activeFlag?: AtRiskFlagDto | null;
    isPending: boolean;
    onAcknowledge: (payload: AcknowledgeAtRiskFlagRequest) => Promise<boolean>;
    onResolve: (payload: ResolveAtRiskFlagRequest) => Promise<boolean>;
};

export type InterventionHistoryPanelProps = {
    resolvedFlags: AtRiskFlagDto[];
};

export type TrendChartPoint = {
    key: string;
    x: number;
    y: number;
    value: number;
    label: string;
    tooltip: string;
};

export type TrendChartTick = {
    key: string;
    x: number;
    label: string;
};

export type TrendChartModel = {
    width: number;
    points: TrendChartPoint[];
    ticks: TrendChartTick[];
    polylinePoints: string;
    latestScore: number;
    previousScore?: number;
    lowestScore: number;
    highestScore: number;
    hasRepeatedSameDaySnapshots: boolean;
};
