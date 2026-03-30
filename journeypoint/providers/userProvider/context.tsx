import { createContext } from "react";
export type { IUserDto, ICreateUserDto, IGetAllUsersRequest, IResetPasswordDto, IRoleListItem } from "@/types/user";
import type { IUserDto, ICreateUserDto, IGetAllUsersRequest, IResetPasswordDto, IRoleListItem } from "@/types/user";

export interface IUserStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    users?: IUserDto[] | null;
    currentUser?: IUserDto | null;
    totalCount?: number;
    availableRoles?: IRoleListItem[] | null;
}

export interface IUserActionContext {
    getAll: (request: IGetAllUsersRequest) => Promise<void>;
    get: (id: number) => Promise<void>;
    createUser: (payload: ICreateUserDto) => Promise<void>;
    updateUser: (payload: IUserDto) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    getRoles: () => Promise<void>;
    resetPassword: (dto: IResetPasswordDto) => Promise<void>;
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
