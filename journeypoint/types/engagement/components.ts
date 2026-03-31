import type {
  EngagementClassification,
  IAcknowledgeAtRiskFlagRequest,
  IAtRiskFlagDto,
  IEngagementSnapshotDto,
  IResolveAtRiskFlagRequest,
} from "@/types/engagement";

export interface IEngagementBadgeProps {
  classification: EngagementClassification;
  compositeScore?: number;
  hasActiveAtRiskFlag?: boolean;
  compact?: boolean;
}

export interface IScoreTrendChartProps {
  activationDate?: string | null;
  currentSnapshot?: IEngagementSnapshotDto | null;
  snapshotHistory: IEngagementSnapshotDto[];
}

export interface IAtRiskFlagPanelProps {
  activeFlag?: IAtRiskFlagDto | null;
  isPending: boolean;
  onAcknowledge: (payload: IAcknowledgeAtRiskFlagRequest) => Promise<boolean>;
  onResolve: (payload: IResolveAtRiskFlagRequest) => Promise<boolean>;
}

export interface IInterventionHistoryPanelProps {
  resolvedFlags: IAtRiskFlagDto[];
}

export interface ITrendChartPoint {
  key: string;
  x: number;
  y: number;
  value: number;
  label: string;
  tooltip: string;
}

export interface ITrendChartTick {
  key: string;
  x: number;
  label: string;
}

export interface ITrendChartModel {
  width: number;
  points: ITrendChartPoint[];
  ticks: ITrendChartTick[];
  polylinePoints: string;
  latestScore: number;
  previousScore?: number;
  lowestScore: number;
  highestScore: number;
  hasRepeatedSameDaySnapshots: boolean;
}
