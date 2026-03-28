import type { TablePaginationConfig } from "antd/es/table";
import type { IGetAllRolesRequest } from "@/types/role";

/**
 * Builds the role-list query from the current search and pagination state.
 */
export const buildRoleQuery = (
    searchTerm: string,
    pagination: TablePaginationConfig,
): IGetAllRolesRequest => ({
    keyword: searchTerm || null,
    skipCount: ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10),
    maxResultCount: pagination.pageSize ?? 10,
});
