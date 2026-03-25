import axios from "axios";
import { getCookie } from "@/utils/cookies";

export const getAxiosInstace = () => {
    const token = getCookie("token");
    const tenantId = getCookie("tenantId");

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(tenantId ? { "Abp.TenantId": tenantId } : {}),
        },
    });
};