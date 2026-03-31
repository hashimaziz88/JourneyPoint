export const APP_ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  users: "/dashboard/users",
  roles: "/dashboard/roles",
  tenants: "/dashboard/tenants",
  facilitatorDashboard: "/facilitator/dashboard",
  facilitatorPlans: "/facilitator/plans",
  facilitatorPlanImport: "/facilitator/plans/import",
  facilitatorHires: "/facilitator/hires",
  facilitatorPipeline: "/facilitator/pipeline",
  managerMyTasks: "/manager/my-tasks",
  enroleeMyJourney: "/enrolee/my-journey",
};

export const buildFacilitatorPlanRoute = (planId: string): string =>
  `${APP_ROUTES.facilitatorPlans}/${planId}`;

export const buildFacilitatorPlanDocumentRoute = (
  planId: string,
  documentId: string,
): string => `${buildFacilitatorPlanRoute(planId)}/documents/${documentId}`;

export const buildFacilitatorHireRoute = (hireId: string): string =>
  `${APP_ROUTES.facilitatorHires}/${hireId}`;

export const buildFacilitatorHireJourneyRoute = (hireId: string): string =>
  `${buildFacilitatorHireRoute(hireId)}/journey`;

export const buildEnroleeJourneyTaskRoute = (taskId: string): string =>
  `${APP_ROUTES.enroleeMyJourney}/tasks/${taskId}`;
