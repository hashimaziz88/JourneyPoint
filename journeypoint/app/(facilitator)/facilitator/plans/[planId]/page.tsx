"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
    APP_PERMISSIONS,
    APP_ROLE_NAMES,
} from "@/constants/auth/permissions";
import PlanEditor from "@/components/plans/PlanEditor";
import withAuth from "@/hoc/withAuth";
import { OnboardingPlanProvider } from "@/providers/onboardingPlanProvider";

const FacilitatorPlanDetailContent: React.FC = () => {
    const params = useParams<{ planId: string }>();
    const planId = Array.isArray(params.planId) ? params.planId[0] : params.planId;

    return <PlanEditor planId={planId ?? "new"} />;
};

const FacilitatorPlanDetailPage: React.FC = () => (
    <OnboardingPlanProvider>
        <FacilitatorPlanDetailContent />
    </OnboardingPlanProvider>
);

export default withAuth(FacilitatorPlanDetailPage, {
    requiredPermission: APP_PERMISSIONS.facilitator,
    allowedRoles: [APP_ROLE_NAMES.facilitator],
});
