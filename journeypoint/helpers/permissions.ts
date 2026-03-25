import { APP_PERMISSIONS } from "@/constants/auth/permissions";
import { APP_ROUTES } from "@/constants/auth/routes";

export const extractGrantedPermissions = (
  grantedPermissions?: Record<string, boolean> | null,
): string[] => {
  if (!grantedPermissions) {
    return [];
  }

  return Object.entries(grantedPermissions)
    .filter(([, granted]) => granted)
    .map(([permission]) => permission);
};

export const hasPermission = (
  grantedPermissions: string[] | null | undefined,
  permission?: string,
): boolean => {
  if (!permission) {
    return true;
  }

  return (grantedPermissions ?? []).includes(permission);
};

export const getDefaultAuthorizedRoute = (
  grantedPermissions: string[] | null | undefined,
): string => {
  if (hasPermission(grantedPermissions, APP_PERMISSIONS.tenants)) {
    return APP_ROUTES.tenants;
  }

  if (hasPermission(grantedPermissions, APP_PERMISSIONS.users)) {
    return APP_ROUTES.users;
  }

  if (hasPermission(grantedPermissions, APP_PERMISSIONS.roles)) {
    return APP_ROUTES.roles;
  }

  return APP_ROUTES.dashboard;
};
