import { reAuthQuery } from '@/lib/api';
import { ServiceDetailResponse } from './../types/index';
import { createApi } from '@reduxjs/toolkit/query/react';


// API GET chạy trên port 3000
export const serviceQueryApi = createApi({
  reducerPath: 'serviceQueryApi',
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getServices: builder.query({
      query: ({ pageIndex, pageSize, searchTerm }) => `/services?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortOrder=desc`,
    }),
    getServiceById: builder.query<ServiceDetailResponse, string>({
      query: (id) => `services/${id}?id=${id}`,
    }),
  }),
});

// API POST chạy trên port 4000

export const serviceCommandApi = createApi({
  reducerPath: "serviceCommandApi",
  baseQuery: reAuthQuery("command"), // Chạy trên port 4000
  endpoints: (builder) => ({
    createService: builder.mutation<any, { data: FormData }>({
      query: ({ data }) => ({
        url: "/clinicServices",
        method: "POST",
        body: data, // Truyền trực tiếp FormData
      }),
    }),
    updateService: builder.mutation<any, { documentId: string; data: FormData }>({
      query: ({ documentId, data }) => ({
        url: `/services/${documentId}`,
        method: "PUT",
        body: data, // Truyền trực tiếp FormData
      }),
    }),
    deleteService: builder.mutation<any, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetServicesQuery, useLazyGetServiceByIdQuery } = serviceQueryApi;
export const { useCreateServiceMutation,
              useUpdateServiceMutation, // Thêm API cập nhật gói
              useDeleteServiceMutation,
              } = serviceCommandApi;
