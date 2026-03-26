"use client"
import React, { useContext, useReducer } from "react";
import { INITIAL_STATE, AuthActionContext, AuthStateContext, IUserLoginRequest, IUserRegisterRequest, ITenantInfo } from "./context";
import { AuthReducer } from "./reducer";
import {
    loginPending, loginSuccess, loginError,
    registerPending, registerSuccess, registerError,
    logoutPending, logoutSuccess, logoutError,
    getMePending, getMeSuccess, getMeError,
    refreshSessionPending, refreshSessionSuccess, refreshSessionError,
    resolveTenantPending, resolveTenantSuccess, resolveTenantError,
    clearTenant as clearTenantAction,
} from "./actions";
import { getAxiosInstace } from "@/utils/axiosInstance";
import { getCookie, setCookie, removeCookie } from "@/utils/cookies";
import { clearTenantCookies, mapSessionUser, mapTenantInfo, normalizeTenancyName, persistTenantCookies, readTenantFromCookies } from "@/helpers/auth";
import { AUTH_COOKIE_NAMES } from "@/constants/auth/cookies";
import { unwrapAbpResponse } from "@/helpers/abp";
import { getApiErrorMessage } from "@/helpers/errors";
import { extractGrantedPermissions } from "@/helpers/permissions";
import { resolveActiveTenancyName } from "@/helpers/tenancy";
import type { IAbpUserConfigurationResponse, ICurrentLoginInformationsResponse, IUserLoginResponse } from "@/types/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    const loadConfiguration = async (): Promise<{
        grantedPermissions: string[];
        isMultiTenancyEnabled: boolean;
        configurationError: string | null;
    }> => {
        try {
            const response = await getAxiosInstace().get("/AbpUserConfiguration/GetAll");
            const configuration = unwrapAbpResponse<IAbpUserConfigurationResponse>(response);

            return {
                grantedPermissions: extractGrantedPermissions(configuration?.auth?.grantedPermissions),
                isMultiTenancyEnabled: Boolean(configuration?.multiTenancy?.isEnabled),
                configurationError: null,
            };
        } catch (error) {
            return {
                grantedPermissions: [],
                isMultiTenancyEnabled: true,
                configurationError: getApiErrorMessage(error, "We could not load the user configuration."),
            };
        }
    };

    const fetchCurrentUser = async (
        token: string,
        userId?: number,
        expireInSeconds?: number,
    ): Promise<{ user: IUserLoginResponse; tenant: ITenantInfo | null }> => {
        const response = await getAxiosInstace().get("/api/services/app/Session/GetCurrentLoginInformations");
        const session = unwrapAbpResponse<ICurrentLoginInformationsResponse>(response);

        return {
            user: mapSessionUser(token, session?.user, userId, expireInSeconds),
            tenant: mapTenantInfo(session?.tenant),
        };
    };

    const resolveTenant = async (tenancyName: string): Promise<ITenantInfo | null> => {
        const normalizedTenancyName = normalizeTenancyName(tenancyName);

        if (!normalizedTenancyName) {
            clearTenantCookies();
            dispatch(clearTenantAction());
            return null;
        }

        dispatch(resolveTenantPending());
        return await getAxiosInstace().post("/api/services/app/Account/IsTenantAvailable", { tenancyName: normalizedTenancyName })
            .then((response) => {
                const data = response.data?.result ?? response.data;
                if (data?.state === 1) {
                    const tenant: ITenantInfo = {
                        tenantId: data.tenantId ?? null,
                        tenancyName: normalizedTenancyName,
                        tenantName: normalizedTenancyName,
                    };
                    persistTenantCookies(tenant);
                    dispatch(resolveTenantSuccess(tenant));
                    return tenant;
                }
                clearTenantCookies();
                dispatch(resolveTenantError());
                return null;
            })
            .catch((error) => {
                console.error(error);
                clearTenantCookies();
                dispatch(resolveTenantError());
                return null;
            });
    };

    const getMe = async (): Promise<IUserLoginResponse | null> => {
        const token = getCookie(AUTH_COOKIE_NAMES.token);
        if (!token) {
            return null;
        }

        dispatch(getMePending());
        return await fetchCurrentUser(token)
            .then(({ user, tenant }) => {
                if (tenant) {
                    persistTenantCookies(tenant);
                }

                dispatch(getMeSuccess({
                    isReady: true,
                    isSessionPending: false,
                    isAuthenticated: true,
                    user,
                    tenant,
                }));

                return user;
            })
            .catch((error) => {
                console.error(error);
                removeCookie(AUTH_COOKIE_NAMES.token);
                dispatch(getMeError());
                return null;
            });
    };

    const refreshSession = async () => {
        dispatch(refreshSessionPending());

        const token = getCookie(AUTH_COOKIE_NAMES.token);
        const persistedTenant = readTenantFromCookies();
        const activeTenancyName = resolveActiveTenancyName(persistedTenant?.tenancyName);
        let tenant = persistedTenant;

        if (activeTenancyName && activeTenancyName !== persistedTenant?.tenancyName) {
            tenant = await resolveTenant(activeTenancyName);
        }

        const configuration = await loadConfiguration();

        if (!token) {
            dispatch(refreshSessionSuccess({
                isReady: true,
                isSessionPending: false,
                isAuthenticated: false,
                user: null,
                tenant,
                ...configuration,
            }));
            return;
        }

        try {
            const { user, tenant: sessionTenant } = await fetchCurrentUser(token);
            const resolvedTenant = sessionTenant ?? tenant;

            if (resolvedTenant) {
                persistTenantCookies(resolvedTenant);
            }

            dispatch(refreshSessionSuccess({
                isReady: true,
                isSessionPending: false,
                isAuthenticated: true,
                user,
                tenant: resolvedTenant,
                ...configuration,
            }));
        } catch (error) {
            console.error(error);
            removeCookie(AUTH_COOKIE_NAMES.token);
            dispatch(refreshSessionError({
                isReady: true,
                isSessionPending: false,
                isAuthenticated: false,
                user: null,
                tenant,
                ...configuration,
            }));
        }
    };

    const login = async (payload: IUserLoginRequest) => {
        dispatch(loginPending());
        await getAxiosInstace().post("/api/TokenAuth/Authenticate", payload)
            .then(async (response) => {
                const data = response.data?.result ?? response.data;
                const token: string = data.accessToken;
                setCookie(AUTH_COOKIE_NAMES.token, token, data.expireInSeconds);

                const [{ user, tenant }, configuration] = await Promise.all([
                    fetchCurrentUser(token, data.userId, data.expireInSeconds),
                    loadConfiguration(),
                ]);

                if (tenant) {
                    persistTenantCookies(tenant);
                }

                dispatch(loginSuccess({
                    isPending: false,
                    isError: false,
                    isSuccess: true,
                    isReady: true,
                    isSessionPending: false,
                    isAuthenticated: true,
                    user,
                    tenant,
                    ...configuration,
                }));
            })
            .catch((error) => {
                removeCookie(AUTH_COOKIE_NAMES.token);
                dispatch(loginError());
                console.error(error.message);
            });
    };

    const register = async (payload: IUserRegisterRequest): Promise<"logged-in" | "registered" | "failed"> => {
        dispatch(registerPending());
        return await getAxiosInstace().post("/api/services/app/Account/Register", payload)
            .then(async (response) => {
                const data = response.data?.result ?? response.data;
                if (data?.canLogin) {
                    await login({
                        userNameOrEmailAddress: payload.userName,
                        password: payload.password,
                        rememberClient: true,
                        tenancyName: payload.tenancyName,
                    });
                    return "logged-in";
                }
                dispatch(registerSuccess({
                    isPending: false,
                    isError: false,
                    isSuccess: true,
                }));

                return "registered";
            })
            .catch((error) => {
                console.error(error);
                dispatch(registerError());
                return "failed";
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
            })
            .catch((error) => {
                console.error("Logout error:", error);
                dispatch(logoutError());
            });
    };

    return (
        <AuthStateContext.Provider value={state}>
            <AuthActionContext.Provider value={{ login, register, logout, getMe, refreshSession, resolveTenant, clearTenant }}>
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
