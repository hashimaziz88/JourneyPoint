import { DEFAULT_PIPELINE_MAX_RESULT_COUNT } from "@/constants/pipeline/filters";
import { getAxiosInstance } from "@/utils/axiosInstance";
import type {
    IGetPipelineBoardInput,
    IPipelineBoardDto,
    IPipelineBoardQueryState,
    IPipelineHireCardDto,
} from "@/types/pipeline";
import type {
    IPipelineColumnSummary,
    IPipelineSummaryMetrics,
} from "@/types/pipeline/components";

const ENGAGEMENT_API_BASE = "/api/services/app/Engagement";

const getPipelineApiResult = <T,>(response: { data?: { result?: T } & T }): T =>
    response.data?.result ?? (response.data as T);

export const buildPipelineBoardRequest = (
    query: IPipelineBoardQueryState,
): IGetPipelineBoardInput => ({
    keyword: query.keyword.trim() || null,
    classification: query.classification ?? null,
    skipCount: 0,
    maxResultCount: DEFAULT_PIPELINE_MAX_RESULT_COUNT,
    sorting: null,
});

export const fetchPipelineBoard = async (
    request: IGetPipelineBoardInput,
): Promise<IPipelineBoardDto> => {
    const response = await getAxiosInstance().get(`${ENGAGEMENT_API_BASE}/GetPipelineBoard`, {
        params: request,
    });

    return getPipelineApiResult<IPipelineBoardDto>(response);
};

export const getPipelineSummaryMetrics = (
    board: IPipelineBoardDto | null | undefined,
): IPipelineSummaryMetrics => {
    const hires = (board?.columns ?? []).flatMap((column) => column.hires);

    if (hires.length === 0) {
        return {
            totalHires: 0,
            activeAtRiskCount: 0,
            averageCompletionRate: 0,
            averageCompositeScore: 0,
        };
    }

    const totalCompletionRate = hires.reduce((total, hire) => total + hire.completionRate, 0);
    const totalCompositeScore = hires.reduce((total, hire) => total + hire.compositeScore, 0);

    return {
        totalHires: hires.length,
        activeAtRiskCount: hires.filter((hire) => hire.hasActiveAtRiskFlag).length,
        averageCompletionRate: totalCompletionRate / hires.length,
        averageCompositeScore: totalCompositeScore / hires.length,
    };
};

export const getPipelineColumnSummary = (
    hires: IPipelineHireCardDto[],
): IPipelineColumnSummary => ({
    totalHires: hires.length,
    atRiskHireCount: hires.filter((hire) => hire.hasActiveAtRiskFlag).length,
});

export const formatPercentage = (value: number): string => `${Math.round(value)}%`;

/**
 * Groups a flat board into per-plan journey sections, each with its own
 * ordered column set. Hires without a planName fall into an "Unknown Plan" bucket.
 */
export const getPipelineJourneyGroups = (
    board: IPipelineBoardDto | null | undefined,
): import("@/types/pipeline").IPipelineJourneyGroup[] => {
    if (!board?.columns?.length) return [];

    const groupMap = new Map<string, import("@/types/pipeline").IPipelineJourneyGroup>();

    for (const column of board.columns) {
        for (const hire of column.hires) {
            const planId = hire.onboardingPlanId ?? "unknown";
            const planName = hire.onboardingPlanName ?? "Unknown Plan";

            if (!groupMap.has(planId)) {
                groupMap.set(planId, { planId, planName, columns: [], totalHires: 0, atRiskCount: 0 });
            }

            const group = groupMap.get(planId)!;
            let targetColumn = group.columns.find((col) => col.columnKey === column.columnKey);

            if (!targetColumn) {
                targetColumn = {
                    columnKey: column.columnKey,
                    columnTitle: column.columnTitle,
                    orderIndex: column.orderIndex,
                    hires: [],
                };
                group.columns.push(targetColumn);
            }

            targetColumn.hires.push(hire);
            group.totalHires += 1;
            if (hire.hasActiveAtRiskFlag) group.atRiskCount += 1;
        }
    }

    // Sort columns within each group by orderIndex
    for (const group of groupMap.values()) {
        group.columns.sort((a, b) => a.orderIndex - b.orderIndex);
    }

    // Sort groups by planName for stable ordering
    return [...groupMap.values()].sort((a, b) => a.planName.localeCompare(b.planName));
};
