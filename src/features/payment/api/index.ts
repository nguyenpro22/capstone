import { createApi } from "@reduxjs/toolkit/query/react"
import { reAuthQuery } from '@/lib/api';
import type { PaymentResponse, CreatePaymentRequest } from "../types"

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    createPayment: builder.mutation<PaymentResponse, CreatePaymentRequest>({
      query: (body) => ({
        url: "payments/subscription",
        method: "POST",
        body,
      }),
    }),
  }),
})

export const { useCreatePaymentMutation } = paymentsApi

