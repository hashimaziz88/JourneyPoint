"use client";

import { useAuthActions, useAuthState } from "@/providers/authProvider";
import { readTenantFromCookies } from "@/utils/auth/auth";
import { getDefaultAuthorizedRoute, hasPermission } from "@/utils/auth/permissions";

export const useAppSession = () => {
    const authState = useAuthState();
    const authActions = useAuthActions();
    const tenant = authState.tenant ?? readTenantFromCookies();
    const grantedPermissions = authState.grantedPermissions;
    const roleNames = authState.user?.roleNames ?? [];
    const primaryRoleName = authState.user?.primaryRoleName ?? null;
    const isHostScope = !tenant?.tenancyName;
    const defaultRoute = getDefaultAuthorizedRoute(
        grantedPermissions,
        roleNames,
        primaryRoleName,
        isHostScope,
    );

    return {
        isReady: authState.isReady,
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        tenant,
        roleNames,
        primaryRoleName,
        isHostScope,
        grantedPermissions,
        isMultiTenancyEnabled: authState.isMultiTenancyEnabled,
        configurationError: authState.configurationError,
        defaultRoute,
        hasPermission: (permission?: string) => hasPermission(grantedPermissions, permission),
        refreshSession: authActions.refreshSession,
    };
};
