"use client";

import React from "react";
import RoleManager from "@/components/admin/RoleManager";
import withAuth from "@/hoc/withAuth";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";

const RolesPage: React.FC = () => <RoleManager />;

export default withAuth(RolesPage, {
  requiredPermission: APP_PERMISSIONS.roles,
  allowedRoles: [APP_ROLE_NAMES.tenantAdmin],
  allowHost: true,
});
