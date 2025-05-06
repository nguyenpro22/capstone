import { IListResponse, IResCommon, reAuthQuery } from "@/lib/api"
import { createApi } from "@reduxjs/toolkit/query/react"
import { LivestreamRoom, LivestreamRoomDetail } from "../types"


// API GET running on port 3000
export const livestreamQueryApi = createApi({
  reducerPath: "livestreamQueryApi",
  baseQuery: reAuthQuery("signaling"),
  endpoints: (builder) => ({
    getLiveStreams: builder.query<IResCommon<IListResponse<LivestreamRoom>>,  {clinicId: string; pageIndex: number; pageSize: number; searchTerm: string }>({
      query: ({ clinicId, pageIndex, pageSize, searchTerm }) =>
        `/LiveStream/Rooms?clinicId=${clinicId}&pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
    }),
    getLiveStreamById: builder.query<IResCommon<LivestreamRoomDetail>, string | { id: string; pageIndex?: number; pageSize?: number; type?: number }>({
      query: (params) => {
        // If params is just a string, it's the ID
        if (typeof params === 'string') {
          return `/LiveStream/Rooms/${params}`;
        }
        
        // Otherwise, it's an object with ID and optional query parameters
        const { id, ...queryParams } = params;
        
        // Build the query string from the parameters
        const queryString = Object.entries(queryParams)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
        
        // Return the endpoint with query parameters if they exist
        return `/LiveStream/Rooms/${id}${queryString ? `?${queryString}` : ''}`;
      },
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

export const { 
   useGetLiveStreamsQuery,
   useGetLiveStreamByIdQuery
 } = livestreamQueryApi

export const { useUpdatePartnershipRequestMutation, useUpdateBranchRequestMutation } = partnershipRequestCommandApi
