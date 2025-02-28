import { reAuthQuery } from '@/lib/api';
import { BranchDetailResponse } from './../types/index';
import { createApi } from '@reduxjs/toolkit/query/react';


// API GET chạy trên port 3000
export const branchQueryApi = createApi({
  reducerPath: 'branchQueryApi',
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getBranches: builder.query({
      query: ({ pageIndex, pageSize, searchTerm }) => `/branches?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortOrder=desc`,
    }),
    getBranchById: builder.query<BranchDetailResponse, string>({
      query: (id) => `branches/${id}?id=${id}`,
    }),
  }),
});

// API POST chạy trên port 4000

export const branchCommandApi = createApi({
  reducerPath: "branchCommandApi",
  baseQuery: reAuthQuery("command"), // Chạy trên port 4000
  endpoints: (builder) => ({
    createBranch: builder.mutation<any, { data: FormData }>({
      query: ({ data }) => ({
        url: "/clinicBranches",
        method: "POST",
        body: data, // Truyền trực tiếp FormData
      }),
    }),
    updateBranch: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/clinicBranches/${id}`,
        method: "PUT",
        body: data, // Truyền trực tiếp FormData
      }),
    }),
    deleteBranch: builder.mutation<any, { id: string }>({ // Chỉnh lại kiểu tham số
      query: ({ id }) => ({
        url: `clinicBranchs/${id}?id=${id}`, // Không cần truyền id trên query string lần nữa
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
  }),
});

export const { useGetBranchesQuery, useLazyGetBranchByIdQuery } = branchQueryApi;
export const { useCreateBranchMutation,
              useUpdateBranchMutation, // Thêm API cập nhật gói
              useDeleteBranchMutation,
              useAddProcedureMutation, // Hook để gọi API thêm Procedure
              } = branchCommandApi;
