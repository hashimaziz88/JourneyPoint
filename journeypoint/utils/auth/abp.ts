import type { AxiosResponse } from "axios";

export const unwrapAbpResponse = <T>(response: AxiosResponse): T =>
  (response.data?.result ?? response.data) as T;
