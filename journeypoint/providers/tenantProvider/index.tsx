"use client"
import React, { useReducer, useContext } from "react";
import {
    INITIAL_STATE, TenantActionContext, TenantStateContext,
    ICreateTenantDto, IGetAllTenantsRequest, ITenantDto,
} from "./context";
import { TenantReducer } from "./reducer";
import {
    getAllTenantsPending, getAllTenantsSuccess, getAllTenantsError,
    createTenantPending, createTenantSuccess, createTenantError,
    updateTenantPending, updateTenantSuccess, updateTenantError,
    deleteTenantPending, deleteTenantSuccess, deleteTenantError,
} from "./actions";
import { getAxiosInstace } from "@/utils/axiosInstance";

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(TenantReducer, INITIAL_STATE);

    const getAll = async (request: IGetAllTenantsRequest) => {
        dispatch(getAllTenantsPending());
        await getAxiosInstace().get("/api/services/app/Tenant/GetAll", { params: request })
            .then((response) => {
                const data = response.data?.result ?? response.data;
                dispatch(getAllTenantsSuccess({ items: data?.items ?? [], totalCount: data?.totalCount ?? 0 }));
            })
            .catch((error) => {
                console.error(error);
                dispatch(getAllTenantsError());
            });
    };

    const createTenant = async (payload: ICreateTenantDto) => {
        dispatch(createTenantPending());
        await getAxiosInstace().post("/api/services/app/Tenant/Create", payload)
            .then(() => {
                dispatch(createTenantSuccess());
            })
            .catch((error) => {
                console.error(error);
                dispatch(createTenantError());
            });
    };

    const updateTenant = async (payload: ITenantDto) => {
        dispatch(updateTenantPending());
        await getAxiosInstace().put("/api/services/app/Tenant/Update", payload)
            .then(() => {
                dispatch(updateTenantSuccess());
            })
            .catch((error) => {
                console.error(error);
                dispatch(updateTenantError());
            });
    };

    const deleteTenant = async (id: number) => {
        dispatch(deleteTenantPending());
        await getAxiosInstace().delete("/api/services/app/Tenant/Delete", { params: { id } })
            .then(() => {
                dispatch(deleteTenantSuccess());
            })
            .catch((error) => {
                console.error(error);
                dispatch(deleteTenantError());
            });
    };

    return (
        <TenantStateContext.Provider value={state}>
            <TenantActionContext.Provider value={{ getAll, createTenant, updateTenant, deleteTenant }}>
                {children}
            </TenantActionContext.Provider>
        </TenantStateContext.Provider>
    );
};

export const useTenantState = () => {
    const context = useContext(TenantStateContext);
    if (context === undefined) {
        throw new Error("useTenantState must be used within a TenantProvider");
    }
    return context;
};

export const useTenantActions = () => {
    const context = useContext(TenantActionContext);
    if (context === undefined) {
        throw new Error("useTenantActions must be used within a TenantProvider");
    }
    return context;
};
