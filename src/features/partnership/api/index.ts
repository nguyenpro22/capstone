import { IResCommon, reAuthQuery } from "@/lib/api"
import { createApi } from "@reduxjs/toolkit/query/react"
import { ClinicApplication } from "../types"

// API GET running on port 3000
export const partnershipRequestApi = createApi({
  reducerPath: "partnershipRequestApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getPartnershipRequests: builder.query({
      query: ({ pageIndex, pageSize, searchTerm }) =>
        `/clinics/application?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
    }),
    getBranchRequests: builder.query({
      query: ({ pageIndex, pageSize, searchTerm }) =>
        `/clinics/application/clinic?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
    }),
    // New endpoint to get a specific partnership request by ID
    getPartnershipRequestById: builder.query({
      query: (id) => `clinics/application/${id}`,
    }),
    getBranchRequestById: builder.query({
      query: (id) => `clinics/application/${id}/clinic`,
    }),
     // Get schedule by ID
     getApplication: builder.query<IResCommon<ClinicApplication>, string>({
          query: () => ({
            url: `clinics/application/me`,
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

export const { useGetPartnershipRequestsQuery, useGetPartnershipRequestByIdQuery,
  useGetApplicationQuery, useGetBranchRequestsQuery, useGetBranchRequestByIdQuery
 } = partnershipRequestApi

export const { useUpdatePartnershipRequestMutation, useUpdateBranchRequestMutation } = partnershipRequestCommandApi
