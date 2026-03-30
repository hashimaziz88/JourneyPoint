import { getAxiosInstance } from "@/utils/axiosInstance";
import type {
    IAcknowledgeAtRiskFlagRequest,
    IAtRiskFlagDto,
    IHireIntelligenceDetailDto,
    IResolveAtRiskFlagRequest,
} from "@/types/engagement";

const ENGAGEMENT_API_BASE = "/api/services/app/Engagement";

const getEngagementApiResult = <T,>(response: { data?: { result?: T } & T }): T =>
    response.data?.result ?? (response.data as T);

export const fetchHireIntelligence = async (
    hireId: string,
): Promise<IHireIntelligenceDetailDto> => {
    const response = await getAxiosInstance().get(
        `${ENGAGEMENT_API_BASE}/GetHireIntelligence`,
        {
            params: { hireId },
        },
    );

    return getEngagementApiResult<IHireIntelligenceDetailDto>(response);
};

export const acknowledgeAtRiskFlag = async (
    payload: IAcknowledgeAtRiskFlagRequest,
): Promise<IAtRiskFlagDto> => {
    const response = await getAxiosInstance().post(
        `${ENGAGEMENT_API_BASE}/AcknowledgeAtRiskFlag`,
        payload,
    );

    return getEngagementApiResult<IAtRiskFlagDto>(response);
};

export const resolveAtRiskFlag = async (
    payload: IResolveAtRiskFlagRequest,
): Promise<IAtRiskFlagDto> => {
    const response = await getAxiosInstance().post(
        `${ENGAGEMENT_API_BASE}/ResolveAtRiskFlag`,
        payload,
    );

    return getEngagementApiResult<IAtRiskFlagDto>(response);
};
