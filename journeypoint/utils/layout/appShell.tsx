import React from "react";
import {
    ApartmentOutlined,
    DashboardOutlined,
    DeploymentUnitOutlined,
    ProfileOutlined,
    SafetyCertificateOutlined,
    SolutionOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import type { NavigationIconKey, WorkspaceNavigationItem } from "@/types/layout/navigation";

/** Maps workspace navigation icon keys to rendered icon nodes. */
export const NAVIGATION_ICONS: Record<NavigationIconKey, React.ReactNode> = {
    dashboard: <DashboardOutlined />,
    tenants: <ApartmentOutlined />,
    users: <TeamOutlined />,
    roles: <SafetyCertificateOutlined />,
    plans: <ProfileOutlined />,
    pipeline: <DeploymentUnitOutlined />,
    facilitator: <SolutionOutlined />,
    manager: <TeamOutlined />,
    enrolee: <UserOutlined />,
};

/** Resolves the active navigation key for the current route. */
export const getSelectedMenuKey = (
    pathname: string,
    navigationItems: WorkspaceNavigationItem[],
): string => {
    const sortedItems = [...navigationItems].sort(
        (left, right) => right.href.length - left.href.length,
    );
    const selectedItem = sortedItems.find(
        (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    );

    return selectedItem?.key ?? navigationItems[0]?.key ?? "workspace";
};
