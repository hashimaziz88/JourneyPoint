import type { IEngagementSnapshotDto } from "@/types/engagement";
import type {
    ITrendChartModel,
    ITrendChartPoint,
    ITrendChartTick,
} from "@/types/engagement/components";
import { formatDisplayDate, formatDisplayDateTime } from "@/utils/date";

const CHART_HEIGHT = 180;
const CHART_PADDING = 24;
const CHART_MIN_WIDTH = 520;
const CHART_POINT_SPACING = 88;
const MIN_DOMAIN = 0;
const MAX_DOMAIN = 100;

const DATE_KEY_FORMATTER = new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

const sortSnapshotsAscending = (
    snapshots: IEngagementSnapshotDto[],
): IEngagementSnapshotDto[] =>
    [...snapshots].sort(
        (leftSnapshot, rightSnapshot) =>
            new Date(leftSnapshot.computedAt).getTime() -
            new Date(rightSnapshot.computedAt).getTime(),
    );

const getChartWidth = (totalCount: number): number =>
    Math.max(CHART_MIN_WIDTH, totalCount * CHART_POINT_SPACING);

const getDateKey = (value: string): string => DATE_KEY_FORMATTER.format(new Date(value));

const hasRepeatedSameDaySnapshots = (snapshots: IEngagementSnapshotDto[]): boolean => {
    const keys = snapshots.map((snapshot) => getDateKey(snapshot.computedAt));
    return new Set(keys).size !== keys.length;
};

const getPointLabel = (
    snapshot: IEngagementSnapshotDto,
    showTimeGranularity: boolean,
): string => (showTimeGranularity ? formatDisplayDateTime(snapshot.computedAt) : formatDisplayDate(snapshot.computedAt));

const getTickIndexes = (totalCount: number): number[] => {
    if (totalCount <= 4) {
        return Array.from({ length: totalCount }, (_, index) => index);
    }

    const rawIndexes = [
        0,
        Math.floor((totalCount - 1) / 3),
        Math.floor(((totalCount - 1) * 2) / 3),
        totalCount - 1,
    ];

    return [...new Set(rawIndexes)].sort((leftIndex, rightIndex) => leftIndex - rightIndex);
};

const mapPoint = (
    snapshot: IEngagementSnapshotDto,
    index: number,
    totalCount: number,
    chartWidth: number,
    showTimeGranularity: boolean,
): ITrendChartPoint => {
    const usableWidth = chartWidth - CHART_PADDING * 2;
    const usableHeight = CHART_HEIGHT - CHART_PADDING * 2;
    const x =
        totalCount === 1
            ? chartWidth / 2
            : CHART_PADDING + (usableWidth / (totalCount - 1)) * index;
    const normalizedValue = (snapshot.compositeScore - MIN_DOMAIN) / (MAX_DOMAIN - MIN_DOMAIN);
    const y = CHART_HEIGHT - CHART_PADDING - usableHeight * normalizedValue;

    return {
        key: snapshot.id,
        x,
        y,
        value: snapshot.compositeScore,
        label: getPointLabel(snapshot, showTimeGranularity),
        tooltip: `${getPointLabel(snapshot, true)} - ${Math.round(snapshot.compositeScore)}%`,
    };
};

const mapTicks = (
    points: ITrendChartPoint[],
    totalCount: number,
): ITrendChartTick[] =>
    getTickIndexes(totalCount).map((index) => ({
        key: points[index].key,
        x: points[index].x,
        label: points[index].label,
    }));

export const getTrendChartModel = (
    currentSnapshot: IEngagementSnapshotDto | null | undefined,
    snapshotHistory: IEngagementSnapshotDto[],
): ITrendChartModel | null => {
    const history = currentSnapshot
        ? snapshotHistory.some((snapshot) => snapshot.id === currentSnapshot.id)
            ? snapshotHistory
            : [...snapshotHistory, currentSnapshot]
        : snapshotHistory;
    const orderedSnapshots = sortSnapshotsAscending(history);

    if (orderedSnapshots.length === 0) {
        return null;
    }

    const repeatedSameDaySnapshots = hasRepeatedSameDaySnapshots(orderedSnapshots);
    const chartWidth = getChartWidth(orderedSnapshots.length);
    const points = orderedSnapshots.map((snapshot, index) =>
        mapPoint(
            snapshot,
            index,
            orderedSnapshots.length,
            chartWidth,
            repeatedSameDaySnapshots,
        ),
    );
    const scores = orderedSnapshots.map((snapshot) => snapshot.compositeScore);
    const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
    const latestScore = orderedSnapshots[orderedSnapshots.length - 1].compositeScore;
    const previousScore =
        orderedSnapshots.length > 1
            ? orderedSnapshots[orderedSnapshots.length - 2].compositeScore
            : undefined;

    return {
        width: chartWidth,
        points,
        ticks: mapTicks(points, orderedSnapshots.length),
        polylinePoints,
        latestScore,
        previousScore,
        lowestScore: Math.min(...scores),
        highestScore: Math.max(...scores),
        hasRepeatedSameDaySnapshots: repeatedSameDaySnapshots,
    };
};

export const getTrendDeltaLabel = (model: ITrendChartModel | null): string => {
    if (!model || model.previousScore === undefined) {
        return "No previous comparison yet";
    }

    const delta = Math.round(model.latestScore - model.previousScore);

    if (delta === 0) {
        return "Stable since the last snapshot";
    }

    return delta > 0 ? `Up ${delta} points` : `Down ${Math.abs(delta)} points`;
};

export const TREND_GRID_LINES = [0, 50, 100].map((value) => {
    const usableHeight = CHART_HEIGHT - CHART_PADDING * 2;
    const normalizedValue = (value - MIN_DOMAIN) / (MAX_DOMAIN - MIN_DOMAIN);

    return {
        key: value,
        label: `${value}`,
        y: CHART_HEIGHT - CHART_PADDING - usableHeight * normalizedValue,
    };
});

export const TREND_CHART_DIMENSIONS = {
    height: CHART_HEIGHT,
    padding: CHART_PADDING,
};
