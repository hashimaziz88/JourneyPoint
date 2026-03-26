import axios from "axios";
import { getCookie } from "@/utils/cookies";
import { AUTH_COOKIE_NAMES } from "@/constants/auth/cookies";

export const getAxiosInstace = () => {
    const token = getCookie(AUTH_COOKIE_NAMES.token);
    const tenantId = getCookie(AUTH_COOKIE_NAMES.tenantId);

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(tenantId ? { "Abp.TenantId": tenantId } : {}),
        },
    });
};
