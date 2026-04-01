import { DEFAULT_PLAN_LIST_SORTING } from "@/constants/plans/list";
import type { GetOnboardingPlansInput } from "@/types/onboarding-plan/onboarding-plan";
import type { PlanListQueryState } from "@/types/plans/components";

export const buildPlanListRequest = (
    query: PlanListQueryState,
): GetOnboardingPlansInput => ({
    keyword: query.keyword.trim() || null,
    status: query.status ?? null,
    skipCount: (query.current - 1) * query.maxResultCount,
    maxResultCount: query.maxResultCount,
    sorting: DEFAULT_PLAN_LIST_SORTING,
});
