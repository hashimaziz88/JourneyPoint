import type { EngagementClassification } from "@/types/engagement/engagement";
import type {
    PipelineBoardDto,
    PipelineColumnDto,
    PipelineHireCardDto,
    PipelineJourneyGroup,
} from "@/types/pipeline/pipeline";

export type PipelineBoardViewProps = Record<string, never>;

export type PipelineJourneyGroupProps = {
    group: PipelineJourneyGroup;
    onOpenHire: (hireId: string) => void;
    onOpenJourney: (hireId: string) => void;
};

export type PipelineKanbanProps = {
    columns: PipelineColumnDto[];
    onOpenHire: (hireId: string) => void;
    onOpenJourney: (hireId: string) => void;
};

export type PipelineColumnProps = {
    column: PipelineColumnDto;
    onOpenHire: (hireId: string) => void;
    onOpenJourney: (hireId: string) => void;
};

export type HirePipelineCardProps = {
    hire: PipelineHireCardDto;
    onOpenHire: (hireId: string) => void;
    onOpenJourney: (hireId: string) => void;
};

export type PipelineSummaryMetrics = {
    totalHires: number;
    activeAtRiskCount: number;
    averageCompletionRate: number;
    averageCompositeScore: number;
};

export type PipelineColumnSummary = {
    totalHires: number;
    atRiskHireCount: number;
};

export type PipelineProviderStateContext = {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    board?: PipelineBoardDto | null;
    filters: {
        keyword: string;
        classification?: EngagementClassification;
    };
};
