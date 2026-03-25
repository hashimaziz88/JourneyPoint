"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAxiosInstace } from "@/utils/axiosInstance";
import { getCookie, removeCookie } from "@/utils/cookies";
import { useAuthActions, useAuthState } from "@/providers/authProvider";
import { unwrapAbpResponse } from "@/helpers/abp";
import { getApiErrorMessage } from "@/helpers/errors";
import { readTenantFromCookies } from "@/helpers/auth";
import { extractGrantedPermissions, getDefaultAuthorizedRoute, hasPermission } from "@/helpers/permissions";
import { resolveTenancyNameFromLocation } from "@/helpers/tenancy";
import { AUTH_COOKIE_NAMES } from "@/constants/auth/cookies";
import type { IAbpUserConfigurationResponse } from "@/types/auth";

const ignoreAsyncError = () => undefined;

export const useAppSession = () => {
  const authState = useAuthState();
  const authActions = useAuthActions();
  const [isReady, setIsReady] = useState(false);
  const [grantedPermissions, setGrantedPermissions] = useState<string[]>([]);
  const [isMultiTenancyEnabled, setIsMultiTenancyEnabled] = useState(true);
  const [configurationError, setConfigurationError] = useState<string | null>(null);
  const getMeRef = useRef(authActions.getMe);
  const resolveTenantRef = useRef(authActions.resolveTenant);

  useEffect(() => {
    getMeRef.current = authActions.getMe;
    resolveTenantRef.current = authActions.resolveTenant;
  }, [authActions.getMe, authActions.resolveTenant]);

  const refreshSession = useCallback(async () => {
    const token = getCookie(AUTH_COOKIE_NAMES.token);
    const tenancyNameFromLocation = resolveTenancyNameFromLocation();
    const currentTenant = authState.tenant ?? readTenantFromCookies();

    if (tenancyNameFromLocation && tenancyNameFromLocation !== currentTenant?.tenancyName) {
      await resolveTenantRef.current(tenancyNameFromLocation);
    }

    try {
      const configurationResponse = await getAxiosInstace().get("/AbpUserConfiguration/GetAll");
      const configurationData = unwrapAbpResponse<IAbpUserConfigurationResponse>(configurationResponse);
      setGrantedPermissions(extractGrantedPermissions(configurationData?.auth?.grantedPermissions));
      setIsMultiTenancyEnabled(Boolean(configurationData?.multiTenancy?.isEnabled));
      setConfigurationError(null);
    } catch (error) {
      setConfigurationError(getApiErrorMessage(error, "We could not load the user configuration."));
    }

    if (token && !authState.isAuthenticated) {
      await getMeRef.current();
    }

    if (!token && authState.isAuthenticated) {
      removeCookie(AUTH_COOKIE_NAMES.token);
    }

    setIsReady(true);
  }, [authState.isAuthenticated, authState.tenant]);

  useEffect(() => {
    const bootstrapTimeout = globalThis.setTimeout(() => {
      refreshSession().catch(ignoreAsyncError);
    }, 0);

    return () => globalThis.clearTimeout(bootstrapTimeout);
  }, [refreshSession]);

  const tenant = authState.tenant ?? readTenantFromCookies();
  const isAuthenticated = authState.isAuthenticated || Boolean(getCookie(AUTH_COOKIE_NAMES.token));
  const defaultRoute = useMemo(() => getDefaultAuthorizedRoute(grantedPermissions), [grantedPermissions]);

  return {
    isReady,
    isAuthenticated,
    user: authState.user,
    tenant,
    grantedPermissions,
    isMultiTenancyEnabled,
    configurationError,
    defaultRoute,
    hasPermission: (permission?: string) => hasPermission(grantedPermissions, permission),
    refreshSession,
  };
};
