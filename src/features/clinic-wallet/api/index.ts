import { reAuthQuery } from '@/lib/api';
import { createApi } from '@reduxjs/toolkit/query/react';
import { withdrawalRequest } from '../types';


// API GET chạy trên port 3000
export const walletWithdrawQueryApi = createApi({
  reducerPath: 'walletWithdrawQueryApi',
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getWalletWithdraws: builder.query({
      query: ({ pageIndex, pageSize, searchTerm }) => `/walletWithdraws?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortOrder=desc`,
    }),
   
  }),
});

// API POST chạy trên port 4000

export const walletWithdrawCommandApi = createApi({
  reducerPath: "walletWithdrawCommandApi",
  baseQuery: reAuthQuery("command"), // Chạy trên port 4000
  endpoints: (builder) => ({
    createWalletWithdraw: builder.mutation<any, withdrawalRequest>({
        query: (data) => ({
          url: "/wallets/withdrawal-requests",
          method: "POST",
          body: data,
        }),
      }),
    updateWalletWithdraw: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/clinicWalletWithdraws/${id}`,
        method: "PUT",
        body: data, // Truyền trực tiếp FormData
      }),
    }),
    

    
    


  }),
});

export const { useGetWalletWithdrawsQuery } = walletWithdrawQueryApi;
export const { useCreateWalletWithdrawMutation,
              useUpdateWalletWithdrawMutation, 
        
              } = walletWithdrawCommandApi;