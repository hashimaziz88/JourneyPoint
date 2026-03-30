"use client";

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
import type { NavigationIconKey } from "@/constants/global/navigation";

/**
 * Maps workspace navigation icon keys to rendered icon nodes.
 */
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
