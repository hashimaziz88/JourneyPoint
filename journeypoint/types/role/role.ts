export type RoleDto = {
    id?: number;
    name?: string | null;
    displayName?: string | null;
    normalizedName?: string | null;
    description?: string | null;
    grantedPermissions?: string[] | null;
    isStatic?: boolean;
};

export type CreateRoleDto = {
    name: string;
    displayName: string;
    normalizedName?: string | null;
    description?: string | null;
    grantedPermissions?: string[] | null;
};

export type PermissionDto = {
    id?: number;
    name?: string | null;
    displayName?: string | null;
    description?: string | null;
};

export type FlatPermissionDto = {
    name?: string | null;
    displayName?: string | null;
    description?: string | null;
};

export type RoleEditDto = {
    id?: number;
    name?: string | null;
    displayName?: string | null;
    description?: string | null;
    isStatic?: boolean;
};

export type GetRoleForEditOutput = {
    role?: RoleEditDto | null;
    permissions?: FlatPermissionDto[] | null;
    grantedPermissionNames?: string[] | null;
};

export type GetAllRolesRequest = {
    keyword?: string | null;
    skipCount: number;
    maxResultCount: number;
};
