"use client";

import React from "react";
import DashboardOverview from "@/components/admin/DashboardOverview";
import withAuth from "@/hoc/withAuth";
import { APP_ROLE_NAMES } from "@/constants/auth/permissions";

const DashboardPage: React.FC = () => <DashboardOverview />;

export default withAuth(DashboardPage, {
  allowedRoles: [APP_ROLE_NAMES.tenantAdmin],
  allowHost: true,
});
