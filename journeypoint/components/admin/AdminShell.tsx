"use client";

import React from "react";
import { APP_ROLE_NAMES } from "@/constants/auth/permissions";
import { ADMIN_NAVIGATION_ITEMS } from "@/constants/global/navigation";
import RoleShell from "@/layout/RoleShell";

const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleShell
    title="Admin Workspace"
    subtitle="Host and tenant administration"
    navigationItems={ADMIN_NAVIGATION_ITEMS}
    allowedRoles={[APP_ROLE_NAMES.tenantAdmin]}
    allowHost
  >
    {children}
  </RoleShell>
);

export default AdminShell;
