import type { HireLifecycleState } from "@/types/hire";
import type { JourneyStatus } from "@/types/journey";

export enum EngagementClassification {
    Healthy = 1,
    NeedsAttention = 2,
    AtRisk = 3,
}

export enum AtRiskFlagStatus {
    Active = 1,
    Acknowledged = 2,
    Resolved = 3,
}

export enum AtRiskResolutionType {
    ManualFacilitatorResolution = 1,
    AutomaticHealthyRecovery = 2,
    HireExited = 3,
}

export interface IEngagementSnapshotDto {
    id: string;
    completionRate: number;
    daysSinceLastActivity: number;
    overdueTaskCount: number;
    compositeScore: number;
    classification: EngagementClassification;
    computedAt: string;
}

export interface IAtRiskFlagDto {
    id: string;
    hireId: string;
    journeyId: string;
    status: AtRiskFlagStatus;
    raisedAt: string;
    classificationAtRaise: EngagementClassification;
    acknowledgedByUserId?: number | null;
    acknowledgedByDisplayName?: string | null;
    acknowledgedAt?: string | null;
    acknowledgementNotes?: string | null;
    resolvedByUserId?: number | null;
    resolvedByDisplayName?: string | null;
    resolvedAt?: string | null;
    resolutionType?: AtRiskResolutionType | null;
    resolutionNotes?: string | null;
}

export interface IHireIntelligenceDetailDto {
    hireId: string;
    journeyId?: string | null;
    onboardingPlanId: string;
    onboardingPlanName: string;
    managerUserId?: number | null;
    managerDisplayName?: string | null;
    fullName: string;
    emailAddress: string;
    roleTitle?: string | null;
    department?: string | null;
    startDate: string;
    hireStatus: HireLifecycleState;
    journeyStatus?: JourneyStatus | null;
    currentStageTitle?: string | null;
    currentSnapshot?: IEngagementSnapshotDto | null;
    snapshotHistory: IEngagementSnapshotDto[];
    activeFlag?: IAtRiskFlagDto | null;
    resolvedFlags: IAtRiskFlagDto[];
}

export interface IAcknowledgeAtRiskFlagRequest {
    flagId: string;
    acknowledgementNotes?: string | null;
}

export interface IResolveAtRiskFlagRequest {
    flagId: string;
    resolutionType: AtRiskResolutionType;
    resolutionNotes?: string | null;
}
