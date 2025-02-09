import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import type {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IVerifyRequest,
} from "../types";
import { IResCommon } from "@/lib/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: reAuthQuery("auth"),
  endpoints: (builder) => ({
    login: builder.mutation<IResCommon<ILoginResponse>, ILoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<Response, IRegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    verify: builder.mutation<Response, IVerifyRequest>({
      query: (credentials) => ({
        url: "/auth/verify_code",
        method: "POST",
        body: credentials,
      }),
    }),
    sendRequest: builder.mutation<Response, { email: string }>({
      query: (email) => ({
        url: "/auth/forgot_password",
        method: "POST",
        body: email,
      }),
    }),
    changePassword: builder.mutation<
      Response,
      { email: string; password: string }
    >({
      query: (data) => ({
        url: "/auth/change_password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation,
  useChangePasswordMutation,
  useSendRequestMutation,
} = authApi;
