import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { baseQuery } from "./query";
import { CustomBaseQuery } from "./type";
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
import { AuthResponse } from "@/features/auth/types";

const mutex = new Mutex();

export const reAuthQuery: CustomBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const release = await mutex.acquire();

    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!refreshToken || !accessToken) {
        clearCookieStorage();
        return { error: { status: 401, data: "No tokens available" } };
      }

      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh_token",
          method: "POST",
          body: { accessToken, refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { value } = refreshResult.data as AuthResponse;
        setAccessToken(value.accessToken);
        setRefreshToken(value.refreshToken);

        // Retry original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Handle refresh token failure
        if (refreshResult.error?.status === 500) {
          showError("Session expired. Please log in again.");
          clearToken();
          return { error: { status: 401, data: "Session expired" } };
        }
        result = refreshResult;
      }
    } catch (error) {
      // Add a catch block for mutex or unexpected issues
      console.log(error);
      showError("An unexpected error occurred during re-authentication.");
      return { error: { status: 500, data: "Re-authentication failed" } };
    } finally {
      release();
    }
  }

  // Handle other error cases
  if (result.error) {
    switch (result.error.status) {
      case 401:
        showError("Unauthorized access. Redirecting to login.");
        clearToken();
        break;
      case 403:
        showError("Access forbidden.");
        break;
      default:
        showError("An unexpected error occurred.");
        break;
    }
  }

  return result;
};
