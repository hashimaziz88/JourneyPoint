"use client";

import React, { startTransition, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/auth/routes";
import { useAppSession } from "@/helpers/useAppSession";
import Spinner from "@/components/spinner/Spinner";
import type { IRoleShellProps } from "@/types/layout/shell";
import AppShell from "./AppShell";

/**
 * Applies role-aware access control and shared shell rendering to a workspace.
 */
const RoleShell: React.FC<IRoleShellProps> = ({
  children,
  title,
  subtitle,
  navigationItems,
  allowedRoles = [],
  allowHost = false,
}) => {
  const router = useRouter();
  const {
    defaultRoute,
    hasPermission,
    isAuthenticated,
    isHostScope,
    isReady,
    primaryRoleName,
    tenant,
    user,
  } = useAppSession();
  const hasRoleRestriction = allowHost || allowedRoles.length > 0;
  const canAccessWorkspace =
    !hasRoleRestriction ||
    (allowHost && isHostScope) ||
    allowedRoles.includes(primaryRoleName ?? "");

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      startTransition(() => {
        router.replace(APP_ROUTES.login);
      });
      return;
    }

    if (!canAccessWorkspace) {
      startTransition(() => {
        router.replace(defaultRoute);
      });
    }
  }, [canAccessWorkspace, defaultRoute, isAuthenticated, isReady, router]);

  const visibleNavigationItems = useMemo(
    () => navigationItems.filter((item) => hasPermission(item.permission)),
    [hasPermission, navigationItems],
  );

  if (!isReady) {
    return <Spinner />;
  }

  if (!isAuthenticated || !canAccessWorkspace) {
    return null;
  }

  return (
    <AppShell
      navigationItems={visibleNavigationItems}
      scopeLabel={tenant?.tenantName ?? "Host"}
      title={title}
      subtitle={subtitle}
      userDisplayName={user?.fullName ?? user?.userName ?? null}
    >
      {children}
    </AppShell>
  );
};

export default RoleShell;
