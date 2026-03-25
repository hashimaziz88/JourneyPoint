export interface IRoleDto {
    id?: number;
    name?: string | null;
    displayName?: string | null;
    normalizedName?: string | null;
    description?: string | null;
    grantedPermissions?: string[] | null;
}

export interface ICreateRoleDto {
    name: string;
    displayName: string;
    normalizedName?: string | null;
    description?: string | null;
    grantedPermissions?: string[] | null;
}

export interface IPermissionDto {
    name?: string | null;
    displayName?: string | null;
    description?: string | null;
}

export interface IGetRoleForEditOutput {
    role?: IRoleDto | null;
    permissions?: IPermissionDto[] | null;
    grantedPermissionNames?: string[] | null;
}

export interface IGetAllRolesRequest {
    keyword?: string | null;
    skipCount: number;
    maxResultCount: number;
}
