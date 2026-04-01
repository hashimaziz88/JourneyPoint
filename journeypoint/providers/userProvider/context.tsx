import { createContext } from "react";
export type { UserDto, CreateUserDto, GetAllUsersRequest, ResetPasswordDto, RoleListItem } from "@/types/user/user";
import type { UserDto, CreateUserDto, GetAllUsersRequest, ResetPasswordDto, RoleListItem } from "@/types/user/user";

export interface IUserStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    users?: UserDto[] | null;
    currentUser?: UserDto | null;
    totalCount?: number;
    availableRoles?: RoleListItem[] | null;
}

export interface IUserActionContext {
    getAll: (request: GetAllUsersRequest) => Promise<void>;
    get: (id: number) => Promise<void>;
    createUser: (payload: CreateUserDto) => Promise<void>;
    updateUser: (payload: UserDto) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    getRoles: () => Promise<void>;
    resetPassword: (dto: ResetPasswordDto) => Promise<void>;
    resetState: () => void;
}

export const INITIAL_STATE: IUserStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    users: [],
    currentUser: null,
    totalCount: 0,
    availableRoles: [],
};

export const UserStateContext = createContext<IUserStateContext>(INITIAL_STATE);
export const UserActionContext = createContext<IUserActionContext | undefined>(undefined);
