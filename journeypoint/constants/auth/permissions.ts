export const APP_ROLE_NAMES = {
  tenantAdmin: "TenantAdmin",
  facilitator: "Facilitator",
  manager: "Manager",
  enrolee: "Enrolee",
} as const;

export const APP_PERMISSIONS = {
  journeyPoint: "Pages.JourneyPoint",
  tenantAdmin: "Pages.JourneyPoint.TenantAdmin",
  facilitator: "Pages.JourneyPoint.Facilitator",
  manager: "Pages.JourneyPoint.Manager",
  enrolee: "Pages.JourneyPoint.Enrolee",
  users: "Pages.Users",
  roles: "Pages.Roles",
  tenants: "Pages.Tenants",
};

export const DEFAULT_PERMISSION_ORDER = [
  APP_PERMISSIONS.tenants,
  APP_PERMISSIONS.tenantAdmin,
  APP_PERMISSIONS.facilitator,
  APP_PERMISSIONS.manager,
  APP_PERMISSIONS.enrolee,
  APP_PERMISSIONS.users,
  APP_PERMISSIONS.roles,
];
