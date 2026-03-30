import type { EngagementClassification } from "@/types/engagement";
import type { IPipelineBoardDto, IPipelineColumnDto, IPipelineHireCardDto } from "@/types/pipeline";
export type IPipelineBoardViewProps = Record<string, never>;
export interface IPipelineKanbanProps {
    columns: IPipelineColumnDto[];
    onOpenHire: (hireId: string) => void;
    onOpenJourney: (hireId: string) => void;
}

export interface IPipelineColumnProps {
    column: IPipelineColumnDto;
    onOpenHire: (hireId: string) => void;
    onOpenJourney: (hireId: string) => void;
}

export interface IHirePipelineCardProps {
    hire: IPipelineHireCardDto;
    onOpenHire: (hireId: string) => void;
    onOpenJourney: (hireId: string) => void;
}

export interface IEngagementBadgeProps {
    classification: EngagementClassification;
    compositeScore: number;
    hasActiveAtRiskFlag: boolean;
}

export interface IPipelineSummaryMetrics {
    totalHires: number;
    activeAtRiskCount: number;
    averageCompletionRate: number;
    averageCompositeScore: number;
}

export interface IPipelineColumnSummary {
    totalHires: number;
    atRiskHireCount: number;
}

export interface IPipelineProviderStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    board?: IPipelineBoardDto | null;
    filters: {
        keyword: string;
        classification?: EngagementClassification;
    };
}
