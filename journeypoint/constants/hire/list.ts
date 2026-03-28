import {
    HireLifecycleState,
    WelcomeNotificationStatus,
    type IHireListQueryState,
} from "@/types/hire";

export const DEFAULT_HIRE_LIST_QUERY_STATE: IHireListQueryState = {
    keyword: "",
    status: undefined,
    current: 1,
    pageSize: 12,
};

export const DEFAULT_HIRE_LIST_SORTING = "startDate DESC";

export const HIRE_STATUS_LABELS: Record<HireLifecycleState, string> = {
    [HireLifecycleState.PendingActivation]: "Pending activation",
    [HireLifecycleState.Active]: "Active",
    [HireLifecycleState.Completed]: "Completed",
    [HireLifecycleState.Exited]: "Exited",
};

export const HIRE_STATUS_TAG_COLORS: Record<HireLifecycleState, string> = {
    [HireLifecycleState.PendingActivation]: "gold",
    [HireLifecycleState.Active]: "green",
    [HireLifecycleState.Completed]: "blue",
    [HireLifecycleState.Exited]: "volcano",
};

export const HIRE_STATUS_OPTIONS = Object.values(HireLifecycleState)
    .filter((value): value is HireLifecycleState => typeof value === "number")
    .map((value) => ({
        label: HIRE_STATUS_LABELS[value],
        value,
    }));

export const WELCOME_STATUS_LABELS: Record<WelcomeNotificationStatus, string> = {
    [WelcomeNotificationStatus.Pending]: "Pending",
    [WelcomeNotificationStatus.Sent]: "Sent",
    [WelcomeNotificationStatus.FailedRecoverable]: "Needs resend",
};

export const WELCOME_STATUS_TAG_COLORS: Record<WelcomeNotificationStatus, string> = {
    [WelcomeNotificationStatus.Pending]: "default",
    [WelcomeNotificationStatus.Sent]: "success",
    [WelcomeNotificationStatus.FailedRecoverable]: "warning",
};
