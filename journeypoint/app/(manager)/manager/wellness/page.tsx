"use client";

import React from "react";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";
import withAuth from "@/hoc/withAuth";
import { HireProvider } from "@/providers/hireProvider";
import { WellnessProvider } from "@/providers/wellnessProvider";
import WellnessHireListView from "@/components/wellness/WellnessHireListView";
import { buildManagerHireWellnessRoute } from "@/routes/auth.routes";

/**
 * Manager wellness overview — lists direct-report hires and links to their wellness trackers.
 */
const ManagerWellnessPage: React.FC = () => (
    <HireProvider>
        <WellnessProvider>
            <WellnessHireListView hireWellnessRoute={buildManagerHireWellnessRoute} />
        </WellnessProvider>
    </HireProvider>
);

export default withAuth(ManagerWellnessPage, {
    requiredPermission: APP_PERMISSIONS.manager,
    allowedRoles: [APP_ROLE_NAMES.manager],
});
