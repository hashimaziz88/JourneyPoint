"use client";

import React from "react";
import UserManager from "@/components/admin/UserManager";
import withAuth from "@/hoc/withAuth";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";

const UsersPage: React.FC = () => <UserManager />;

export default withAuth(UsersPage, {
  requiredPermission: APP_PERMISSIONS.users,
  allowedRoles: [APP_ROLE_NAMES.tenantAdmin],
  allowHost: true,
});
