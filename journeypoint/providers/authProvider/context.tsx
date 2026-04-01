import { createContext } from "react";
export type { UserLoginRequest, UserLoginResponse, UserRegisterRequest, TenantInfo } from "@/types/auth/auth";
import type { UserLoginRequest, UserLoginResponse, UserRegisterRequest, TenantInfo } from "@/types/auth/auth";

export interface IAuthStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isAuthenticated: boolean;
    isReady: boolean;
    isSessionPending: boolean;
    isTenantPending: boolean;
    grantedPermissions: string[];
    isMultiTenancyEnabled: boolean;
    configurationError: string | null;
    user?: UserLoginResponse | null;
    tenant?: TenantInfo | null;
}

export interface IAuthActionContext {
    login: (payload: UserLoginRequest) => Promise<void>;
    register: (payload: UserRegisterRequest) => Promise<"logged-in" | "registered" | "failed">;
    logout: () => Promise<void>;
    getMe: () => Promise<UserLoginResponse | null>;
    refreshSession: () => Promise<void>;
    resolveTenant: (tenancyName: string) => Promise<TenantInfo | null>;
    clearTenant: () => void;
}

export const INITIAL_STATE: IAuthStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    isAuthenticated: false,
    isReady: false,
    isSessionPending: false,
    isTenantPending: false,
    grantedPermissions: [],
    isMultiTenancyEnabled: true,
    configurationError: null,
    user: null,
    tenant: null,
};

export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActionContext | undefined>(undefined);
