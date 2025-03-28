import { createApi } from "@reduxjs/toolkit/query/react"
import { reAuthQuery } from "@/lib/api"
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
    
    createOrderPayment: builder.mutation<PaymentResponse, { id: string;
amount: number
paymentMethod: string
}>(
{
  query: ({ id, amount, paymentMethod }) => ({
        url: `payments/order/${id}/${amount}/${paymentMethod}`,
        method: "POST",
      }),
}
),
  }),
})

export const { useCreatePaymentMutation, useCreateOrderPaymentMutation } = paymentsApi

