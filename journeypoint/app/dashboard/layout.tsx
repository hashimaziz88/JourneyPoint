import React from "react";
import AdminShell from "@/components/admin/AdminShell";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AdminShell>{children}</AdminShell>
);

export default DashboardLayout;
