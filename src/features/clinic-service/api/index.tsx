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
    updateService: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/clinicServices/${id}`,
        method: "PUT",
        body: data, // Truyền trực tiếp FormData
      }),
    }),
    deleteService: builder.mutation<any, { id: string }>({ // Chỉnh lại kiểu tham số
      query: ({ id }) => ({
        url: `clinicServices/${id}?id=${id}`, // Không cần truyền id trên query string lần nữa
        method: "DELETE",
        body: { id }, // Truyền request body đúng định dạng
        headers: {
          "Content-Type": "application/json", // Đảm bảo server hiểu đây là JSON
        },
      }),
    }),
    
    
    addProcedure: builder.mutation<any, { data: FormData }>({
      query: ({ data }) => ({
        url: "/procedures",
        method: "POST",
        body: data, // Truyền trực tiếp FormData
      }),
    }),
    
    deleteProcedure: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/procedures/${id}`,
        method: "DELETE",
        body: { id }, // Truyền id trong request body theo yêu cầu API
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetServicesQuery, useLazyGetServiceByIdQuery } = serviceQueryApi;
export const { useCreateServiceMutation,
              useUpdateServiceMutation, 
              useDeleteServiceMutation,
              useAddProcedureMutation, 
              useDeleteProcedureMutation, 
              } = serviceCommandApi;