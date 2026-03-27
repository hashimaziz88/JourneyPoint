import { unwrapAbpResponse } from "@/helpers/abp";
import { mapSessionUser, mapTenantInfo } from "@/helpers/auth";
import { getApiErrorMessage } from "@/helpers/errors";
import { extractGrantedPermissions } from "@/helpers/permissions";
import type {
  IAbpUserConfigurationResponse,
  ICurrentLoginInformationsResponse,
  ITenantInfo,
  IUserLoginResponse,
} from "@/types/auth";
import { getAxiosInstance } from "@/utils/axiosInstance";

export interface ILoadedConfiguration {
  grantedPermissions: string[];
  isMultiTenancyEnabled: boolean;
  configurationError: string | null;
}

export interface IFetchedSessionState {
  user: IUserLoginResponse;
  tenant: ITenantInfo | null;
}

const INITIAL_CONFIGURATION: ILoadedConfiguration = {
  grantedPermissions: [],
  isMultiTenancyEnabled: true,
  configurationError: null,
};

/**
 * Loads the current ABP user configuration used for permissions and tenancy.
 */
export const loadAuthConfiguration = async (): Promise<ILoadedConfiguration> => {
  try {
    const response = await getAxiosInstance().get("/AbpUserConfiguration/GetAll");
    const configuration =
      unwrapAbpResponse<IAbpUserConfigurationResponse>(response);

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
): Promise<IFetchedSessionState> => {
  const response = await getAxiosInstance().get(
    "/api/services/app/Session/GetCurrentLoginInformations",
  );
  const session = unwrapAbpResponse<ICurrentLoginInformationsResponse>(response);

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
): Promise<ITenantInfo | null> => {
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
