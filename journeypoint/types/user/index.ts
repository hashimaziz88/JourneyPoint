export interface IUserDto {
    id?: number;
    userName?: string | null;
    name?: string | null;
    surname?: string | null;
    emailAddress?: string | null;
    isActive?: boolean;
    fullName?: string | null;
    lastLoginTime?: string | null;
    creationTime?: string | null;
    roleNames?: string[] | null;
}

export interface ICreateUserDto {
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    isActive: boolean;
    roleNames?: string[] | null;
    password: string;
}

export interface IGetAllUsersRequest {
    keyword?: string | null;
    isActive?: boolean | null;
    skipCount: number;
    maxResultCount: number;
}

export interface IResetPasswordDto {
    userId: number;
    newPassword: string;
}

export interface IRoleListItem {
    id?: number;
    name?: string | null;
    displayName?: string | null;
    normalizedName?: string | null;
}
