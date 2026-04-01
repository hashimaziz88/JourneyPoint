export type UserLoginRequest = {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient?: boolean;
    tenancyName?: string | null;
};

export type UserRegisterRequest = {
    name: string;
    surname: string;
    userName: string;
    emailAddress: string;
    password: string;
    captchaResponse?: string | null;
    tenancyName?: string | null;
};

export type UserLoginResponse = {
    token?: string | null;
    userId?: number;
    name?: string | null;
    surname?: string | null;
    userName?: string | null;
    emailAddress?: string | null;
    expiresAt?: string | null;
    fullName?: string | null;
    roleNames?: string[];
    primaryRoleName?: string | null;
};

export type TenantInfo = {
    tenantId?: number | null;
    tenancyName?: string | null;
    tenantName?: string | null;
};

export type ApplicationInfo = {
    version?: string | null;
    releaseDate?: string | null;
    features?: Record<string, boolean> | null;
};

export type CurrentLoginInfoUser = {
    id?: number;
    name?: string | null;
    surname?: string | null;
    userName?: string | null;
    emailAddress?: string | null;
    roleNames?: string[];
    primaryRoleName?: string | null;
};

export type CurrentLoginInfoTenant = {
    id?: number;
    tenancyName?: string | null;
    name?: string | null;
};

export type CurrentLoginInformationsResponse = {
    application?: ApplicationInfo | null;
    user?: CurrentLoginInfoUser | null;
    tenant?: CurrentLoginInfoTenant | null;
};

export type AbpUserConfigurationResponse = {
    auth?: {
        grantedPermissions?: Record<string, boolean> | null;
    } | null;
    multiTenancy?: {
        isEnabled?: boolean;
    } | null;
};

export type LoadedConfiguration = {
    grantedPermissions: string[];
    isMultiTenancyEnabled: boolean;
    configurationError: string | null;
};

export type FetchedSessionState = {
    user: UserLoginResponse;
    tenant: TenantInfo | null;
};
