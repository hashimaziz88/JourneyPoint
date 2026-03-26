"use client"
import React, { useReducer, useContext } from "react";
import {
    INITIAL_STATE, RoleActionContext, RoleStateContext,
    ICreateRoleDto, IGetAllRolesRequest, IRoleDto,
} from "./context";
import { RoleReducer } from "./reducer";
import {
    getAllRolesPending, getAllRolesSuccess, getAllRolesError,
    getRoleForEditPending, getRoleForEditSuccess, getRoleForEditError,
    createRolePending, createRoleSuccess, createRoleError,
    updateRolePending, updateRoleSuccess, updateRoleError,
    deleteRolePending, deleteRoleSuccess, deleteRoleError,
    getAllPermissionsPending, getAllPermissionsSuccess, getAllPermissionsError,
} from "./actions";
import { getAxiosInstace } from "@/utils/axiosInstance";

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(RoleReducer, INITIAL_STATE);

    const getAll = async (request: IGetAllRolesRequest) => {
        dispatch(getAllRolesPending());
        await getAxiosInstace().get("/api/services/app/Role/GetAll", { params: request })
            .then((response) => {
                const data = response.data?.result ?? response.data;
                dispatch(getAllRolesSuccess({ items: data?.items ?? [], totalCount: data?.totalCount ?? 0 }));
            })
            .catch((error) => {
                console.error(error);
                dispatch(getAllRolesError());
            });
    };

    const getRoleForEdit = async (id: number) => {
        dispatch(getRoleForEditPending());
        await getAxiosInstace().get("/api/services/app/Role/GetRoleForEdit", { params: { id } })
            .then((response) => {
                const data = response.data?.result ?? response.data;
                dispatch(getRoleForEditSuccess(data));
            })
            .catch((error) => {
                console.error(error);
                dispatch(getRoleForEditError());
            });
    };

    const createRole = async (payload: ICreateRoleDto) => {
        dispatch(createRolePending());
        await getAxiosInstace().post("/api/services/app/Role/Create", payload)
            .then(() => {
                dispatch(createRoleSuccess());
            })
            .catch((error) => {
                console.error(error);
                dispatch(createRoleError());
            });
    };

    const updateRole = async (payload: IRoleDto) => {
        dispatch(updateRolePending());
        await getAxiosInstace().put("/api/services/app/Role/Update", payload)
            .then(() => {
                dispatch(updateRoleSuccess());
            })
            .catch((error) => {
                console.error(error);
                dispatch(updateRoleError());
            });
    };

    const deleteRole = async (id: number) => {
        dispatch(deleteRolePending());
        await getAxiosInstace().delete("/api/services/app/Role/Delete", { params: { id } })
            .then(() => {
                dispatch(deleteRoleSuccess());
            })
            .catch((error) => {
                console.error(error);
                dispatch(deleteRoleError());
            });
    };

    const getAllPermissions = async () => {
        dispatch(getAllPermissionsPending());
        await getAxiosInstace().get("/api/services/app/Role/GetAllPermissions")
            .then((response) => {
                const data = response.data?.result ?? response.data;
                dispatch(getAllPermissionsSuccess(data?.items ?? []));
            })
            .catch((error) => {
                console.error(error);
                dispatch(getAllPermissionsError());
            });
    };

    return (
        <RoleStateContext.Provider value={state}>
            <RoleActionContext.Provider value={{ getAll, getRoleForEdit, createRole, updateRole, deleteRole, getAllPermissions }}>
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
