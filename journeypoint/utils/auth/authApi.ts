import { unwrapAbpResponse } from "@/utils/auth/abp";
import { mapSessionUser, mapTenantInfo } from "@/utils/auth/auth";
import { getApiErrorMessage } from "@/utils/auth/errors";
import { extractGrantedPermissions } from "@/utils/auth/permissions";
import type {
    AbpUserConfigurationResponse,
    CurrentLoginInformationsResponse,
    FetchedSessionState,
    LoadedConfiguration,
    TenantInfo,
} from "@/types/auth/auth";
import { getAxiosInstance } from "@/utils/axiosInstance";

const INITIAL_CONFIGURATION: LoadedConfiguration = {
    grantedPermissions: [],
    isMultiTenancyEnabled: true,
    configurationError: null,
};

/**
 * Loads the current ABP user configuration used for permissions and tenancy.
 */
export const loadAuthConfiguration = async (): Promise<LoadedConfiguration> => {
    try {
        const response = await getAxiosInstance().get("/AbpUserConfiguration/GetAll");
        const configuration =
            unwrapAbpResponse<AbpUserConfigurationResponse>(response);

        return {
            grantedPermissions: extractGrantedPermissions(
                configuration?.auth?.grantedPermissions,
            ),
            isMultiTenancyEnabled: Boolean(configuration?.multiTenancy?.isEnabled),
            configurationError: null,
        };
    } catch (error) {
        return {
            ...INITIAL_CONFIGURATION,
            configurationError: getApiErrorMessage(
                error,
                "We could not load the user configuration.",
            ),
        };
    }
};

/**
 * Loads the current logged-in user and tenant context from the ABP session API.
 */
export const fetchCurrentLoginState = async (
    token: string,
    userId?: number,
    expireInSeconds?: number,
): Promise<FetchedSessionState> => {
    const response = await getAxiosInstance().get(
        "/api/services/app/Session/GetCurrentLoginInformations",
    );
    const session = unwrapAbpResponse<CurrentLoginInformationsResponse>(response);

    return {
        user: mapSessionUser(token, session?.user, userId, expireInSeconds),
        tenant: mapTenantInfo(session?.tenant),
    };
};

/**
 * Checks whether a tenancy name is available and maps the response into repo types.
 */
export const resolveTenantAvailability = async (
    tenancyName: string,
): Promise<TenantInfo | null> => {
    const response = await getAxiosInstance().post(
        "/api/services/app/Account/IsTenantAvailable",
        { tenancyName },
    );
    const data = response.data?.result ?? response.data;

    if (data?.state !== 1) {
        return null;
    }

    return {
        tenantId: data.tenantId ?? null,
        tenancyName,
        tenantName: tenancyName,
    };
};
