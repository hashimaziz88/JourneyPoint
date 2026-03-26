"use client";

import { useAuthActions, useAuthState } from "@/providers/authProvider";
import { readTenantFromCookies } from "@/helpers/auth";
import { getDefaultAuthorizedRoute, hasPermission } from "@/helpers/permissions";

export const useAppSession = () => {
  const authState = useAuthState();
  const authActions = useAuthActions();
  const tenant = authState.tenant ?? readTenantFromCookies();
  const grantedPermissions = authState.grantedPermissions;
  const defaultRoute = getDefaultAuthorizedRoute(grantedPermissions);

  return {
    isReady: authState.isReady,
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    tenant,
    grantedPermissions,
    isMultiTenancyEnabled: authState.isMultiTenancyEnabled,
    configurationError: authState.configurationError,
    defaultRoute,
    hasPermission: (permission?: string) => hasPermission(grantedPermissions, permission),
    refreshSession: authActions.refreshSession,
  };
};
