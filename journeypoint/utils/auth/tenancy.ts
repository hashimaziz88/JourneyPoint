import { AUTH_QUERY_KEYS } from "@/constants/auth/cookies";
import { APP_BASE_URL_PLACEHOLDER } from "@/constants/auth/tenancy";
import { normalizeTenancyName } from "@/utils/auth/auth";

const escapeRegExp = (value: string): string => value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

const resolveTenancyFromSubdomain = (): string | null => {
    if (globalThis.window === undefined) {
        return null;
    }

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
    if (!appBaseUrl?.includes(APP_BASE_URL_PLACEHOLDER)) {
        return null;
    }

    const escapedBaseUrl = escapeRegExp(appBaseUrl).replace(
        escapeRegExp(APP_BASE_URL_PLACEHOLDER),
        "([^./]+)",
    );
    const matcher = new RegExp(`^${escapedBaseUrl}`, "i");
    const match = matcher.exec(globalThis.window.location.origin);

    return normalizeTenancyName(match?.[1] ?? null);
};

export const resolveTenancyNameFromLocation = (): string | null => {
    if (globalThis.window === undefined) {
        return null;
    }

    const url = new URL(globalThis.window.location.href);
    const tenancyNameFromQuery = normalizeTenancyName(
        url.searchParams.get(AUTH_QUERY_KEYS.tenancyName),
    );

    if (tenancyNameFromQuery) {
        return tenancyNameFromQuery;
    }

    return resolveTenancyFromSubdomain();
};

export const resolveActiveTenancyName = (
    fallbackTenancyName?: string | null,
): string | null => resolveTenancyNameFromLocation() ?? normalizeTenancyName(fallbackTenancyName);
