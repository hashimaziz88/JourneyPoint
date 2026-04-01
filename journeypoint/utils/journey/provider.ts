import { JOURNEY_API_BASE } from "@/constants/journey/api";
import type {
    AcknowledgeJourneyTaskRequest,
    AddJourneyTaskRequest,
    ApplyJourneyPersonalisationRequest,
    CompleteJourneyTaskRequest,
    EnroleeJourneyDashboardDto,
    EnroleeJourneyTaskDetailDto,
    GenerateDraftJourneyRequest,
    JourneyDraftDto,
    JourneyPersonalisationProposalDto,
    ManagerTaskWorkspaceDto,
    RequestJourneyPersonalisationRequest,
    UpdateJourneyTaskRequest,
} from "@/types/journey/journey";
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

export const fetchJourneyDraft = async (hireId: string): Promise<JourneyDraftDto> => {
    const response = await getAxiosInstance().get(`${JOURNEY_API_BASE}/GetDraft`, {
        params: { hireId },
    });

    return getJourneyApiResult<JourneyDraftDto>(response);
};

export const fetchMyJourney = async (): Promise<EnroleeJourneyDashboardDto | null> => {
    const response = await getAxiosInstance().get(`${JOURNEY_API_BASE}/GetMyJourney`);
    return getJourneyApiResult<EnroleeJourneyDashboardDto | null>(response);
};

export const fetchManagerTasks = async (): Promise<ManagerTaskWorkspaceDto | null> => {
    const response = await getAxiosInstance().get(`${JOURNEY_API_BASE}/GetManagerTasks`);
    return getJourneyApiResult<ManagerTaskWorkspaceDto | null>(response);
};

export const fetchMyTask = async (
    journeyTaskId: string,
): Promise<EnroleeJourneyTaskDetailDto> => {
    const response = await getAxiosInstance().get(`${JOURNEY_API_BASE}/GetMyTask`, {
        params: { journeyTaskId },
    });

    return getJourneyApiResult<EnroleeJourneyTaskDetailDto>(response);
};

export const generateJourneyDraft = async (
    payload: GenerateDraftJourneyRequest,
): Promise<JourneyDraftDto> => {
    const response = await getAxiosInstance().post(
        `${JOURNEY_API_BASE}/GenerateDraft`,
        payload,
    );

    return getJourneyApiResult<JourneyDraftDto>(response);
};

export const updateJourneyTask = async (
    journeyTaskId: string,
    payload: UpdateJourneyTaskRequest,
): Promise<void> => {
    await getAxiosInstance().put(`${JOURNEY_API_BASE}/UpdateTask`, payload, {
        params: { journeyTaskId },
    });
};

export const addJourneyTask = async (
    journeyId: string,
    payload: AddJourneyTaskRequest,
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

export const activateJourney = async (hireId: string): Promise<JourneyDraftDto> => {
    const response = await getAxiosInstance().post(`${JOURNEY_API_BASE}/Activate`, null, {
        params: { hireId },
    });

    return getJourneyApiResult<JourneyDraftDto>(response);
};

export const acknowledgeMyJourneyTask = async (
    payload: AcknowledgeJourneyTaskRequest,
): Promise<void> => {
    await getAxiosInstance().post(`${JOURNEY_API_BASE}/AcknowledgeMyTask`, payload);
};

export const completeMyJourneyTask = async (
    payload: CompleteJourneyTaskRequest,
): Promise<void> => {
    await getAxiosInstance().post(`${JOURNEY_API_BASE}/CompleteMyTask`, payload);
};

export const completeManagerJourneyTask = async (
    payload: CompleteJourneyTaskRequest,
): Promise<ManagerTaskWorkspaceDto | null> => {
    const response = await getAxiosInstance().post(
        `${JOURNEY_API_BASE}/CompleteManagerTask`,
        payload,
    );

    return getJourneyApiResult<ManagerTaskWorkspaceDto | null>(response);
};

export const requestJourneyPersonalisation = async (
    payload: RequestJourneyPersonalisationRequest,
): Promise<JourneyPersonalisationProposalDto> => {
    const response = await getAxiosInstance().post(
        `${JOURNEY_API_BASE}/RequestPersonalisation`,
        payload,
    );

    return getJourneyApiResult<JourneyPersonalisationProposalDto>(response);
};

export const applyJourneyPersonalisation = async (
    payload: ApplyJourneyPersonalisationRequest,
): Promise<JourneyDraftDto> => {
    const response = await getAxiosInstance().post(
        `${JOURNEY_API_BASE}/ApplyPersonalisation`,
        payload,
    );

    return getJourneyApiResult<JourneyDraftDto>(response);
};
