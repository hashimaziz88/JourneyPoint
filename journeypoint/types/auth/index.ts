export interface IUserLoginRequest {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient?: boolean;
    tenancyName?: string | null;
}

export interface IUserRegisterRequest {
    name: string;
    surname: string;
    userName: string;
    emailAddress: string;
    password: string;
    captchaResponse?: string | null;
    tenancyName?: string | null;
}

export interface IUserLoginResponse {
    token?: string | null;
    userId?: number;
    name?: string | null;
    surname?: string | null;
    userName?: string | null;
    emailAddress?: string | null;
    expiresAt?: string | null;
    fullName?: string | null;
}

export interface ITenantInfo {
    tenantId?: number | null;
    tenancyName?: string | null;
    tenantName?: string | null;
}

export interface IApplicationInfo {
    version?: string | null;
    releaseDate?: string | null;
    features?: Record<string, boolean> | null;
}

export interface ICurrentLoginInfoUser {
    id?: number;
    name?: string | null;
    surname?: string | null;
    userName?: string | null;
    emailAddress?: string | null;
}

export interface ICurrentLoginInfoTenant {
    id?: number;
    tenancyName?: string | null;
    name?: string | null;
}

export interface ICurrentLoginInformationsResponse {
    application?: IApplicationInfo | null;
    user?: ICurrentLoginInfoUser | null;
    tenant?: ICurrentLoginInfoTenant | null;
}

export interface IAbpUserConfigurationResponse {
    auth?: {
        grantedPermissions?: Record<string, boolean> | null;
    } | null;
    multiTenancy?: {
        isEnabled?: boolean;
    } | null;
}
