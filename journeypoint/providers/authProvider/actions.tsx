import { createAction } from "redux-actions";
import { IAuthStateContext, IUserLoginResponse, ITenantInfo } from "./context";

export enum AuthActionEnums {
    loginPending = "LOGIN_PENDING",
    loginSuccess = "LOGIN_SUCCESS",
    loginError = "LOGIN_ERROR",

    registerPending = "REGISTER_PENDING",
    registerSuccess = "REGISTER_SUCCESS",
    registerError = "REGISTER_ERROR",

    logoutPending = "LOGOUT_PENDING",
    logoutError = "LOGOUT_ERROR",
    logoutSuccess = "LOGOUT_SUCCESS",

    getMePending = "GET_ME_PENDING",
    getMeSuccess = "GET_ME_SUCCESS",
    getMeError = "GET_ME_ERROR",

    resolveTenantPending = "RESOLVE_TENANT_PENDING",
    resolveTenantSuccess = "RESOLVE_TENANT_SUCCESS",
    resolveTenantError = "RESOLVE_TENANT_ERROR",
}

export const loginPending = createAction<IAuthStateContext>(
    AuthActionEnums.loginPending,
    () => ({ isPending: true, isError: false, isSuccess: false, isAuthenticated: false })
);

export const loginSuccess = createAction<IAuthStateContext, IUserLoginResponse>(
    AuthActionEnums.loginSuccess,
    (user: IUserLoginResponse) => ({ isPending: false, isError: false, isSuccess: true, user, isAuthenticated: true })
);

export const loginError = createAction<IAuthStateContext>(
    AuthActionEnums.loginError,
    () => ({ isPending: false, isError: true, user: null, isSuccess: false, isAuthenticated: false })
);


export const registerPending = createAction<IAuthStateContext>(
    AuthActionEnums.registerPending,
    () => ({ isPending: true, isError: false, isSuccess: false, isAuthenticated: false })
);

export const registerSuccess = createAction<IAuthStateContext, IUserLoginResponse>(
    AuthActionEnums.registerSuccess,
    (user: IUserLoginResponse) => ({ isPending: false, isError: false, isSuccess: true, user, isAuthenticated: true })
);

export const registerError = createAction<IAuthStateContext>(
    AuthActionEnums.registerError,
    () => ({ isPending: false, isError: true, user: null, isSuccess: false, isAuthenticated: false })
);


export const logoutPending = createAction<IAuthStateContext>(
    AuthActionEnums.logoutPending,
    () => ({ isPending: true, isError: false, isSuccess: false, isAuthenticated: false })
);

export const logoutError = createAction<IAuthStateContext>(
    AuthActionEnums.logoutError,
    () => ({ isPending: false, isError: true, isSuccess: false, user: null, isAuthenticated: false })
);

export const logoutSuccess = createAction<IAuthStateContext>(
    AuthActionEnums.logoutSuccess,
    () => ({ isSuccess: false, isPending: false, isError: false, user: null, isAuthenticated: false })
);

export const getMePending = createAction<IAuthStateContext>(
    AuthActionEnums.getMePending,
    () => ({ isPending: true, isError: false, isSuccess: false, isAuthenticated: false })
);

export const getMeSuccess = createAction<IAuthStateContext, IUserLoginResponse>(
    AuthActionEnums.getMeSuccess,
    (user: IUserLoginResponse) => ({ isPending: false, isError: false, isSuccess: true, user, isAuthenticated: true })
);

export const getMeError = createAction<IAuthStateContext>(
    AuthActionEnums.getMeError,
    () => ({ isPending: false, isError: true, isSuccess: false, user: null, isAuthenticated: false })
);

export const resolveTenantPending = createAction<IAuthStateContext>(
    AuthActionEnums.resolveTenantPending,
    () => ({ isPending: true, isError: false, isSuccess: false, isAuthenticated: false })
);

export const resolveTenantSuccess = createAction<IAuthStateContext, ITenantInfo>(
    AuthActionEnums.resolveTenantSuccess,
    (tenant: ITenantInfo) => ({ isPending: false, isError: false, isSuccess: false, isAuthenticated: false, tenant })
);

export const resolveTenantError = createAction<IAuthStateContext>(
    AuthActionEnums.resolveTenantError,
    () => ({ isPending: false, isError: true, isSuccess: false, isAuthenticated: false, tenant: null })
);
