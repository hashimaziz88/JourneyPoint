"use client";

import React from "react";
import {
    APP_PERMISSIONS,
    APP_ROLE_NAMES,
} from "@/constants/auth/permissions";
import PlanListView from "@/components/plans/PlanListView";
import withAuth from "@/hoc/withAuth";
import { OnboardingPlanProvider } from "@/providers/onboardingPlanProvider";

const FacilitatorPlansPage: React.FC = () => (
    <OnboardingPlanProvider>
        <PlanListView />
    </OnboardingPlanProvider>
);

export default withAuth(FacilitatorPlansPage, {
    requiredPermission: APP_PERMISSIONS.facilitator,
    allowedRoles: [APP_ROLE_NAMES.facilitator],
});
