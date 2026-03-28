"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
    APP_PERMISSIONS,
    APP_ROLE_NAMES,
} from "@/constants/auth/permissions";
import HireDetailView from "@/components/hires/HireDetailView";
import withAuth from "@/hoc/withAuth";
import { HireProvider } from "@/providers/hireProvider";

const FacilitatorHireDetailContent: React.FC = () => {
    const params = useParams<{ hireId: string }>();
    const hireId = Array.isArray(params.hireId) ? params.hireId[0] : params.hireId;

    return <HireDetailView hireId={hireId ?? ""} />;
};

const FacilitatorHireDetailPage: React.FC = () => (
    <HireProvider>
        <FacilitatorHireDetailContent />
    </HireProvider>
);

export default withAuth(FacilitatorHireDetailPage, {
    requiredPermission: APP_PERMISSIONS.facilitator,
    allowedRoles: [APP_ROLE_NAMES.facilitator],
});
