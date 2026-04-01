import { AUTH_COOKIE_NAMES } from "@/constants/auth/cookies";
import { getCookie, removeCookie, setCookie } from "@/utils/cookies";
import type {
    ApplicationInfo,
    CurrentLoginInfoUser,
    CurrentLoginInfoTenant,
    TenantInfo,
    UserLoginResponse,
} from "@/types/auth/auth";

export const mapSessionUser = (
    token: string,
    user: CurrentLoginInfoUser | null | undefined,
    userId?: number,
    expireInSeconds?: number,
): UserLoginResponse => {
    const expiresAt =
        typeof expireInSeconds === "number"
            ? new Date(Date.now() + expireInSeconds * 1000).toISOString()
            : null;

    return {
        token,
        userId: user?.id ?? userId,
        name: user?.name ?? null,
        surname: user?.surname ?? null,
        userName: user?.userName ?? null,
        emailAddress: user?.emailAddress ?? null,
        expiresAt,
        fullName: [user?.name, user?.surname].filter(Boolean).join(" ") || user?.userName || null,
        roleNames: user?.roleNames ?? [],
        primaryRoleName: user?.primaryRoleName ?? user?.roleNames?.[0] ?? null,
    };
};

export const normalizeTenancyName = (value?: string | null): string | null => {
    const normalizedValue = value?.trim();
    return normalizedValue || null;
};

export const mapTenantInfo = (
    tenant?: CurrentLoginInfoTenant | TenantInfo | null,
    fallbackTenancyName?: string | null,
): TenantInfo | null => {
    if (!tenant && !fallbackTenancyName) {
        return null;
    }

    return {
        tenantId:
            tenant && "id" in tenant
                ? tenant.id ?? null
                : tenant && "tenantId" in tenant
                    ? tenant.tenantId ?? null
                    : null,
        tenancyName: tenant?.tenancyName ?? fallbackTenancyName ?? null,
        tenantName:
            tenant && "name" in tenant
                ? tenant.name ?? fallbackTenancyName ?? null
                : tenant && "tenantName" in tenant
                    ? tenant.tenantName ?? fallbackTenancyName ?? null
                    : fallbackTenancyName ?? null,
    };
};

export const mapApplicationInfo = (application?: ApplicationInfo | null): ApplicationInfo | null => {
    if (!application) {
        return null;
    }

    return {
        version: application.version ?? null,
        releaseDate: application.releaseDate ?? null,
        features: application.features ?? null,
    };
};

export const persistTenantCookies = (tenant: TenantInfo | null): void => {
    if (!tenant?.tenantId) {
        clearTenantCookies();
        return;
    }

    setCookie(AUTH_COOKIE_NAMES.tenantId, String(tenant.tenantId));
    setCookie(AUTH_COOKIE_NAMES.tenancyName, tenant.tenancyName ?? "");
    setCookie(AUTH_COOKIE_NAMES.tenantName, tenant.tenantName ?? tenant.tenancyName ?? "");
};

export const clearTenantCookies = (): void => {
    removeCookie(AUTH_COOKIE_NAMES.tenantId);
    removeCookie(AUTH_COOKIE_NAMES.tenancyName);
    removeCookie(AUTH_COOKIE_NAMES.tenantName);
};

export const readTenantFromCookies = (): TenantInfo | null => {
    const tenantId = getCookie(AUTH_COOKIE_NAMES.tenantId);
    const tenancyName = getCookie(AUTH_COOKIE_NAMES.tenancyName);
    const tenantName = getCookie(AUTH_COOKIE_NAMES.tenantName);

    if (!tenantId && !tenancyName && !tenantName) {
        return null;
    }

    return {
        tenantId: tenantId ? Number(tenantId) : null,
        tenancyName: tenancyName ?? null,
        tenantName: tenantName ?? null,
    };
};
