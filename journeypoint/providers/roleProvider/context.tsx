import { createContext } from "react";
export type { RoleDto, CreateRoleDto, PermissionDto, GetRoleForEditOutput, GetAllRolesRequest } from "@/types/role/role";
import type { RoleDto, CreateRoleDto, PermissionDto, GetRoleForEditOutput, GetAllRolesRequest } from "@/types/role/role";

export interface IRoleStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    roles?: RoleDto[] | null;
    currentRole?: GetRoleForEditOutput | null;
    totalCount?: number;
    availablePermissions?: PermissionDto[] | null;
}

export interface IRoleActionContext {
    getAll: (request: GetAllRolesRequest) => Promise<void>;
    getRoleForEdit: (id: number) => Promise<void>;
    createRole: (payload: CreateRoleDto) => Promise<void>;
    updateRole: (payload: RoleDto) => Promise<void>;
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
