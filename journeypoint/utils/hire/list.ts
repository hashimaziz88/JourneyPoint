import { DEFAULT_HIRE_LIST_SORTING } from "@/constants/hire/list";
import type { GetHiresInput, HireListQueryState } from "@/types/hire/hire";

export const buildHireListRequest = (
    query: HireListQueryState,
): GetHiresInput => ({
    keyword: query.keyword || undefined,
    status: query.status,
    skipCount: (query.current - 1) * query.pageSize,
    maxResultCount: query.pageSize,
    sorting: DEFAULT_HIRE_LIST_SORTING,
});
