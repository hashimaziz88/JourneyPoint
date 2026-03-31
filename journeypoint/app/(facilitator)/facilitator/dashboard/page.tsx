"use client";

import React from "react";
import FacilitatorDashboard from "@/components/facilitator/FacilitatorDashboard";
import withAuth from "@/hoc/withAuth";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";

const FacilitatorDashboardPage: React.FC = () => <FacilitatorDashboard />;

export default withAuth(FacilitatorDashboardPage, {
  requiredPermission: APP_PERMISSIONS.facilitator,
  allowedRoles: [APP_ROLE_NAMES.facilitator],
});
