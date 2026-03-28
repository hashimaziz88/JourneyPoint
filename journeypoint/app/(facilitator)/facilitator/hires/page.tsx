"use client";

import React from "react";
import {
    APP_PERMISSIONS,
    APP_ROLE_NAMES,
} from "@/constants/auth/permissions";
import HireListView from "@/components/hires/HireListView";
import withAuth from "@/hoc/withAuth";
import { HireProvider } from "@/providers/hireProvider";

const FacilitatorHireListPage: React.FC = () => (
    <HireProvider>
        <HireListView />
    </HireProvider>
);

export default withAuth(FacilitatorHireListPage, {
    requiredPermission: APP_PERMISSIONS.facilitator,
    allowedRoles: [APP_ROLE_NAMES.facilitator],
});
