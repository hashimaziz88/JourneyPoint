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
