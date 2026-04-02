"use client";

import React from "react";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";
import withAuth from "@/hoc/withAuth";
import { HireProvider } from "@/providers/hireProvider";
import { WellnessProvider } from "@/providers/wellnessProvider";
import WellnessHireListView from "@/components/wellness/WellnessHireListView";
import { buildFacilitatorHireWellnessRoute } from "@/routes/auth.routes";

const FacilitatorWellnessPage: React.FC = () => (
    <HireProvider>
        <WellnessProvider>
            <WellnessHireListView hireWellnessRoute={buildFacilitatorHireWellnessRoute} />
        </WellnessProvider>
    </HireProvider>
);

export default withAuth(FacilitatorWellnessPage, {
    requiredPermission: APP_PERMISSIONS.facilitator,
    allowedRoles: [APP_ROLE_NAMES.facilitator],
});
