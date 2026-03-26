import { createContext } from "react";
export type { IUserLoginRequest, IUserLoginResponse, IUserRegisterRequest, ITenantInfo } from "@/types/auth";
import type { IUserLoginRequest, IUserLoginResponse, IUserRegisterRequest, ITenantInfo } from "@/types/auth";

export interface IAuthStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isAuthenticated: boolean;
    user?: IUserLoginResponse | null;
    tenant?: ITenantInfo | null;
}

export interface IAuthActionContext {
    login: (payload: IUserLoginRequest) => Promise<void>;
    register: (payload: IUserRegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    getMe: () => Promise<void>;
    resolveTenant: (tenancyName: string) => Promise<ITenantInfo | null>;
    clearTenant: () => void;
}

export const INITIAL_STATE: IAuthStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    isAuthenticated: false,
    user: null,
    tenant: null,
};

export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActionContext>(undefined!);
