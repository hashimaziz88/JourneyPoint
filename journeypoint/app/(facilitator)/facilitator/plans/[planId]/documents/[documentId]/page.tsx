"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
    APP_PERMISSIONS,
    APP_ROLE_NAMES,
} from "@/constants/auth/permissions";
import DocumentReviewWorkspace from "@/components/plans/DocumentReviewWorkspace";
import withAuth from "@/hoc/withAuth";
import { OnboardingDocumentProvider } from "@/providers/onboardingDocumentProvider";

const FacilitatorPlanDocumentReviewContent: React.FC = () => {
    const params = useParams<{ planId: string; documentId: string }>();
    const planId = Array.isArray(params.planId) ? params.planId[0] : params.planId;
    const documentId = Array.isArray(params.documentId)
        ? params.documentId[0]
        : params.documentId;

    return (
        <DocumentReviewWorkspace
            documentId={documentId ?? ""}
            planId={planId ?? ""}
        />
    );
};

const FacilitatorPlanDocumentReviewPage: React.FC = () => (
    <OnboardingDocumentProvider>
        <FacilitatorPlanDocumentReviewContent />
    </OnboardingDocumentProvider>
);

export default withAuth(FacilitatorPlanDocumentReviewPage, {
    requiredPermission: APP_PERMISSIONS.facilitator,
    allowedRoles: [APP_ROLE_NAMES.facilitator],
});
