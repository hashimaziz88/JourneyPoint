import type React from "react";
import type { IWorkspaceNavigationItem } from "@/constants/global/navigation";

/**
 * Defines the shared app-shell props used by role workspaces.
 */
export interface IAppShellProps {
    children: React.ReactNode;
    navigationItems: IWorkspaceNavigationItem[];
    scopeLabel: string;
    title: string;
    subtitle: string;
    userDisplayName?: string | null;
}

/**
 * Defines the role-shell access and presentation props.
 */
export interface IRoleShellProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    navigationItems: IWorkspaceNavigationItem[];
    allowedRoles?: string[];
    allowHost?: boolean;
}

/**
 * Defines the lightweight workspace-overview card content.
 */
export interface IWorkspaceOverviewProps {
    title: string;
    description: string;
    currentFocus: string;
    nextMilestoneHint: string;
}
