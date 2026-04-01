import type { EngagementSnapshotDto } from "@/types/engagement/engagement";
import type {
  TrendChartModel,
  TrendChartPoint,
  TrendChartTick,
} from "@/types/engagement/components";
import { formatDisplayDate, formatDisplayDateTime } from "@/utils/date";

const CHART_HEIGHT = 180;
const CHART_PADDING = 24;
const CHART_MIN_WIDTH = 320;
const CHART_MAX_WIDTH = 980;
const CHART_POINT_SPACING = 64;
const MIN_DOMAIN = 0;
const MAX_DOMAIN = 100;

const DATE_KEY_FORMATTER = new Intl.DateTimeFormat("en-ZA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const sortSnapshotsAscending = (
  snapshots: EngagementSnapshotDto[],
): EngagementSnapshotDto[] =>
  [...snapshots].sort(
    (leftSnapshot, rightSnapshot) =>
      new Date(leftSnapshot.computedAt).getTime() -
      new Date(rightSnapshot.computedAt).getTime(),
  );

const getChartWidth = (totalCount: number): number =>
  Math.min(
    CHART_MAX_WIDTH,
    Math.max(CHART_MIN_WIDTH, totalCount * CHART_POINT_SPACING),
  );

const getDateKey = (value: string): string =>
  DATE_KEY_FORMATTER.format(new Date(value));

const hasRepeatedSameDaySnapshots = (
  snapshots: EngagementSnapshotDto[],
): boolean => {
  const keys = snapshots.map((snapshot) => getDateKey(snapshot.computedAt));
  return new Set(keys).size !== keys.length;
};

const MS_IN_DAY = 1000 * 60 * 60 * 24;

const getActivationDayLabel = (
  computedAt: string,
  activationDate?: string | null,
): string => {
  if (!activationDate) {
    return formatDisplayDate(computedAt);
  }

  const activationTime = new Date(activationDate).getTime();
  const computedTime = new Date(computedAt).getTime();

  if (Number.isNaN(activationTime) || Number.isNaN(computedTime)) {
    return formatDisplayDate(computedAt);
  }

  const dayOffset = Math.max(
    0,
    Math.floor((computedTime - activationTime) / MS_IN_DAY),
  );
  return `Day ${dayOffset + 1}`;
};

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

  return [...new Set(rawIndexes)].sort(
    (leftIndex, rightIndex) => leftIndex - rightIndex,
  );
};

const mapPoint = (
  snapshot: EngagementSnapshotDto,
  index: number,
  totalCount: number,
  chartWidth: number,
  activationDate?: string | null,
): TrendChartPoint => {
  const usableWidth = chartWidth - CHART_PADDING * 2;
  const usableHeight = CHART_HEIGHT - CHART_PADDING * 2;
  const x =
    totalCount === 1
      ? chartWidth / 2
      : CHART_PADDING + (usableWidth / (totalCount - 1)) * index;
  const normalizedValue =
    (snapshot.compositeScore - MIN_DOMAIN) / (MAX_DOMAIN - MIN_DOMAIN);
  const y = CHART_HEIGHT - CHART_PADDING - usableHeight * normalizedValue;

  const dayLabel = getActivationDayLabel(snapshot.computedAt, activationDate);

  return {
    key: snapshot.id,
    x,
    y,
    value: snapshot.compositeScore,
    label: dayLabel,
    tooltip: `${dayLabel} (${formatDisplayDateTime(snapshot.computedAt)}) - ${Math.round(snapshot.compositeScore)}%`,
  };
};

const mapTicks = (
  points: TrendChartPoint[],
  totalCount: number,
): TrendChartTick[] =>
  getTickIndexes(totalCount).map((index) => ({
    key: points[index].key,
    x: points[index].x,
    label: points[index].label,
  }));

export const getTrendChartModel = (
  currentSnapshot: EngagementSnapshotDto | null | undefined,
  snapshotHistory: EngagementSnapshotDto[],
  activationDate?: string | null,
): TrendChartModel | null => {
  const hasCurrentSnapshot =
    currentSnapshot !== null && currentSnapshot !== undefined;
  let history = snapshotHistory;

  if (
    hasCurrentSnapshot &&
    !snapshotHistory.some((snapshot) => snapshot.id === currentSnapshot.id)
  ) {
    history = [...snapshotHistory, currentSnapshot];
  }

  const orderedSnapshots = sortSnapshotsAscending(history);

  if (orderedSnapshots.length === 0) {
    return null;
  }

  const repeatedSameDaySnapshots =
    hasRepeatedSameDaySnapshots(orderedSnapshots);
  const chartWidth = getChartWidth(orderedSnapshots.length);
  const points = orderedSnapshots.map((snapshot, index) =>
    mapPoint(
      snapshot,
      index,
      orderedSnapshots.length,
      chartWidth,
      activationDate,
    ),
  );
  const scores = orderedSnapshots.map((snapshot) => snapshot.compositeScore);
  const polylinePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
  const latestScore = orderedSnapshots.at(-1)?.compositeScore ?? 0;
  const previousScore =
    orderedSnapshots.length > 1
      ? orderedSnapshots.at(-2)?.compositeScore
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

export const getTrendDeltaLabel = (model: TrendChartModel | null): string => {
  if (model?.previousScore === undefined) {
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
