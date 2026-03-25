export interface IUserLoginRequest {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient?: boolean;
}

export interface IUserRegisterRequest {
    name: string;
    surname: string;
    userName: string;
    emailAddress: string;
    password: string;
    captchaResponse?: string | null;
}

export interface IUserLoginResponse {
    token?: string | null;
    userId?: number;
    name?: string | null;
    surname?: string | null;
    userName?: string | null;
    emailAddress?: string | null;
    expiresAt?: string | null;
}

export interface ITenantInfo {
    tenantId?: number | null;
    tenancyName?: string | null;
    tenantName?: string | null;
}
