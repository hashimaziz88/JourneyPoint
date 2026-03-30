"use client";

import React from "react";
import {
    APP_PERMISSIONS,
    APP_ROLE_NAMES,
} from "@/constants/auth/permissions";
import PipelineBoardView from "@/components/pipeline/PipelineBoardView";
import withAuth from "@/hoc/withAuth";
import { PipelineProvider } from "@/providers/pipelineProvider";

const FacilitatorPipelinePage: React.FC = () => (
    <PipelineProvider>
        <PipelineBoardView />
    </PipelineProvider>
);

export default withAuth(FacilitatorPipelinePage, {
    requiredPermission: APP_PERMISSIONS.facilitator,
    allowedRoles: [APP_ROLE_NAMES.facilitator],
});
