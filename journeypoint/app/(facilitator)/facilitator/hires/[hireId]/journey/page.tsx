"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
    APP_PERMISSIONS,
    APP_ROLE_NAMES,
} from "@/constants/auth/permissions";
import JourneyReviewView from "@/components/journey/JourneyReviewView";
import withAuth from "@/hoc/withAuth";
import { HireProvider } from "@/providers/hireProvider";
import { JourneyProvider } from "@/providers/journeyProvider";

const FacilitatorJourneyReviewContent: React.FC = () => {
    const params = useParams<{ hireId: string }>();
    const hireId = Array.isArray(params.hireId) ? params.hireId[0] : params.hireId;

    return <JourneyReviewView hireId={hireId ?? ""} />;
};

const FacilitatorJourneyReviewPage: React.FC = () => (
    <HireProvider>
        <JourneyProvider>
            <FacilitatorJourneyReviewContent />
        </JourneyProvider>
    </HireProvider>
);

export default withAuth(FacilitatorJourneyReviewPage, {
    requiredPermission: APP_PERMISSIONS.facilitator,
    allowedRoles: [APP_ROLE_NAMES.facilitator],
});
