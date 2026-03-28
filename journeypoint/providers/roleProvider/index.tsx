"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  createRoleError,
  createRolePending,
  createRoleSuccess,
  deleteRoleError,
  deleteRolePending,
  deleteRoleSuccess,
  getAllPermissionsError,
  getAllPermissionsPending,
  getAllPermissionsSuccess,
  getAllRolesError,
  getAllRolesPending,
  getAllRolesSuccess,
  getRoleForEditError,
  getRoleForEditPending,
  getRoleForEditSuccess,
  updateRoleError,
  updateRolePending,
  updateRoleSuccess,
} from "./actions";
import {
  INITIAL_STATE,
  RoleActionContext,
  RoleStateContext,
  type ICreateRoleDto,
  type IGetAllRolesRequest,
  type IRoleDto,
} from "./context";
import { RoleReducer } from "./reducer";

/**
 * Provides role-management state and actions for admin workspaces.
 */
export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(RoleReducer, INITIAL_STATE);

  const getAll = async (request: IGetAllRolesRequest): Promise<void> => {
    dispatch(getAllRolesPending());

    try {
      const response = await getAxiosInstance().get(
        "/api/services/app/Role/GetAll",
        { params: request },
      );
      const data = response.data?.result ?? response.data;

      dispatch(
        getAllRolesSuccess({
          items: data?.items ?? [],
          totalCount: data?.totalCount ?? 0,
        }),
      );
    } catch (error) {
      console.error(error);
      dispatch(getAllRolesError());
    }
  };

  const getRoleForEdit = async (id: number): Promise<void> => {
    dispatch(getRoleForEditPending());

    try {
      const response = await getAxiosInstance().get(
        "/api/services/app/Role/GetRoleForEdit",
        { params: { id } },
      );
      const data = response.data?.result ?? response.data;

      dispatch(getRoleForEditSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(getRoleForEditError());
    }
  };

  const createRole = async (payload: ICreateRoleDto): Promise<void> => {
    dispatch(createRolePending());

    try {
      await getAxiosInstance().post("/api/services/app/Role/Create", payload);
      dispatch(createRoleSuccess());
    } catch (error) {
      console.error(error);
      dispatch(createRoleError());
    }
  };

  const updateRole = async (payload: IRoleDto): Promise<void> => {
    dispatch(updateRolePending());

    try {
      await getAxiosInstance().put("/api/services/app/Role/Update", payload);
      dispatch(updateRoleSuccess());
    } catch (error) {
      console.error(error);
      dispatch(updateRoleError());
    }
  };

  const deleteRole = async (id: number): Promise<void> => {
    dispatch(deleteRolePending());

    try {
      await getAxiosInstance().delete("/api/services/app/Role/Delete", {
        params: { id },
      });
      dispatch(deleteRoleSuccess());
    } catch (error) {
      console.error(error);
      dispatch(deleteRoleError());
    }
  };

  const getAllPermissions = async (): Promise<void> => {
    dispatch(getAllPermissionsPending());

    try {
      const response = await getAxiosInstance().get(
        "/api/services/app/Role/GetAllPermissions",
      );
      const data = response.data?.result ?? response.data;

      dispatch(getAllPermissionsSuccess(data?.items ?? []));
    } catch (error) {
      console.error(error);
      dispatch(getAllPermissionsError());
    }
  };

  return (
    <RoleStateContext.Provider value={state}>
      <RoleActionContext.Provider
        value={{
          getAll,
          getRoleForEdit,
          createRole,
          updateRole,
          deleteRole,
          getAllPermissions,
        }}
      >
        {children}
      </RoleActionContext.Provider>
    </RoleStateContext.Provider>
  );
};

export const useRoleState = () => {
  const context = useContext(RoleStateContext);

  if (context === undefined) {
    throw new Error("useRoleState must be used within a RoleProvider");
  }

  return context;
};

export const useRoleActions = () => {
  const context = useContext(RoleActionContext);

  if (context === undefined) {
    throw new Error("useRoleActions must be used within a RoleProvider");
  }

  return context;
};
