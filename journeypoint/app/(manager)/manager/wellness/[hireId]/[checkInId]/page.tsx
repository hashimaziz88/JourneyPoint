"use client";

import React, { use } from "react";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";
import withAuth from "@/hoc/withAuth";
import { WellnessProvider } from "@/providers/wellnessProvider";
import WellnessCheckInDetailView from "@/components/wellness/WellnessCheckInDetailView";
import { buildManagerHireWellnessRoute } from "@/routes/auth.routes";

interface ManagerCheckInDetailPageProps {
    params: Promise<{ hireId: string; checkInId: string }>;
}

const ManagerCheckInContent: React.FC<{ hireId: string; checkInId: string }> = ({
    hireId,
    checkInId,
}) => (
    <WellnessProvider>
        <WellnessCheckInDetailView
            checkInId={checkInId}
            backRoute={buildManagerHireWellnessRoute(hireId)}
            readonly
        />
    </WellnessProvider>
);

const ManagerCheckInDetailPage: React.FC<ManagerCheckInDetailPageProps> = ({ params }) => {
    const { hireId, checkInId } = use(params);
    return <ManagerCheckInContent hireId={hireId} checkInId={checkInId} />;
};

export default withAuth(ManagerCheckInDetailPage, {
    requiredPermission: APP_PERMISSIONS.manager,
    allowedRoles: [APP_ROLE_NAMES.manager],
});
