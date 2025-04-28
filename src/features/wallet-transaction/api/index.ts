import { IListResponse, IResCommon, reAuthQuery } from "@/lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomerWithdrawalRequest, TransactionalRequest } from "../types";

// API GET chạy trên port 3000
export const walletTransactionQueryApi = createApi({
  reducerPath: "walletTransactionQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getWalletTransactions: builder.query<
      IResCommon<IListResponse<TransactionalRequest>>,
      {
        pageIndex?: number;
        pageSize?: number;
        searchTerm?: string;
        sortColumn?: string;
        sortOrder?: string;
      }
    >({
      query: ({
        pageIndex = 1,
        pageSize = 10,
        searchTerm = "",
        sortColumn = "",
        sortOrder = "",
      }) => ({
        url: `/wallet-transactions/admin/all-clinics`,
        method: "GET",
        params: {
          pageIndex,
          pageSize,
          searchTerm,
          sortColumn,
          sortOrder,
        },
      }),
    }),

    getWalletTransactionsForClinic: builder.query<
      IResCommon<IListResponse<TransactionalRequest>>,
      {
        pageIndex?: number;
        pageSize?: number;
        searchTerm?: string;
        sortColumn?: string;
        sortOrder?: string;
      }
    >({
      query: ({
        pageIndex = 1,
        pageSize = 10,
        searchTerm = "",
        sortColumn = "",
        sortOrder = "",
      }) => ({
        url: `/wallet-transactions/sub-clinics`,
        method: "GET",
        params: {
          pageIndex,
          pageSize,
          searchTerm,
          sortColumn,
          sortOrder,
        },
      }),
    }),

    getWalletTransactionsForBranch: builder.query<
      IResCommon<IListResponse<TransactionalRequest>>,
      {
        pageIndex?: number;
        pageSize?: number;
        searchTerm?: string;
        sortColumn?: string;
        sortOrder?: string;
      }
    >({
      query: ({
        pageIndex = 1,
        pageSize = 10,
        searchTerm = "",
        sortColumn = "",
        sortOrder = "",
      }) => ({
        url: `/wallet-transactions/clinic`,
        method: "GET",
        params: {
          pageIndex,
          pageSize,
          searchTerm,
          sortColumn,
          sortOrder,
        },
      }),
    }),
  }),
});

// API POST chạy trên port 4000

export const walletTransactionCommandApi = createApi({
  reducerPath: "walletTransactionCommandApi",
  baseQuery: reAuthQuery("command"), // Chạy trên port 4000
  endpoints: (builder) => ({
    createWalletTransaction: builder.mutation<any, TransactionalRequest>({
      query: (data) => ({
        url: "/wallets/transactional-requests",
        method: "POST",
        body: data,
      }),
    }),
    updateWalletTransaction: builder.mutation<
      any,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/clinicWalletTransactions/${id}`,
        method: "PUT",
        body: data, // Truyền trực tiếp FormData
      }),
    }),
    // Single mutation for both approving and rejecting withdrawal requests
    updateWithdrawalStatus: builder.mutation<
      any,
      {
        withdrawalId: string;
        isApproved: boolean;
        rejectionReason?: string;
        isRefetch?: boolean;
      }
    >({
      query: ({
        withdrawalId,
        isApproved,
        rejectionReason = "",
        isRefetch = false,
      }) => ({
        url: `wallets/withdrawal-requests/${withdrawalId}/system`,
        method: "PATCH",
        body: {
          isApproved,
          rejectionReason: isApproved ? "" : rejectionReason,
          isRefetch,
        },
      }),
    }),

    // Single mutation for both approving and rejecting withdrawal requests
    updateWithdrawalStatusForClinic: builder.mutation<
      any,
      { withdrawalId: string; isApproved: boolean; rejectionReason?: string }
    >({
      query: ({ withdrawalId, isApproved, rejectionReason = "" }) => ({
        url: `wallets/withdrawal-requests/${withdrawalId}`,
        method: "PATCH",
        body: {
          isApproved,
          rejectionReason: isApproved ? "" : rejectionReason,
        },
      }),
    }),

    customerWithdraw: builder.mutation<
      IResCommon<CustomerWithdrawalRequest>,
      {
        amount: number;
        bankId: string;
        accountNumber: string;
        accountName: string;
      }
    >({
      query: ({ amount, bankId, accountNumber, accountName }) => ({
        url: `/wallets/withdrawal-requests/customer-withdrawals`,
        method: "POST",
        body: { amount, bankId, accountNumber, accountName },
      }),
    }),
  }),
});

export const {
  useGetWalletTransactionsQuery,
  useGetWalletTransactionsForClinicQuery,
  useGetWalletTransactionsForBranchQuery,
} = walletTransactionQueryApi;
export const {
  useCreateWalletTransactionMutation,
  useUpdateWalletTransactionMutation,
  useUpdateWithdrawalStatusMutation,
  useUpdateWithdrawalStatusForClinicMutation,
  useCustomerWithdrawMutation,
} = walletTransactionCommandApi;
