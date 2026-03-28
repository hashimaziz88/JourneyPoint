import { DEFAULT_HIRE_LIST_SORTING } from "@/constants/hire/list";
import type { IGetHiresInput, IHireListQueryState } from "@/types/hire";

export const buildHireListRequest = (
    query: IHireListQueryState,
): IGetHiresInput => ({
    keyword: query.keyword || undefined,
    status: query.status,
    skipCount: (query.current - 1) * query.pageSize,
    maxResultCount: query.pageSize,
    sorting: DEFAULT_HIRE_LIST_SORTING,
});
