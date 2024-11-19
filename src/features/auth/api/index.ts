import { createApi } from '@reduxjs/toolkit/query/react';
import { reAuthQuery } from '@/lib/api/reAuthQuery';
import type { AuthResponse, ILoginRequest, IRegisterRequest } from '../types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: reAuthQuery,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, ILoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, IRegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
