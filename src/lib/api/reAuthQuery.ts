import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createBaseQuery, getBaseUrl, type ServiceType } from "./query";
import {
  clearCookieStorage,
  clearToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  showError,
} from "@/utils";
import { Mutex } from "async-mutex";
import { IResCommon } from "./type";
import { ILoginResponse } from "@/features/auth/types";
import { openAuthExpiryDialog } from "../authDialogService";

const mutex = new Mutex();

export const reAuthQuery = (
  defaultService: ServiceType
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  return async (args, api, extraOptions) => {
    const service =
      typeof args === "object" && "service" in args
        ? (args.service as ServiceType)
        : defaultService;
    const baseQuery = createBaseQuery(service);

    // Remove 'service' from args if it exists
    if (typeof args === "object" && "service" in args) {
      const { service: _, ...restArgs } = args;
      args = restArgs;
    }

    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      const release = await mutex.acquire();

      try {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        if (!refreshToken || !accessToken) {
          clearCookieStorage();
          // Hiển thị dialog phiên đăng nhập hết hạn
          openAuthExpiryDialog();
          return { error: { status: 401, data: "No tokens available" } };
        }

        const authBaseQuery = createBaseQuery("auth");
        const refreshResult = await authBaseQuery(
          {
            url: "/auth/refresh_token",
            method: "POST",
            body: { accessToken, refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { value } = refreshResult.data as IResCommon<ILoginResponse>;
          setAccessToken(value.accessToken);
          setRefreshToken(value.refreshToken);

          result = await baseQuery(args, api, extraOptions);
        } else {
          // Hiển thị dialog phiên đăng nhập hết hạn thay vì chỉ show error
          clearToken();
          openAuthExpiryDialog();
          return { error: { status: 401, data: "Session expired" } };
        }
      } catch (error) {
        console.error(error);
        // Hiển thị dialog phiên đăng nhập hết hạn trong trường hợp lỗi
        clearToken();
        openAuthExpiryDialog();
        return { error: { status: 500, data: "Re-authentication failed" } };
      } finally {
        release();
      }
    }

    return result;
  };
};
