export const APP_PERMISSIONS = {
  users: "Pages.Users",
  roles: "Pages.Roles",
  tenants: "Pages.Tenants",
} as const;

export const DEFAULT_PERMISSION_ORDER = [
  APP_PERMISSIONS.tenants,
  APP_PERMISSIONS.users,
  APP_PERMISSIONS.roles,
] as const;
