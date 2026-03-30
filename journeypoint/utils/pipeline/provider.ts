import { PIPELINE_API_BASE } from "@/constants/pipeline/api";
import type { IGetPipelineBoardInput, IPipelineBoardDto } from "@/types/pipeline";
import { getAxiosInstance } from "@/utils/axiosInstance";

const getApiResult = <T,>(response: { data?: { result?: T } | T }): T => {
    const { data } = response;

    if (data && typeof data === "object" && "result" in (data as Record<string, unknown>)) {
        return (data as { result?: T }).result as T;
    }

    return data as T;
};

export const fetchPipelineBoard = async (
    request: IGetPipelineBoardInput,
): Promise<IPipelineBoardDto> => {
    const response = await getAxiosInstance().get(`${PIPELINE_API_BASE}/GetPipelineBoard`, {
        params: request,
    });

    return getApiResult<IPipelineBoardDto>(response);
};
