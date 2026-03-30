export enum EngagementClassification {
    Healthy = 1,
    NeedsAttention = 2,
    AtRisk = 3,
}

export interface IGetPipelineBoardInput {
    keyword?: string | null;
    classification?: EngagementClassification | null;
    skipCount: number;
    maxResultCount: number;
    sorting?: string | null;
}

export interface IPipelineHireCardDto {
    hireId: string;
    journeyId: string;
    fullName: string;
    emailAddress: string;
    roleTitle?: string | null;
    department?: string | null;
    startDate: string;
    hireStatus: number;
    journeyStatus: number;
    currentStageTitle: string;
    completionRate: number;
    compositeScore: number;
    classification: EngagementClassification;
    hasActiveAtRiskFlag: boolean;
    activeAtRiskFlagId?: string | null;
    snapshotComputedAt: string;
}

export interface IPipelineColumnDto {
    columnKey: string;
    columnTitle: string;
    orderIndex: number;
    hires: IPipelineHireCardDto[];
}

export interface IPipelineBoardDto {
    generatedAt: string;
    keyword?: string | null;
    classificationFilter?: EngagementClassification | null;
    columns: IPipelineColumnDto[];
}

export interface IPipelineBoardQueryState {
    keyword: string;
    classification?: EngagementClassification;
}
