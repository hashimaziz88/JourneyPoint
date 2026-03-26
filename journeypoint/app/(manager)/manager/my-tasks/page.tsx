"use client";

import React from "react";
import WorkspaceOverview from "@/layout/WorkspaceOverview";
import withAuth from "@/hoc/withAuth";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";

const ManagerMyTasksPage: React.FC = () => (
  <WorkspaceOverview
    title="Manager Task Workspace"
    description="Managers are now routed into a dedicated workspace where their role-specific task surface will be added without exposing admin or facilitator views."
    currentFocus="Role-safe access and workspace routing are in place for manager accounts."
    nextMilestoneHint="Upcoming work will connect direct-report task lists and completion flows to this route."
  />
);

export default withAuth(ManagerMyTasksPage, {
  requiredPermission: APP_PERMISSIONS.manager,
  allowedRoles: [APP_ROLE_NAMES.manager],
});
