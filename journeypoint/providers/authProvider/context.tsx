import { createContext } from "react";

export interface IUserLoginRequest {
    email?: string | null;
    password?: string | null;
}

export interface IUserRegisterRequest {
    email?: string | null;
    password?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    tenantName?: string | null;
    tenantId?: string | null;
    role?: string | null;
}

export interface IUserLoginResponse {
    token?: string | null;
    userId?: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    roles?: string[] | null;
    tenantId?: string | null;
    expiresAt?: string;
}

export interface IAuthStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isAuthenticated: boolean;
    user?: IUserLoginResponse | null;
}

export interface IAuthActionContext {
    login: (payload: IUserLoginRequest) => Promise<void>;
    register: (payload: IUserRegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    getMe: () => Promise<void>;
}

export const INITIAL_STATE: IAuthStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    isAuthenticated: false,
    user: null,
};

export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);

export const AuthActionContext = createContext<IAuthActionContext>(undefined!);