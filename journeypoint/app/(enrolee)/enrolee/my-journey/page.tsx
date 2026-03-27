"use client";

import React from "react";
import WorkspaceOverview from "@/layout/WorkspaceOverview";
import withAuth from "@/hoc/withAuth";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";

const EnroleeMyJourneyPage: React.FC = () => (
  <WorkspaceOverview
    title="My Journey"
    description="Enrolees are now routed into a dedicated onboarding workspace so future journey content can be delivered without exposing admin or facilitator surfaces."
    currentFocus="Role-safe access and landing behavior are active for enrolee accounts."
    nextMilestoneHint="Upcoming work will attach real journey modules, task detail views, and acknowledgements to this route."
  />
);

export default withAuth(EnroleeMyJourneyPage, {
  requiredPermission: APP_PERMISSIONS.enrolee,
  allowedRoles: [APP_ROLE_NAMES.enrolee],
});
