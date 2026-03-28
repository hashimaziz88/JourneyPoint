import type { IPlanListQueryState } from "@/types/plans/components";

export const DEFAULT_PLAN_LIST_SORTING = "LastUpdatedTime DESC";

export const DEFAULT_PLAN_LIST_QUERY_STATE: IPlanListQueryState = {
    current: 1,
    keyword: "",
    maxResultCount: 6,
};
