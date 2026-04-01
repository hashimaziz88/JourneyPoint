import { createAction } from "redux-actions";
import { ITenantStateContext, TenantDto } from "./context";

export enum TenantActionEnums {
    getAllTenantsPending = "GET_ALL_TENANTS_PENDING",
    getAllTenantsSuccess = "GET_ALL_TENANTS_SUCCESS",
    getAllTenantsError = "GET_ALL_TENANTS_ERROR",

    createTenantPending = "CREATE_TENANT_PENDING",
    createTenantSuccess = "CREATE_TENANT_SUCCESS",
    createTenantError = "CREATE_TENANT_ERROR",

    updateTenantPending = "UPDATE_TENANT_PENDING",
    updateTenantSuccess = "UPDATE_TENANT_SUCCESS",
    updateTenantError = "UPDATE_TENANT_ERROR",

    deleteTenantPending = "DELETE_TENANT_PENDING",
    deleteTenantSuccess = "DELETE_TENANT_SUCCESS",
    deleteTenantError = "DELETE_TENANT_ERROR",
}

export const getAllTenantsPending = createAction<ITenantStateContext>(
    TenantActionEnums.getAllTenantsPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const getAllTenantsSuccess = createAction<ITenantStateContext, { items: TenantDto[]; totalCount: number }>(
    TenantActionEnums.getAllTenantsSuccess,
    ({ items, totalCount }) => ({ isPending: false, isError: false, isSuccess: true, tenants: items, totalCount })
);

export const getAllTenantsError = createAction<ITenantStateContext>(
    TenantActionEnums.getAllTenantsError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const createTenantPending = createAction<ITenantStateContext>(
    TenantActionEnums.createTenantPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const createTenantSuccess = createAction<ITenantStateContext>(
    TenantActionEnums.createTenantSuccess,
    () => ({ isPending: false, isError: false, isSuccess: true })
);

export const createTenantError = createAction<ITenantStateContext>(
    TenantActionEnums.createTenantError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const updateTenantPending = createAction<ITenantStateContext>(
    TenantActionEnums.updateTenantPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const updateTenantSuccess = createAction<ITenantStateContext>(
    TenantActionEnums.updateTenantSuccess,
    () => ({ isPending: false, isError: false, isSuccess: true })
);

export const updateTenantError = createAction<ITenantStateContext>(
    TenantActionEnums.updateTenantError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const deleteTenantPending = createAction<ITenantStateContext>(
    TenantActionEnums.deleteTenantPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const deleteTenantSuccess = createAction<ITenantStateContext>(
    TenantActionEnums.deleteTenantSuccess,
    () => ({ isPending: false, isError: false, isSuccess: true })
);

export const deleteTenantError = createAction<ITenantStateContext>(
    TenantActionEnums.deleteTenantError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);
