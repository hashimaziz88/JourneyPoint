import { APP_PERMISSIONS } from "@/constants/auth/permissions";
import { APP_ROUTES } from "@/constants/auth/routes";

export type NavigationIconKey =
  | "dashboard"
  | "tenants"
  | "users"
  | "roles"
  | "plans"
  | "pipeline"
  | "facilitator"
  | "manager"
  | "enrolee";

export interface IWorkspaceNavigationItem {
  key: string;
  label: string;
  href: string;
  permission?: string;
  description: string;
  iconKey: NavigationIconKey;
}

export const ADMIN_NAVIGATION_ITEMS: IWorkspaceNavigationItem[] = [
  {
    key: "dashboard",
    label: "Overview",
    href: APP_ROUTES.dashboard,
    description: "Overview and quick actions",
    iconKey: "dashboard",
  },
  {
    key: "tenants",
    label: "Tenants",
    href: APP_ROUTES.tenants,
    permission: APP_PERMISSIONS.tenants,
    description: "Host-only tenant management",
    iconKey: "tenants",
  },
  {
    key: "users",
    label: "Users",
    href: APP_ROUTES.users,
    permission: APP_PERMISSIONS.users,
    description: "Manage users for the current scope",
    iconKey: "users",
  },
  {
    key: "roles",
    label: "Roles",
    href: APP_ROUTES.roles,
    permission: APP_PERMISSIONS.roles,
    description: "Manage role permissions",
    iconKey: "roles",
  },
];

export const FACILITATOR_NAVIGATION_ITEMS: IWorkspaceNavigationItem[] = [
  {
    key: "facilitator-dashboard",
    label: "Overview",
    href: APP_ROUTES.facilitatorDashboard,
    permission: APP_PERMISSIONS.facilitator,
    description: "Facilitator landing and milestone-one workspace access",
    iconKey: "facilitator",
  },
  {
    key: "facilitator-plans",
    label: "Plans",
    href: APP_ROUTES.facilitatorPlans,
    permission: APP_PERMISSIONS.facilitator,
    description: "Create, refine, publish, and clone onboarding templates",
    iconKey: "plans",
  },
  {
    key: "facilitator-hires",
    label: "Hires",
    href: APP_ROUTES.facilitatorHires,
    permission: APP_PERMISSIONS.facilitator,
    description: "Manage enrolled hires and review journey activation state",
    iconKey: "facilitator",
  },
  {
    key: "facilitator-pipeline",
    label: "Pipeline",
    href: APP_ROUTES.facilitatorPipeline,
    permission: APP_PERMISSIONS.facilitator,
    description: "Monitor module-stage progress, engagement health, and at-risk visibility",
    iconKey: "pipeline",
  },
];

export const MANAGER_NAVIGATION_ITEMS: IWorkspaceNavigationItem[] = [
  {
    key: "manager-my-tasks",
    label: "My Tasks",
    href: APP_ROUTES.managerMyTasks,
    permission: APP_PERMISSIONS.manager,
    description: "Manager-assigned task workspace",
    iconKey: "manager",
  },
];

export const ENROLEE_NAVIGATION_ITEMS: IWorkspaceNavigationItem[] = [
  {
    key: "enrolee-my-journey",
    label: "My Journey",
    href: APP_ROUTES.enroleeMyJourney,
    permission: APP_PERMISSIONS.enrolee,
    description: "Personal onboarding journey workspace",
    iconKey: "enrolee",
  },
];
