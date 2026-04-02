"use client";

import React from "react";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";
import withAuth from "@/hoc/withAuth";
import { JourneyProvider } from "@/providers/journeyProvider";
import { WellnessProvider } from "@/providers/wellnessProvider";
import EnroleeWellnessView from "@/components/wellness/EnroleeWellnessView";

const EnroleeWellnessPage: React.FC = () => (
    <JourneyProvider>
        <WellnessProvider>
            <EnroleeWellnessView />
        </WellnessProvider>
    </JourneyProvider>
);

export default withAuth(EnroleeWellnessPage, {
    requiredPermission: APP_PERMISSIONS.enrolee,
    allowedRoles: [APP_ROLE_NAMES.enrolee],
});
