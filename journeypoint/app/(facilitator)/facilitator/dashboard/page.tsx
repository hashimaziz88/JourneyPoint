"use client";

import React from "react";
import WorkspaceOverview from "@/layout/WorkspaceOverview";
import withAuth from "@/hoc/withAuth";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";

const FacilitatorDashboardPage: React.FC = () => (
  <WorkspaceOverview
    title="Facilitator Dashboard"
    description="Facilitators are routed into a tenant-safe workspace that will expand into plan authoring, hire onboarding, and intervention tools in later milestones."
    currentFocus="Role-safe access, landing behavior, and navigation are active for facilitator accounts."
    nextMilestoneHint="Next milestones will add plan authoring, markdown import, and hire enrolment workflows here."
  />
);

export default withAuth(FacilitatorDashboardPage, {
  requiredPermission: APP_PERMISSIONS.facilitator,
  allowedRoles: [APP_ROLE_NAMES.facilitator],
});
