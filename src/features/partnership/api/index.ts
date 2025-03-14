import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API running on port 3000 for fetching requests
export const partnershipRequestApi = createApi({
  reducerPath: 'partnershipRequestApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://160.187.240.214:3000/api/v1' }),
  endpoints: (builder) => ({
    getPartnershipRequests: builder.query({
      query: ({ pageIndex, pageSize, searchTerm }) => `/clinics/application?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
    }),
    updatePartnershipRequest: builder.mutation({
      // Custom fetchBaseQuery for the update request (port 4000)
      query: ({ requestId, action, rejectReason }) => ({
        url: `http://160.187.240.214:4000/api/v1/clinics/application/${requestId}`, // Port 4000
        method: 'PUT',
        body: { requestId, action, rejectReason },
      }),
    }),
  }),
});

export const {
  useGetPartnershipRequestsQuery,
  useUpdatePartnershipRequestMutation,
} = partnershipRequestApi;
