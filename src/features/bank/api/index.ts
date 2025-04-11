import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Bank } from "../types"

interface BankListResponse {
  code: string
  desc: string
  data: Bank[]
}

export const bankApi = createApi({
  reducerPath: "bankApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.vietqr.io/v2" }),
  endpoints: (builder) => ({
    getBanks: builder.query<BankListResponse, void>({
      query: () => "/banks",
    }),
    getBankByBin: builder.query<Bank, string>({
      query: (bin) => `/banks/${bin}`,
      transformResponse: (response: { data: Bank }) => response.data,
    }),
  }),
})

export const { useGetBanksQuery, useGetBankByBinQuery } = bankApi
