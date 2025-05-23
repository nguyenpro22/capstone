import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import type {
  IChangePasswordStaffRequest,
  ILoginRequest,
  ILoginResponse,
  IRefreshToken,
  IRefreshTokenRequest,
  IRegisterRequest,
  IVerifyRequest,
} from "../types";
import { IResCommon, ValidationErrorResponse } from "@/lib/api";

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
      transformErrorResponse: (response: {
        status: number;
        data: ValidationErrorResponse;
      }) => {
        return response.data;
      },
    }),

    loginStaff: builder.mutation<IResCommon<ILoginResponse>, ILoginRequest>({
      query: (credentials) => ({
        url: "/auth/login/staff",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response: {
        status: number;
        data: ValidationErrorResponse;
      }) => {
        return response.data;
      },
    }),

    refreshToken: builder.mutation<
      IResCommon<IRefreshToken>,
      IRefreshTokenRequest
    >({
      query: (credentials) => ({
        url: "/auth/refresh_token",
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
    verify: builder.mutation<IResCommon<ILoginResponse>, IVerifyRequest>({
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
    changePassword: builder.mutation<Response, { newPassword: string }>({
      query: (data) => ({
        url: "/auth/change_password",
        method: "POST",
        body: data,
      }),
    }),
    changePasswordStaff: builder.mutation<
      Response,
      IChangePasswordStaffRequest
    >({
      query: (data) => ({
        url: "/auth/change_password/staff",
        method: "POST",
        body: data,
      }),
    }),
    loginWithGoogle: builder.mutation<
      IResCommon<ILoginResponse>,
      { googleToken: string }
    >({
      query: ({ googleToken }) => ({
        url: "/auth/login_google",
        method: "POST",
        body: { googleToken },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginStaffMutation,
  useRegisterMutation,
  useVerifyMutation,
  useChangePasswordMutation,
  useChangePasswordStaffMutation,
  useSendRequestMutation,
  useLoginWithGoogleMutation,
  useRefreshTokenMutation,
} = authApi;
