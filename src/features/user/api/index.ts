import { IResCommon, reAuthQuery } from "@/lib/api"
import { createApi } from "@reduxjs/toolkit/query/react"


// API GET running on port 3000
export const userQueryApi = createApi({
  reducerPath: "userQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({

     // Get schedule by ID
     getUserBalance: builder.query<IResCommon<string>, string>({
          query: (userId) => ({
            url: `users/${userId}/balance`,
            method: "GET",
          }),
     }),
  }),
})

// API POST/PUT/DELETE running on port 4000
export const partnershipRequestCommandApi = createApi({
  reducerPath: "partnershipRequestCommandApi",
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    updatePartnershipRequest: builder.mutation({
      query: ({ requestId, action, rejectReason }) => ({
        url: `/clinics/${requestId}/response`,
        method: "PUT",
        body: { requestId, action, rejectReason },
      }),
    }),
    updateBranchRequest: builder.mutation({
      query: ({ requestId, action, rejectReason }) => ({
        url: `/clinics/${requestId}/response/branch`,
        method: "PUT",
        body: { requestId, action, rejectReason },
      }),
    }),
  }),
})

export const {useGetUserBalanceQuery
 } = userQueryApi

export const { useUpdatePartnershipRequestMutation, useUpdateBranchRequestMutation } = partnershipRequestCommandApi
