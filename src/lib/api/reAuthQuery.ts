import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { BASE_URL, createBaseQuery } from "./query";
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

// Tạo mutex để tránh gửi nhiều request refresh cùng lúc
const mutex = new Mutex();

// Map các port với backend tương ứng
const PORT_TO_SERVICE: Record<string, keyof typeof BASE_URL> = {
  "5000": "auth",
  "4000": "command",
  "3000": "query",
};

// Hàm lấy service từ port của URL
const getServiceFromUrl = (args: string | FetchArgs) => {
  try {
    const urlString = typeof args === "string" ? args : args.url; // Kiểm tra kiểu dữ liệu
    const url = new URL(
      urlString,
      process.env.NEXT_PUBLIC_BEAUTIFY_BACKEND_QUERY_URL
    );
    const port = url.port;
    return PORT_TO_SERVICE[port] || "query"; // Mặc định là query nếu không xác định được
  } catch {
    return "query"; // Tránh lỗi nếu URL không hợp lệ
  }
};

export const reAuthQuery: CustomBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  const service = getServiceFromUrl(args);
  const baseQuery = createBaseQuery(service);

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

      // Luôn dùng backend Auth để refresh token
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
        const { value } = refreshResult.data as AuthResponse;
        setAccessToken(value.accessToken);
        setRefreshToken(value.refreshToken);

        // Retry request ban đầu với đúng backend
        result = await baseQuery(args, api, extraOptions);
      } else {
        showError("Session expired. Please log in again.");
        clearToken();
        return { error: { status: 401, data: "Session expired" } };
      }
    } catch (error) {
      console.log(error);
      showError("An unexpected error occurred during re-authentication.");
      return { error: { status: 500, data: "Re-authentication failed" } };
    } finally {
      release();
    }
  }

  return result;
};
