import React from "react";
import { APP_ROLE_NAMES } from "@/constants/auth/permissions";
import { FACILITATOR_NAVIGATION_ITEMS } from "@/constants/global/navigation";
import RoleShell from "@/layouts/RoleShell";

const FacilitatorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleShell
    title="Facilitator Workspace"
    subtitle="Plan and onboarding coordination"
    navigationItems={FACILITATOR_NAVIGATION_ITEMS}
    allowedRoles={[APP_ROLE_NAMES.facilitator]}
  >
    {children}
  </RoleShell>
);

export default FacilitatorLayout;
