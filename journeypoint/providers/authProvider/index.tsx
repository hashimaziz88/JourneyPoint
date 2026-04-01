"use client";

import React, { useContext, useReducer } from "react";
import { AUTH_COOKIE_NAMES } from "@/constants/auth/cookies";
import {
  clearTenantCookies,
  normalizeTenancyName,
  persistTenantCookies,
  readTenantFromCookies,
} from "@/utils/auth/auth";
import {
  fetchCurrentLoginState,
  loadAuthConfiguration,
  resolveTenantAvailability,
} from "@/utils/auth/authApi";
import { resolveActiveTenancyName } from "@/utils/auth/tenancy";
import type {
  TenantInfo,
  UserLoginRequest,
  UserLoginResponse,
  UserRegisterRequest,
} from "@/types/auth/auth";
import { getCookie, removeCookie, setCookie } from "@/utils/cookies";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  clearTenant as clearTenantAction,
  getMeError,
  getMePending,
  getMeSuccess,
  loginError,
  loginPending,
  loginSuccess,
  logoutError,
  logoutPending,
  logoutSuccess,
  refreshSessionError,
  refreshSessionPending,
  refreshSessionSuccess,
  registerError,
  registerPending,
  registerSuccess,
  resolveTenantError,
  resolveTenantPending,
  resolveTenantSuccess,
} from "./actions";
import {
  AuthActionContext,
  AuthStateContext,
  INITIAL_STATE,
  type IAuthActionContext,
  type IAuthStateContext,
} from "./context";
import { AuthReducer } from "./reducer";

/**
 * Provides authentication, session restoration, and tenant-resolution actions.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  const resolveTenant = async (
    tenancyName: string,
  ): Promise<TenantInfo | null> => {
    const normalizedTenancyName = normalizeTenancyName(tenancyName);

    if (!normalizedTenancyName) {
      clearTenantCookies();
      dispatch(clearTenantAction());
      return null;
    }

    dispatch(resolveTenantPending());

    try {
      const tenant = await resolveTenantAvailability(
        normalizedTenancyName,
      );

      if (!tenant) {
        clearTenantCookies();
        dispatch(resolveTenantError());
        return null;
      }

      persistTenantCookies(tenant);
      dispatch(resolveTenantSuccess(tenant));
      return tenant;
    } catch (error) {
      console.error(error);
      clearTenantCookies();
      dispatch(resolveTenantError());
      return null;
    }
  };

  const getMe = async (): Promise<UserLoginResponse | null> => {
    const token = getCookie(AUTH_COOKIE_NAMES.token);

    if (!token) {
      return null;
    }

    dispatch(getMePending());

    try {
      const { user, tenant } = await fetchCurrentLoginState(token);

      if (tenant) {
        persistTenantCookies(tenant);
      }

      dispatch(
        getMeSuccess({
          isReady: true,
          isSessionPending: false,
          isAuthenticated: true,
          user,
          tenant,
        }),
      );

      return user;
    } catch (error) {
      console.error(error);
      removeCookie(AUTH_COOKIE_NAMES.token);
      dispatch(getMeError());
      return null;
    }
  };

  const refreshSession = async (): Promise<void> => {
    dispatch(refreshSessionPending());

    const token = getCookie(AUTH_COOKIE_NAMES.token);
    const persistedTenant = readTenantFromCookies();
    const activeTenancyName = resolveActiveTenancyName(
      persistedTenant?.tenancyName,
    );
    let tenant = persistedTenant;

    if (activeTenancyName && activeTenancyName !== persistedTenant?.tenancyName) {
      tenant = await resolveTenant(activeTenancyName);
    }

    const configuration = await loadAuthConfiguration();

    if (!token) {
      dispatch(
        refreshSessionSuccess({
          isReady: true,
          isSessionPending: false,
          isAuthenticated: false,
          user: null,
          tenant,
          ...configuration,
        }),
      );
      return;
    }

    try {
      const { user, tenant: sessionTenant } = await fetchCurrentLoginState(
        token,
      );
      const resolvedTenant = sessionTenant ?? tenant;

      if (resolvedTenant) {
        persistTenantCookies(resolvedTenant);
      }

      dispatch(
        refreshSessionSuccess({
          isReady: true,
          isSessionPending: false,
          isAuthenticated: true,
          user,
          tenant: resolvedTenant,
          ...configuration,
        }),
      );
    } catch (error) {
      console.error(error);
      removeCookie(AUTH_COOKIE_NAMES.token);
      dispatch(
        refreshSessionError({
          isReady: true,
          isSessionPending: false,
          isAuthenticated: false,
          user: null,
          tenant,
          ...configuration,
        }),
      );
    }
  };

  const login = async (payload: UserLoginRequest): Promise<void> => {
    dispatch(loginPending());

    try {
      const response = await getAxiosInstance().post(
        "/api/TokenAuth/Authenticate",
        payload,
      );
      const data = response.data?.result ?? response.data;
      const token: string = data.accessToken;

      setCookie(AUTH_COOKIE_NAMES.token, token, data.expireInSeconds);

      const [{ user, tenant }, configuration] = await Promise.all([
        fetchCurrentLoginState(token, data.userId, data.expireInSeconds),
        loadAuthConfiguration(),
      ]);

      if (tenant) {
        persistTenantCookies(tenant);
      }

      dispatch(
        loginSuccess({
          isPending: false,
          isError: false,
          isSuccess: true,
          isReady: true,
          isSessionPending: false,
          isAuthenticated: true,
          user,
          tenant,
          ...configuration,
        }),
      );
    } catch (error) {
      removeCookie(AUTH_COOKIE_NAMES.token);
      dispatch(loginError());
      console.error(error);
    }
  };

  const register = async (
    payload: UserRegisterRequest,
  ): Promise<"logged-in" | "registered" | "failed"> => {
    dispatch(registerPending());

    try {
      const response = await getAxiosInstance().post(
        "/api/services/app/Account/Register",
        payload,
      );
      const data = response.data?.result ?? response.data;

      if (!data?.canLogin) {
        dispatch(
          registerSuccess({
            isPending: false,
            isError: false,
            isSuccess: true,
          }),
        );

        return "registered";
      }

      await login({
        userNameOrEmailAddress: payload.userName,
        password: payload.password,
        rememberClient: true,
        tenancyName: payload.tenancyName,
      });

      return "logged-in";
    } catch (error) {
      console.error(error);
      dispatch(registerError());
      return "failed";
    }
  };

  const clearTenant = (): void => {
    clearTenantCookies();
    dispatch(clearTenantAction());
  };

  const logout = async (): Promise<void> => {
    dispatch(logoutPending());

    try {
      removeCookie(AUTH_COOKIE_NAMES.token);
      clearTenantCookies();
      dispatch(logoutSuccess());
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logoutError());
    }
  };

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionContext.Provider
        value={{
          login,
          register,
          logout,
          getMe,
          refreshSession,
          resolveTenant,
          clearTenant,
        }}
      >
        {children}
      </AuthActionContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = (): IAuthStateContext => {
  const context = useContext(AuthStateContext);

  if (context === undefined) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }

  return context;
};

export const useAuthActions = (): IAuthActionContext => {
  const context = useContext(AuthActionContext);

  if (context === undefined) {
    throw new Error("useAuthActions must be used within an AuthProvider");
  }

  return context;
};
