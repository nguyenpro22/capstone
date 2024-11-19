import { getAccessToken } from "@/utils";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const BASE_URL = process.env["NEXT_PUBLIC_API_URL"];

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
