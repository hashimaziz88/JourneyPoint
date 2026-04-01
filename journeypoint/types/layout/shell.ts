import type React from "react";
import type { WorkspaceNavigationItem } from "@/types/layout/navigation";

/** Defines the shared app-shell props used by role workspaces. */
export type AppShellProps = {
    children: React.ReactNode;
    navigationItems: WorkspaceNavigationItem[];
    scopeLabel: string;
    title: string;
    subtitle: string;
    userDisplayName?: string | null;
};

/** Defines the role-shell access and presentation props. */
export type RoleShellProps = {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    navigationItems: WorkspaceNavigationItem[];
    allowedRoles?: string[];
    allowHost?: boolean;
};

/** Defines the lightweight workspace-overview card content. */
export type WorkspaceOverviewProps = {
    title: string;
    description: string;
    currentFocus: string;
    nextMilestoneHint: string;
};
