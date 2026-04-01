import { createContext } from "react";
export type { TenantDto, CreateTenantDto, GetAllTenantsRequest } from "@/types/tenant/tenant";
import type { TenantDto, CreateTenantDto, GetAllTenantsRequest } from "@/types/tenant/tenant";

export interface ITenantStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    tenants?: TenantDto[] | null;
    currentTenant?: TenantDto | null;
    totalCount?: number;
}

export interface ITenantActionContext {
    getAll: (request: GetAllTenantsRequest) => Promise<void>;
    createTenant: (payload: CreateTenantDto) => Promise<void>;
    updateTenant: (payload: TenantDto) => Promise<void>;
    deleteTenant: (id: number) => Promise<void>;
}

export const INITIAL_STATE: ITenantStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    tenants: [],
    currentTenant: null,
    totalCount: 0,
};

export const TenantStateContext = createContext<ITenantStateContext>(INITIAL_STATE);
export const TenantActionContext = createContext<ITenantActionContext | undefined>(undefined);
