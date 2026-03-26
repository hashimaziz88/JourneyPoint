import { createAction } from "redux-actions";
import { IAuthStateContext, ITenantInfo } from "./context";

type AuthStatePatch = Partial<IAuthStateContext>;

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

    refreshSessionPending = "REFRESH_SESSION_PENDING",
    refreshSessionSuccess = "REFRESH_SESSION_SUCCESS",
    refreshSessionError = "REFRESH_SESSION_ERROR",

    resolveTenantPending = "RESOLVE_TENANT_PENDING",
    resolveTenantSuccess = "RESOLVE_TENANT_SUCCESS",
    resolveTenantError = "RESOLVE_TENANT_ERROR",

    clearTenant = "CLEAR_TENANT",
}

export const loginPending = createAction<AuthStatePatch>(
    AuthActionEnums.loginPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const loginSuccess = createAction<AuthStatePatch, AuthStatePatch>(
    AuthActionEnums.loginSuccess,
    (payload: AuthStatePatch) => payload
);

export const loginError = createAction<AuthStatePatch>(
    AuthActionEnums.loginError,
    () => ({ isPending: false, isError: true, user: null, isSuccess: false, isAuthenticated: false })
);


export const registerPending = createAction<AuthStatePatch>(
    AuthActionEnums.registerPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const registerSuccess = createAction<AuthStatePatch, AuthStatePatch>(
    AuthActionEnums.registerSuccess,
    (payload: AuthStatePatch) => payload
);

export const registerError = createAction<AuthStatePatch>(
    AuthActionEnums.registerError,
    () => ({ isPending: false, isError: true, user: null, isSuccess: false, isAuthenticated: false })
);


export const logoutPending = createAction<AuthStatePatch>(
    AuthActionEnums.logoutPending,
    () => ({ isPending: true, isError: false, isSuccess: false })
);

export const logoutError = createAction<AuthStatePatch>(
    AuthActionEnums.logoutError,
    () => ({ isPending: false, isError: true, isSuccess: false, user: null, isAuthenticated: false })
);

export const logoutSuccess = createAction<AuthStatePatch>(
    AuthActionEnums.logoutSuccess,
    () => ({
        isSuccess: false,
        isPending: false,
        isError: false,
        isReady: true,
        isSessionPending: false,
        isTenantPending: false,
        user: null,
        tenant: null,
        grantedPermissions: [],
        isAuthenticated: false,
    })
);

export const getMePending = createAction<AuthStatePatch>(
    AuthActionEnums.getMePending,
    () => ({ isSessionPending: true })
);

export const getMeSuccess = createAction<AuthStatePatch, AuthStatePatch>(
    AuthActionEnums.getMeSuccess,
    (payload: AuthStatePatch) => payload
);

export const getMeError = createAction<AuthStatePatch>(
    AuthActionEnums.getMeError,
    () => ({ isSessionPending: false, user: null, isAuthenticated: false })
);

export const refreshSessionPending = createAction<AuthStatePatch>(
    AuthActionEnums.refreshSessionPending,
    () => ({ isReady: false, isSessionPending: true })
);

export const refreshSessionSuccess = createAction<AuthStatePatch, AuthStatePatch>(
    AuthActionEnums.refreshSessionSuccess,
    (payload: AuthStatePatch) => payload
);

export const refreshSessionError = createAction<AuthStatePatch, AuthStatePatch>(
    AuthActionEnums.refreshSessionError,
    (payload: AuthStatePatch) => payload
);

export const resolveTenantPending = createAction<AuthStatePatch>(
    AuthActionEnums.resolveTenantPending,
    () => ({ isTenantPending: true })
);

export const resolveTenantSuccess = createAction<AuthStatePatch, ITenantInfo>(
    AuthActionEnums.resolveTenantSuccess,
    (tenant: ITenantInfo) => ({ isTenantPending: false, tenant })
);

export const resolveTenantError = createAction<AuthStatePatch>(
    AuthActionEnums.resolveTenantError,
    () => ({ isTenantPending: false, tenant: null })
);

export const clearTenant = createAction<AuthStatePatch>(
    AuthActionEnums.clearTenant,
    () => ({ isTenantPending: false, tenant: null })
);
