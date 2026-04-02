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
    facilitatorWellness: "/facilitator/wellness",
    managerMyTasks: "/manager/my-tasks",
    managerWellness: "/manager/wellness",
    enroleeMyJourney: "/enrolee/my-journey",
    enroleeWellness: "/enrolee/wellness",
} as const;

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

export const buildFacilitatorHireWellnessRoute = (hireId: string): string =>
    `${APP_ROUTES.facilitatorWellness}/${hireId}`;

export const buildFacilitatorWellnessCheckInRoute = (hireId: string, checkInId: string): string =>
    `${buildFacilitatorHireWellnessRoute(hireId)}/${checkInId}`;

export const buildManagerHireWellnessRoute = (hireId: string): string =>
    `${APP_ROUTES.managerWellness}/${hireId}`;

export const buildEnroleeWellnessCheckInRoute = (checkInId: string): string =>
    `${APP_ROUTES.enroleeWellness}/${checkInId}`;
