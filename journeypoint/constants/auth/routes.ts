export const APP_ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  users: "/dashboard/users",
  roles: "/dashboard/roles",
  tenants: "/dashboard/tenants",
  facilitatorDashboard: "/facilitator/dashboard",
  facilitatorPlans: "/facilitator/plans",
  facilitatorMarkdownImport: "/facilitator/markdown-import",
  managerMyTasks: "/manager/my-tasks",
  enroleeMyJourney: "/enrolee/my-journey",
};

export const buildFacilitatorPlanRoute = (planId: string): string =>
  `${APP_ROUTES.facilitatorPlans}/${planId}`;

export const buildFacilitatorPlanDocumentRoute = (
  planId: string,
  documentId: string,
): string => `${buildFacilitatorPlanRoute(planId)}/documents/${documentId}`;
