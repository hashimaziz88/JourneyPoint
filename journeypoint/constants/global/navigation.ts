import { APP_PERMISSIONS } from "@/constants/auth/permissions";
import { APP_ROUTES } from "@/constants/auth/routes";

export interface IAdminNavigationItem {
  key: string;
  label: string;
  href: string;
  permission?: string;
  description: string;
}

export const ADMIN_NAVIGATION_ITEMS: IAdminNavigationItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: APP_ROUTES.dashboard,
    description: "Overview and quick actions",
  },
  {
    key: "tenants",
    label: "Tenants",
    href: APP_ROUTES.tenants,
    permission: APP_PERMISSIONS.tenants,
    description: "Host-only tenant management",
  },
  {
    key: "users",
    label: "Users",
    href: APP_ROUTES.users,
    permission: APP_PERMISSIONS.users,
    description: "Manage users for the current scope",
  },
  {
    key: "roles",
    label: "Roles",
    href: APP_ROUTES.roles,
    permission: APP_PERMISSIONS.roles,
    description: "Manage role permissions",
  },
];
