"use client";

import React, { startTransition, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/routes/auth.routes";
import { useAppSession } from "@/hooks/useAppSession";
import Spinner from "@/components/spinner/Spinner";
import type { RoleShellProps } from "@/types/layout/shell";
import WorkspaceShell from "./WorkspaceShell";

/**
 * Applies role-aware access control and top-navigation shell rendering to a
 * workspace. Admin workspaces use AdminShell → AppShell (sidebar) instead.
 */
const RoleShell: React.FC<RoleShellProps> = ({
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
    <WorkspaceShell
      navigationItems={visibleNavigationItems}
      scopeLabel={tenant?.tenantName ?? "Host"}
      title={title}
      subtitle={subtitle}
      userDisplayName={user?.fullName ?? user?.userName ?? null}
    >
      {children}
    </WorkspaceShell>
  );
};

export default RoleShell;
