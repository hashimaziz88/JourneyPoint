import React from "react";
import { APP_ROLE_NAMES } from "@/constants/auth/permissions";
import { ENROLEE_NAVIGATION_ITEMS } from "@/constants/global/navigation";
import RoleShell from "@/layout/RoleShell";

const EnroleeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleShell
    title="Enrolee Workspace"
    subtitle="Personal onboarding journey"
    navigationItems={ENROLEE_NAVIGATION_ITEMS}
    allowedRoles={[APP_ROLE_NAMES.enrolee]}
  >
    {children}
  </RoleShell>
);

export default EnroleeLayout;
