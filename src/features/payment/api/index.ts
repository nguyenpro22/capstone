import { createApi } from "@reduxjs/toolkit/query/react"
import { reAuthQuery } from "@/lib/api"
import type { PaymentResponse, CreatePaymentRequest, SubscriptionOverPaymentRequest } from "../types"

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
    
    createOrderPayment: builder.mutation<PaymentResponse, { 
      orderId: string;
      paymentMethod: string;
      isDeductFromCustomerBalance?: boolean;
    }>({
      query: (body) => ({
        url: `payments/order`,
        method: "POST",
        body
      }),
    }),
      createSubscriptionOverPayment: builder.mutation<PaymentResponse, SubscriptionOverPaymentRequest>({
        query: (body) => ({
          url: "payments/subscription/over",
          method: "POST",
          body,
      }),
    }),
  }),
    
})

export const { useCreatePaymentMutation, useCreateOrderPaymentMutation,
            useCreateSubscriptionOverPaymentMutation
              } = paymentsApi

