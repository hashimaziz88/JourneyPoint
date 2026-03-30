import { JOURNEY_API_BASE } from "@/constants/journey/api";
import type {
    IAcknowledgeJourneyTaskRequest,
    IAddJourneyTaskRequest,
    IApplyJourneyPersonalisationRequest,
    ICompleteJourneyTaskRequest,
    IEnroleeJourneyDashboardDto,
    IEnroleeJourneyTaskDetailDto,
    IGenerateDraftJourneyRequest,
    IJourneyDraftDto,
    IJourneyPersonalisationProposalDto,
    IManagerTaskWorkspaceDto,
    IRequestJourneyPersonalisationRequest,
    IUpdateJourneyTaskRequest,
} from "@/types/journey";
import { getAxiosInstance } from "@/utils/axiosInstance";

export const getJourneyApiResult = <T,>(response: { data?: { result?: T } | T }): T => {
    const { data } = response;

    if (
        data &&
        typeof data === "object" &&
        "result" in (data as Record<string, unknown>)
    ) {
        return (data as { result?: T }).result as T;
    }

    return data as T;
};

export const fetchJourneyDraft = async (hireId: string): Promise<IJourneyDraftDto> => {
    const response = await getAxiosInstance().get(`${JOURNEY_API_BASE}/GetDraft`, {
        params: { hireId },
    });

    return getJourneyApiResult<IJourneyDraftDto>(response);
};

export const fetchMyJourney = async (): Promise<IEnroleeJourneyDashboardDto | null> => {
    const response = await getAxiosInstance().get(`${JOURNEY_API_BASE}/GetMyJourney`);
    return getJourneyApiResult<IEnroleeJourneyDashboardDto | null>(response);
};

export const fetchManagerTasks = async (): Promise<IManagerTaskWorkspaceDto | null> => {
    const response = await getAxiosInstance().get(`${JOURNEY_API_BASE}/GetManagerTasks`);
    return getJourneyApiResult<IManagerTaskWorkspaceDto | null>(response);
};

export const fetchMyTask = async (
    journeyTaskId: string,
): Promise<IEnroleeJourneyTaskDetailDto> => {
    const response = await getAxiosInstance().get(`${JOURNEY_API_BASE}/GetMyTask`, {
        params: { journeyTaskId },
    });

    return getJourneyApiResult<IEnroleeJourneyTaskDetailDto>(response);
};

export const generateJourneyDraft = async (
    payload: IGenerateDraftJourneyRequest,
): Promise<IJourneyDraftDto> => {
    const response = await getAxiosInstance().post(
        `${JOURNEY_API_BASE}/GenerateDraft`,
        payload,
    );

    return getJourneyApiResult<IJourneyDraftDto>(response);
};

export const updateJourneyTask = async (
    journeyTaskId: string,
    payload: IUpdateJourneyTaskRequest,
): Promise<void> => {
    await getAxiosInstance().put(`${JOURNEY_API_BASE}/UpdateTask`, payload, {
        params: { journeyTaskId },
    });
};

export const addJourneyTask = async (
    journeyId: string,
    payload: IAddJourneyTaskRequest,
): Promise<void> => {
    await getAxiosInstance().post(`${JOURNEY_API_BASE}/AddTask`, payload, {
        params: { journeyId },
    });
};

export const removePendingJourneyTask = async (journeyTaskId: string): Promise<void> => {
    await getAxiosInstance().delete(`${JOURNEY_API_BASE}/RemovePendingTask`, {
        params: { journeyTaskId },
    });
};

export const activateJourney = async (hireId: string): Promise<IJourneyDraftDto> => {
    const response = await getAxiosInstance().post(`${JOURNEY_API_BASE}/Activate`, null, {
        params: { hireId },
    });

    return getJourneyApiResult<IJourneyDraftDto>(response);
};

export const acknowledgeMyJourneyTask = async (
    payload: IAcknowledgeJourneyTaskRequest,
): Promise<void> => {
    await getAxiosInstance().post(`${JOURNEY_API_BASE}/AcknowledgeMyTask`, payload);
};

export const completeMyJourneyTask = async (
    payload: ICompleteJourneyTaskRequest,
): Promise<void> => {
    await getAxiosInstance().post(`${JOURNEY_API_BASE}/CompleteMyTask`, payload);
};

export const completeManagerJourneyTask = async (
    payload: ICompleteJourneyTaskRequest,
): Promise<IManagerTaskWorkspaceDto | null> => {
    const response = await getAxiosInstance().post(
        `${JOURNEY_API_BASE}/CompleteManagerTask`,
        payload,
    );

    return getJourneyApiResult<IManagerTaskWorkspaceDto | null>(response);
};

export const requestJourneyPersonalisation = async (
    payload: IRequestJourneyPersonalisationRequest,
): Promise<IJourneyPersonalisationProposalDto> => {
    const response = await getAxiosInstance().post(
        `${JOURNEY_API_BASE}/RequestPersonalisation`,
        payload,
    );

    return getJourneyApiResult<IJourneyPersonalisationProposalDto>(response);
};

export const applyJourneyPersonalisation = async (
    payload: IApplyJourneyPersonalisationRequest,
): Promise<IJourneyDraftDto> => {
    const response = await getAxiosInstance().post(
        `${JOURNEY_API_BASE}/ApplyPersonalisation`,
        payload,
    );

    return getJourneyApiResult<IJourneyDraftDto>(response);
};
