export type UserDto = {
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
};

export type CreateUserDto = {
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    isActive: boolean;
    roleNames?: string[] | null;
    password: string;
};

export type GetAllUsersRequest = {
    keyword?: string | null;
    isActive?: boolean | null;
    skipCount: number;
    maxResultCount: number;
};

export type ResetPasswordDto = {
    userId: number;
    newPassword: string;
};

export type RoleListItem = {
    id?: number;
    name?: string | null;
    displayName?: string | null;
    normalizedName?: string | null;
};
