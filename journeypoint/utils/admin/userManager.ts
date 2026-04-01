import type { TablePaginationConfig } from "antd/es/table";
import type { GetAllUsersRequest } from "@/types/user/user";

/**
 * Builds the user-list query from the current search, filter, and pagination state.
 */
export const buildUserQuery = (
    searchTerm: string,
    activeFilter: boolean | undefined,
    pagination: TablePaginationConfig,
): GetAllUsersRequest => ({
    keyword: searchTerm || null,
    isActive: activeFilter ?? null,
    skipCount: ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10),
    maxResultCount: pagination.pageSize ?? 10,
});
