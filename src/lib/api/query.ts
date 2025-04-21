import { getAccessToken } from "@/utils";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const BASE_URL = {
  auth: process.env.NEXT_PUBLIC_BEAUTIFY_BACKEND_AUTH_URL || "",
  command: process.env.NEXT_PUBLIC_BEAUTIFY_BACKEND_COMMAND_URL || "",
  query: process.env.NEXT_PUBLIC_BEAUTIFY_BACKEND_QUERY_URL || "",
  signaling: process.env.NEXT_PUBLIC_BEAUTIFY_BACKEND_SIGNALING_URL || "",
  livestream: process.env.NEXT_PUBLIC_BEAUTIFY_BACKEND_LIVESTREAM_URL || "",
};
export type ServiceType = keyof typeof BASE_URL;

// Hàm chọn baseUrl, mặc định là API `query`
export const getBaseUrl = (service: keyof typeof BASE_URL) => {
  return BASE_URL[service] || BASE_URL.query;
};

export const createBaseQuery = (service: keyof typeof BASE_URL) =>
  fetchBaseQuery({
    baseUrl: getBaseUrl(service),
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });
