import { createContext } from "react";
export type { IRoleDto, ICreateRoleDto, IPermissionDto, IGetRoleForEditOutput, IGetAllRolesRequest } from "@/types/role";
import type { IRoleDto, ICreateRoleDto, IPermissionDto, IGetRoleForEditOutput, IGetAllRolesRequest } from "@/types/role";

export interface IRoleStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    roles?: IRoleDto[] | null;
    currentRole?: IGetRoleForEditOutput | null;
    totalCount?: number;
    availablePermissions?: IPermissionDto[] | null;
}

export interface IRoleActionContext {
    getAll: (request: IGetAllRolesRequest) => Promise<void>;
    getRoleForEdit: (id: number) => Promise<void>;
    createRole: (payload: ICreateRoleDto) => Promise<void>;
    updateRole: (payload: IRoleDto) => Promise<void>;
    deleteRole: (id: number) => Promise<void>;
    getAllPermissions: () => Promise<void>;
}

export const INITIAL_STATE: IRoleStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    roles: [],
    currentRole: null,
    totalCount: 0,
    availablePermissions: [],
};

export const RoleStateContext = createContext<IRoleStateContext>(INITIAL_STATE);
export const RoleActionContext = createContext<IRoleActionContext | undefined>(undefined);
