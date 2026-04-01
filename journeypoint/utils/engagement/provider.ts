import { getAxiosInstance } from "@/utils/axiosInstance";
import type {
    AcknowledgeAtRiskFlagRequest,
    AtRiskFlagDto,
    HireIntelligenceDetailDto,
    ResolveAtRiskFlagRequest,
} from "@/types/engagement/engagement";

const ENGAGEMENT_API_BASE = "/api/services/app/Engagement";

const getEngagementApiResult = <T,>(response: { data?: { result?: T } & T }): T =>
    response.data?.result ?? (response.data as T);

export const fetchHireIntelligence = async (
    hireId: string,
): Promise<HireIntelligenceDetailDto> => {
    const response = await getAxiosInstance().get(
        `${ENGAGEMENT_API_BASE}/GetHireIntelligence`,
        {
            params: { hireId },
        },
    );

    return getEngagementApiResult<HireIntelligenceDetailDto>(response);
};

export const acknowledgeAtRiskFlag = async (
    payload: AcknowledgeAtRiskFlagRequest,
): Promise<AtRiskFlagDto> => {
    const response = await getAxiosInstance().post(
        `${ENGAGEMENT_API_BASE}/AcknowledgeAtRiskFlag`,
        payload,
    );

    return getEngagementApiResult<AtRiskFlagDto>(response);
};

export const resolveAtRiskFlag = async (
    payload: ResolveAtRiskFlagRequest,
): Promise<AtRiskFlagDto> => {
    const response = await getAxiosInstance().post(
        `${ENGAGEMENT_API_BASE}/ResolveAtRiskFlag`,
        payload,
    );

    return getEngagementApiResult<AtRiskFlagDto>(response);
};
