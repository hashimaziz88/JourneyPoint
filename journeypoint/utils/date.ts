const DATE_FORMATTER = new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

export const formatDisplayDate = (value?: string | null): string =>
    value ? DATE_FORMATTER.format(new Date(value)) : "Not set";

export const formatDisplayDateTime = (value?: string | null): string =>
    value ? DATE_TIME_FORMATTER.format(new Date(value)) : "Not available";
