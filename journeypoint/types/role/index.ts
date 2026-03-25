export interface IRoleDto {
    id?: number;
    name?: string | null;
    displayName?: string | null;
    normalizedName?: string | null;
    description?: string | null;
    grantedPermissions?: string[] | null;
    isStatic?: boolean;
}

export interface ICreateRoleDto {
    name: string;
    displayName: string;
    normalizedName?: string | null;
    description?: string | null;
    grantedPermissions?: string[] | null;
}

export interface IPermissionDto {
    id?: number;
    name?: string | null;
    displayName?: string | null;
    description?: string | null;
}

export interface IFlatPermissionDto {
    name?: string | null;
    displayName?: string | null;
    description?: string | null;
}

export interface IRoleEditDto {
    id?: number;
    name?: string | null;
    displayName?: string | null;
    description?: string | null;
    isStatic?: boolean;
}

export interface IGetRoleForEditOutput {
    role?: IRoleEditDto | null;
    permissions?: IFlatPermissionDto[] | null;
    grantedPermissionNames?: string[] | null;
}

export interface IGetAllRolesRequest {
    keyword?: string | null;
    skipCount: number;
    maxResultCount: number;
}
