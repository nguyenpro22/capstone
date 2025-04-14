import { createApi } from "@reduxjs/toolkit/query/react";
import { IResCommon, reAuthQuery } from "@/lib/api";
import { Transaction } from "../types";

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    topUp: builder.mutation<IResCommon<Transaction>, { amount: number }>({
      query: (body) => ({
        url: "/payments/wallets/top-ups",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useTopUpMutation } = walletApi;
