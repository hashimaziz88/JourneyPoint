"use client";

import React from "react";
import TenantManager from "@/components/admin/TenantManager";
import withAuth from "@/hoc/withAuth";
import { APP_PERMISSIONS } from "@/constants/auth/permissions";

const TenantsPage: React.FC = () => <TenantManager />;

export default withAuth(TenantsPage, {
  requiredPermission: APP_PERMISSIONS.tenants,
  allowHost: true,
});
