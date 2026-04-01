"use client";

import React, { startTransition, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/routes/auth.routes";
import { APP_ROLE_NAMES } from "@/constants/auth/permissions";
import { ADMIN_NAVIGATION_ITEMS } from "@/constants/global/navigation";
import { useAppSession } from "@/hooks/useAppSession";
import Spinner from "@/components/spinner/Spinner";
import AppShell from "@/layouts/AppShell";

/**
 * Renders the admin workspace with the sidebar shell.
 * Handles its own access-control so RoleShell can be used exclusively
 * by role workspaces that use the top-navigation shell.
 */
const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const canAccess =
    isHostScope || primaryRoleName === APP_ROLE_NAMES.tenantAdmin;

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      startTransition(() => {
        router.replace(APP_ROUTES.login);
      });
      return;
    }

    if (!canAccess) {
      startTransition(() => {
        router.replace(defaultRoute);
      });
    }
  }, [canAccess, defaultRoute, isAuthenticated, isReady, router]);

  const visibleNavigationItems = useMemo(
    () => ADMIN_NAVIGATION_ITEMS.filter((item) => hasPermission(item.permission)),
    [hasPermission],
  );

  if (!isReady) return <Spinner />;
  if (!isAuthenticated || !canAccess) return null;

  return (
    <AppShell
      navigationItems={visibleNavigationItems}
      scopeLabel={tenant?.tenantName ?? "Host"}
      title="Admin Workspace"
      subtitle="Host and tenant administration"
      userDisplayName={user?.fullName ?? user?.userName ?? null}
    >
      {children}
    </AppShell>
  );
};

export default AdminShell;
