"use client";

import React from "react";
import {
    APP_PERMISSIONS,
    APP_ROLE_NAMES,
} from "@/constants/auth/permissions";
import MarkdownImportWorkspace from "@/components/plans/MarkdownImportWorkspace";
import withAuth from "@/hoc/withAuth";
import { MarkdownImportProvider } from "@/providers/markdownImportProvider";

const FacilitatorPlanImportPage: React.FC = () => (
    <MarkdownImportProvider>
        <MarkdownImportWorkspace />
    </MarkdownImportProvider>
);

export default withAuth(FacilitatorPlanImportPage, {
    requiredPermission: APP_PERMISSIONS.facilitator,
    allowedRoles: [APP_ROLE_NAMES.facilitator],
});
