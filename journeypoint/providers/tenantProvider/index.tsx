"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  createTenantError,
  createTenantPending,
  createTenantSuccess,
  deleteTenantError,
  deleteTenantPending,
  deleteTenantSuccess,
  getAllTenantsError,
  getAllTenantsPending,
  getAllTenantsSuccess,
  updateTenantError,
  updateTenantPending,
  updateTenantSuccess,
} from "./actions";
import {
  INITIAL_STATE,
  TenantActionContext,
  TenantStateContext,
  type CreateTenantDto,
  type GetAllTenantsRequest,
  type TenantDto,
} from "./context";
import { TenantReducer } from "./reducer";

/**
 * Provides tenant-management state and actions for the host admin workspace.
 */
export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(TenantReducer, INITIAL_STATE);

  const getAll = async (request: GetAllTenantsRequest): Promise<void> => {
    dispatch(getAllTenantsPending());

    try {
      const response = await getAxiosInstance().get(
        "/api/services/app/Tenant/GetAll",
        { params: request },
      );
      const data = response.data?.result ?? response.data;

      dispatch(
        getAllTenantsSuccess({
          items: data?.items ?? [],
          totalCount: data?.totalCount ?? 0,
        }),
      );
    } catch (error) {
      console.error(error);
      dispatch(getAllTenantsError());
    }
  };

  const createTenant = async (payload: CreateTenantDto): Promise<void> => {
    dispatch(createTenantPending());

    try {
      await getAxiosInstance().post("/api/services/app/Tenant/Create", payload);
      dispatch(createTenantSuccess());
    } catch (error) {
      console.error(error);
      dispatch(createTenantError());
    }
  };

  const updateTenant = async (payload: TenantDto): Promise<void> => {
    dispatch(updateTenantPending());

    try {
      await getAxiosInstance().put("/api/services/app/Tenant/Update", payload);
      dispatch(updateTenantSuccess());
    } catch (error) {
      console.error(error);
      dispatch(updateTenantError());
    }
  };

  const deleteTenant = async (id: number): Promise<void> => {
    dispatch(deleteTenantPending());

    try {
      await getAxiosInstance().delete("/api/services/app/Tenant/Delete", {
        params: { id },
      });
      dispatch(deleteTenantSuccess());
    } catch (error) {
      console.error(error);
      dispatch(deleteTenantError());
    }
  };

  return (
    <TenantStateContext.Provider value={state}>
      <TenantActionContext.Provider
        value={{ getAll, createTenant, updateTenant, deleteTenant }}
      >
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
