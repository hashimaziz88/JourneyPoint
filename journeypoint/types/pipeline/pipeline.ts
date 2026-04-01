import type { EngagementClassification } from "@/types/engagement/engagement";

export type GetPipelineBoardInput = {
    keyword?: string | null;
    classification?: EngagementClassification | null;
    skipCount: number;
    maxResultCount: number;
    sorting?: string | null;
};

export type PipelineHireCardDto = {
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
    onboardingPlanId: string;
    onboardingPlanName: string;
};

export type PipelineColumnDto = {
    columnKey: string;
    columnTitle: string;
    orderIndex: number;
    hires: PipelineHireCardDto[];
};

export type PipelineBoardDto = {
    generatedAt: string;
    keyword?: string | null;
    classificationFilter?: EngagementClassification | null;
    columns: PipelineColumnDto[];
};

export type PipelineBoardQueryState = {
    keyword: string;
    classification?: EngagementClassification;
};

/** One onboarding-plan group on the pipeline, containing plan-specific columns. */
export type PipelineJourneyGroup = {
    planId: string;
    planName: string;
    columns: PipelineColumnDto[];
    totalHires: number;
    atRiskCount: number;
};
