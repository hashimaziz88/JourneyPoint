import { createAction } from "redux-actions";
import { IRoleStateContext, RoleDto, PermissionDto, GetRoleForEditOutput } from "./context";

export enum RoleActionEnums {
    getAllRolesPending = "GET_ALL_ROLES_PENDING",
    getAllRolesSuccess = "GET_ALL_ROLES_SUCCESS",
    getAllRolesError = "GET_ALL_ROLES_ERROR",

    getRoleForEditPending = "GET_ROLE_FOR_EDIT_PENDING",
    getRoleForEditSuccess = "GET_ROLE_FOR_EDIT_SUCCESS",
    getRoleForEditError = "GET_ROLE_FOR_EDIT_ERROR",

    createRolePending = "CREATE_ROLE_PENDING",
    createRoleSuccess = "CREATE_ROLE_SUCCESS",
    createRoleError = "CREATE_ROLE_ERROR",

    updateRolePending = "UPDATE_ROLE_PENDING",
    updateRoleSuccess = "UPDATE_ROLE_SUCCESS",
    updateRoleError = "UPDATE_ROLE_ERROR",

    deleteRolePending = "DELETE_ROLE_PENDING",
    deleteRoleSuccess = "DELETE_ROLE_SUCCESS",
    deleteRoleError = "DELETE_ROLE_ERROR",

    getAllPermissionsPending = "GET_ALL_PERMISSIONS_PENDING",
    getAllPermissionsSuccess = "GET_ALL_PERMISSIONS_SUCCESS",
    getAllPermissionsError = "GET_ALL_PERMISSIONS_ERROR",
}

export const getAllRolesPending = createAction<IRoleStateContext>(
    RoleActionEnums.getAllRolesPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const getAllRolesSuccess = createAction<IRoleStateContext, { items: RoleDto[]; totalCount: number }>(
    RoleActionEnums.getAllRolesSuccess,
    ({ items, totalCount }) => ({ isPending: false, isError: false, isSuccess: true, roles: items, totalCount })
);

export const getAllRolesError = createAction<IRoleStateContext>(
    RoleActionEnums.getAllRolesError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const getRoleForEditPending = createAction<IRoleStateContext>(
    RoleActionEnums.getRoleForEditPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const getRoleForEditSuccess = createAction<IRoleStateContext, GetRoleForEditOutput>(
    RoleActionEnums.getRoleForEditSuccess,
    (currentRole: GetRoleForEditOutput) => ({ isPending: false, isError: false, isSuccess: true, currentRole })
);

export const getRoleForEditError = createAction<IRoleStateContext>(
    RoleActionEnums.getRoleForEditError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const createRolePending = createAction<IRoleStateContext>(
    RoleActionEnums.createRolePending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const createRoleSuccess = createAction<IRoleStateContext>(
    RoleActionEnums.createRoleSuccess,
    () => ({ isPending: false, isError: false, isSuccess: true })
);

export const createRoleError = createAction<IRoleStateContext>(
    RoleActionEnums.createRoleError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const updateRolePending = createAction<IRoleStateContext>(
    RoleActionEnums.updateRolePending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const updateRoleSuccess = createAction<IRoleStateContext>(
    RoleActionEnums.updateRoleSuccess,
    () => ({ isPending: false, isError: false, isSuccess: true })
);

export const updateRoleError = createAction<IRoleStateContext>(
    RoleActionEnums.updateRoleError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const deleteRolePending = createAction<IRoleStateContext>(
    RoleActionEnums.deleteRolePending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const deleteRoleSuccess = createAction<IRoleStateContext>(
    RoleActionEnums.deleteRoleSuccess,
    () => ({ isPending: false, isError: false, isSuccess: true })
);

export const deleteRoleError = createAction<IRoleStateContext>(
    RoleActionEnums.deleteRoleError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);


export const getAllPermissionsPending = createAction<IRoleStateContext>(
    RoleActionEnums.getAllPermissionsPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const getAllPermissionsSuccess = createAction<IRoleStateContext, PermissionDto[]>(
    RoleActionEnums.getAllPermissionsSuccess,
    (availablePermissions: PermissionDto[]) => ({ isPending: false, isError: false, isSuccess: false, availablePermissions })
);

export const getAllPermissionsError = createAction<IRoleStateContext>(
    RoleActionEnums.getAllPermissionsError,
    () => ({ isPending: false, isError: true, isSuccess: false })
);
