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
