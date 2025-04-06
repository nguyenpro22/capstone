import { reAuthQuery } from "@/lib/api"
import { createApi } from "@reduxjs/toolkit/query/react"

// API GET running on port 3000
export const partnershipRequestApi = createApi({
  reducerPath: "partnershipRequestApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getPartnershipRequests: builder.query({
      query: ({ pageIndex, pageSize, searchTerm }) =>
        `/clinics/application?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
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
  }),
})

export const { useGetPartnershipRequestsQuery } = partnershipRequestApi

export const { useUpdatePartnershipRequestMutation } = partnershipRequestCommandApi

