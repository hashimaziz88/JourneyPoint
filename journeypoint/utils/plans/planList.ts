import { DEFAULT_PLAN_LIST_SORTING } from "@/constants/plans/list";
import type { IGetOnboardingPlansInput } from "@/types/onboarding-plan";
import type { IPlanListQueryState } from "@/types/plans/components";

export const buildPlanListRequest = (
    query: IPlanListQueryState,
): IGetOnboardingPlansInput => ({
    keyword: query.keyword.trim() || null,
    status: query.status ?? null,
    skipCount: (query.current - 1) * query.maxResultCount,
    maxResultCount: query.maxResultCount,
    sorting: DEFAULT_PLAN_LIST_SORTING,
});
