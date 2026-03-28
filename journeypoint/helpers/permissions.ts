import {
  APP_PERMISSIONS,
  APP_ROLE_NAMES,
  type AppRoleName,
} from "@/constants/auth/permissions";
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

export const hasAnyPermission = (
  grantedPermissions: string[] | null | undefined,
  permissions: string[],
): boolean => permissions.some((permission) => hasPermission(grantedPermissions, permission));

export const isRoleName = (value?: string | null): value is AppRoleName =>
  Object.values(APP_ROLE_NAMES).includes((value ?? "") as AppRoleName);

export const getDefaultAuthorizedRoute = (
  grantedPermissions: string[] | null | undefined,
  roleNames: string[] | null | undefined,
  primaryRoleName?: string | null,
  isHostScope = false,
): string => {
  const normalizedRoleNames = (roleNames ?? []).filter(isRoleName);
  const hasRole = (roleName: AppRoleName): boolean =>
    primaryRoleName === roleName || normalizedRoleNames.includes(roleName);

  if (
    isHostScope ||
    hasRole(APP_ROLE_NAMES.tenantAdmin) ||
    hasPermission(grantedPermissions, APP_PERMISSIONS.tenants) ||
    hasPermission(grantedPermissions, APP_PERMISSIONS.tenantAdmin)
  ) {
    return APP_ROUTES.dashboard;
  }

  if (hasRole(APP_ROLE_NAMES.facilitator) || hasPermission(grantedPermissions, APP_PERMISSIONS.facilitator)) {
    return APP_ROUTES.facilitatorDashboard;
  }

  if (hasRole(APP_ROLE_NAMES.manager) || hasPermission(grantedPermissions, APP_PERMISSIONS.manager)) {
    return APP_ROUTES.managerMyTasks;
  }

  if (hasRole(APP_ROLE_NAMES.enrolee) || hasPermission(grantedPermissions, APP_PERMISSIONS.enrolee)) {
    return APP_ROUTES.enroleeMyJourney;
  }

  return APP_ROUTES.dashboard;
};
