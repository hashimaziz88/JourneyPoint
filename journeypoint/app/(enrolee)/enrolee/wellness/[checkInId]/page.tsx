"use client";

import React from "react";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";
import withAuth from "@/hoc/withAuth";
import { WellnessProvider } from "@/providers/wellnessProvider";
import WellnessCheckInDetailView from "@/components/wellness/WellnessCheckInDetailView";
import { APP_ROUTES } from "@/routes/auth.routes";
import { use } from "react";

interface EnroleeCheckInPageProps {
    params: Promise<{ checkInId: string }>;
}

const EnroleeCheckInContent: React.FC<{ checkInId: string }> = ({ checkInId }) => (
    <WellnessProvider>
        <WellnessCheckInDetailView
            checkInId={checkInId}
            backRoute={APP_ROUTES.enroleeWellness}
            readonly={false}
        />
    </WellnessProvider>
);

const EnroleeCheckInPage: React.FC<EnroleeCheckInPageProps> = ({ params }) => {
    const { checkInId } = use(params);
    return <EnroleeCheckInContent checkInId={checkInId} />;
};

export default withAuth(EnroleeCheckInPage, {
    requiredPermission: APP_PERMISSIONS.enrolee,
    allowedRoles: [APP_ROLE_NAMES.enrolee],
});
