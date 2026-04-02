"use client";

import React, { use } from "react";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";
import withAuth from "@/hoc/withAuth";
import { WellnessProvider } from "@/providers/wellnessProvider";
import WellnessOverviewView from "@/components/wellness/WellnessOverviewView";
import { buildManagerHireWellnessRoute } from "@/routes/auth.routes";

interface ManagerHireWellnessPageProps {
    params: Promise<{ hireId: string }>;
}

const ManagerHireWellnessContent: React.FC<{ hireId: string }> = ({ hireId }) => (
    <WellnessProvider>
        <WellnessOverviewView
            hireId={hireId}
            checkInRoute={(checkInId) => `${buildManagerHireWellnessRoute(hireId)}/${checkInId}`}
            readonly
        />
    </WellnessProvider>
);

const ManagerHireWellnessPage: React.FC<ManagerHireWellnessPageProps> = ({ params }) => {
    const { hireId } = use(params);
    return <ManagerHireWellnessContent hireId={hireId} />;
};

export default withAuth(ManagerHireWellnessPage, {
    requiredPermission: APP_PERMISSIONS.manager,
    allowedRoles: [APP_ROLE_NAMES.manager],
});
