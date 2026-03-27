import React from "react";
import { APP_ROLE_NAMES } from "@/constants/auth/permissions";
import { MANAGER_NAVIGATION_ITEMS } from "@/constants/global/navigation";
import RoleShell from "@/layout/RoleShell";

const ManagerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleShell
    title="Manager Workspace"
    subtitle="Direct-report support and approvals"
    navigationItems={MANAGER_NAVIGATION_ITEMS}
    allowedRoles={[APP_ROLE_NAMES.manager]}
  >
    {children}
  </RoleShell>
);

export default ManagerLayout;
