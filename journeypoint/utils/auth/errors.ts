import axios from "axios";

export const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
    if (axios.isAxiosError(error)) {
        const errorMessage =
            error.response?.data?.error?.message ??
            error.response?.data?.error?.details ??
            error.response?.data?.message ??
            error.message;

        if (errorMessage) {
            return errorMessage;
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallbackMessage;
};
