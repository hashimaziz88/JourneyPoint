"use client"
import React, { useReducer, useContext } from "react";
import { INITIAL_STATE, AuthActionContext, AuthStateContext, IUserLoginRequest, IUserRegisterRequest, ITenantInfo } from "./context";
import { AuthReducer } from "./reducer";
import {
    loginPending, loginSuccess, loginError,
    registerPending, registerError,
    logoutPending, logoutSuccess, logoutError,
    getMePending, getMeSuccess, getMeError,
    resolveTenantPending, resolveTenantSuccess, resolveTenantError,
    clearTenant as clearTenantAction,
} from "./actions";
import { getAxiosInstace } from "@/utils/axiosInstance";
import { getCookie, setCookie, removeCookie } from "@/utils/cookies";
import { mapSessionUser, persistTenantCookies, clearTenantCookies } from "@/helpers/auth";
import { AUTH_COOKIE_NAMES } from "@/constants/auth/cookies";
import { useRouter } from "next/navigation";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const router = useRouter();

    const resolveTenant = async (tenancyName: string): Promise<ITenantInfo | null> => {
        dispatch(resolveTenantPending());
        return await getAxiosInstace().post("/api/services/app/Account/IsTenantAvailable", { tenancyName })
            .then((response) => {
                const data = response.data?.result ?? response.data;
                if (data?.state === 1) {
                    const tenant: ITenantInfo = {
                        tenantId: data.tenantId ?? null,
                        tenancyName,
                        tenantName: tenancyName,
                    };
                    persistTenantCookies(tenant);
                    dispatch(resolveTenantSuccess(tenant));
                    return tenant;
                }
                dispatch(resolveTenantError());
                return null;
            })
            .catch((error) => {
                console.error(error);
                dispatch(resolveTenantError());
                return null;
            });
    };

    const getMe = async () => {
        const token = getCookie(AUTH_COOKIE_NAMES.token);
        if (!token) return;

        dispatch(getMePending());
        await getAxiosInstace().get("/api/services/app/Session/GetCurrentLoginInformations")
            .then((response) => {
                const data = response.data?.result ?? response.data;
                const user = mapSessionUser(token, data?.user);
                dispatch(getMeSuccess(user));

                if (data?.tenant) {
                    dispatch(resolveTenantSuccess({
                        tenantId: data.tenant.id,
                        tenancyName: data.tenant.tenancyName,
                        tenantName: data.tenant.name,
                    }));
                }
            })
            .catch((error) => {
                console.error(error);
                removeCookie(AUTH_COOKIE_NAMES.token);
                dispatch(getMeError());
            });
    };

    const login = async (payload: IUserLoginRequest) => {
        dispatch(loginPending());
        await getAxiosInstace().post("/api/TokenAuth/Authenticate", payload)
            .then(async (response) => {
                const data = response.data?.result ?? response.data;
                const token: string = data.accessToken;
                setCookie(AUTH_COOKIE_NAMES.token, token);

                const sessionResponse = await getAxiosInstace().get("/api/services/app/Session/GetCurrentLoginInformations");
                const sessionData = sessionResponse.data?.result ?? sessionResponse.data;

                const user = mapSessionUser(token, sessionData?.user, data.userId, data.expireInSeconds);
                dispatch(loginSuccess(user));

                if (sessionData?.tenant) {
                    dispatch(resolveTenantSuccess({
                        tenantId: sessionData.tenant.id,
                        tenancyName: sessionData.tenant.tenancyName,
                        tenantName: sessionData.tenant.name,
                    }));
                }

                router.push("/dashboard");
            })
            .catch((error) => {
                removeCookie(AUTH_COOKIE_NAMES.token);
                dispatch(loginError());
                console.error(error.message);
            });
    };

    const register = async (payload: IUserRegisterRequest) => {
        dispatch(registerPending());
        await getAxiosInstace().post("/api/services/app/Account/Register", payload)
            .then(async (response) => {
                const data = response.data?.result ?? response.data;
                if (data?.canLogin) {
                    await login({
                        userNameOrEmailAddress: payload.userName,
                        password: payload.password,
                        rememberClient: true,
                    });
                    return;
                }
                router.push("/login");
            })
            .catch((error) => {
                console.error(error);
                dispatch(registerError());
            });
    };

    const clearTenant = () => {
        clearTenantCookies();
        dispatch(clearTenantAction());
    };

    const logout = async () => {
        dispatch(logoutPending());
        await Promise.resolve()
            .then(() => {
                removeCookie(AUTH_COOKIE_NAMES.token);
                clearTenantCookies();
                dispatch(logoutSuccess());
                router.push("/login");
            })
            .catch((error) => {
                console.error("Logout error:", error);
                dispatch(logoutError());
            });
    };

    return (
        <AuthStateContext.Provider value={state}>
            <AuthActionContext.Provider value={{ login, register, logout, getMe, resolveTenant, clearTenant }}>
                {children}
            </AuthActionContext.Provider>
        </AuthStateContext.Provider>
    );
};

export const useAuthState = () => {
    const context = useContext(AuthStateContext);
    if (context === undefined) {
        throw new Error("useAuthState must be used within an AuthProvider");
    }
    return context;
};

export const useAuthActions = () => {
    const context = useContext(AuthActionContext);
    if (context === undefined) {
        throw new Error("useAuthActions must be used within an AuthProvider");
    }
    return context;
};
