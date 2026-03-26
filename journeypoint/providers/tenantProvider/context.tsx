import { createContext } from "react";
export type { ITenantDto, ICreateTenantDto, IGetAllTenantsRequest } from "@/types/tenant";
import type { ITenantDto, ICreateTenantDto, IGetAllTenantsRequest } from "@/types/tenant";

export interface ITenantStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    tenants?: ITenantDto[] | null;
    currentTenant?: ITenantDto | null;
    totalCount?: number;
}

export interface ITenantActionContext {
    getAll: (request: IGetAllTenantsRequest) => Promise<void>;
    createTenant: (payload: ICreateTenantDto) => Promise<void>;
    updateTenant: (payload: ITenantDto) => Promise<void>;
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
export const TenantActionContext = createContext<ITenantActionContext>(undefined!);
