import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { getCookie } from "@/utils/cookies";
import { AUTH_COOKIE_NAMES } from "@/constants/auth/cookies";

const axiosInstance = axios.create({
    baseURL: "/api/proxy",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const headers = AxiosHeaders.from(config.headers);
    const token = getCookie(AUTH_COOKIE_NAMES.token);
    const tenantId = getCookie(AUTH_COOKIE_NAMES.tenantId);

    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    } else {
        headers.delete("Authorization");
    }

    if (tenantId) {
        headers.set("Abp.TenantId", tenantId);
    } else {
        headers.delete("Abp.TenantId");
    }

    config.headers = headers;
    return config;
});

export const getAxiosInstace = () => axiosInstance;
