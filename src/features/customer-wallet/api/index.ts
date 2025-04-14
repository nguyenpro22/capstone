import { createApi } from "@reduxjs/toolkit/query/react";
import { IListResponse, IResCommon, reAuthQuery } from "@/lib/api";
import { Transaction, WalletTransaction } from "../types";

export const walletCommandApi = createApi({
  reducerPath: "walletCommandApi",
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

export const walletQueryApi = createApi({
  reducerPath: "walletQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getCustomerTransactions: builder.query<
      IResCommon<IListResponse<WalletTransaction>>,
      {
        searchTerm?: string;
        sortColumn?: string;
        sortOrder?: "asc" | "desc";
        transactionType?: string;
        status?: "complete" | "pending" | "failed";
        startDate?: string;
        endDate?: string;
        pageIndex?: number;
        pageSize?: number;
      }
    >({
      query: ({
        searchTerm = "",
        sortColumn = "",
        sortOrder = "",
        transactionType = "",
        status = "",
        startDate = "",
        endDate = "",
        pageIndex = 1,
        pageSize = 10,
      }) => {
        return {
          url: "/wallet-transactions/customer",
          params: {
            searchTerm,
            sortColumn,
            sortOrder,
            transactionType,
            status,
            startDate,
            endDate,
            pageIndex,
            pageSize,
          },
        };
      },
    }),
  }),
});

export const { useGetCustomerTransactionsQuery } = walletQueryApi;
export const { useTopUpMutation } = walletCommandApi;
