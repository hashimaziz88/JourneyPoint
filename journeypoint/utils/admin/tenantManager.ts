import type { TablePaginationConfig } from "antd/es/table";
import type { IGetAllTenantsRequest } from "@/types/tenant";

/**
 * Builds the tenant-list query from the current search, filter, and pagination state.
 */
export const buildTenantQuery = (
    searchTerm: string,
    activeFilter: boolean | undefined,
    pagination: TablePaginationConfig,
): IGetAllTenantsRequest => ({
    keyword: searchTerm || null,
    isActive: activeFilter ?? null,
    skipCount: ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10),
    maxResultCount: pagination.pageSize ?? 10,
});
