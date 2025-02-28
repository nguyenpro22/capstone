import { createApi } from '@reduxjs/toolkit/query/react';
import { Clinic, ClinicDetailResponse, ClinicsResponse, BranchDetailResponse, Branch } from "@/features/clinic/types";
import { reAuthQuery } from '@/lib/api';

export const clinicsQueryApi = createApi({
  reducerPath: "clinicsQueryApi",
  baseQuery: reAuthQuery("query"),  // 👉 Dùng port 3000
  tagTypes: ["Clinic"],
  endpoints: (builder) => ({
    getClinics: builder.query<ClinicsResponse, { pageIndex: number; pageSize: number; searchTerm: string }>({
      query: ({ pageIndex, pageSize, searchTerm }) =>
        `clinics?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
    }),
    getClinicById: builder.query<ClinicDetailResponse, string>({
      query: (id) => `clinics/${id}`,
    }),
    getBranches: builder.query({
      query: ({ pageIndex, pageSize, searchTerm }) => `/clinics/branches?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortOrder=desc`,
    }),
    getBranchById: builder.query<BranchDetailResponse, string>({
      query: (id) => `branches/${id}?id=${id}`,
    }),
  }),
});

export const clinicsCommandApi = createApi({
  reducerPath: "clinicsCommandApi",
  baseQuery: reAuthQuery("command"),  // 👉 Dùng port 4000
  tagTypes: ["Clinic"],
  endpoints: (builder) => ({
    updateClinic: builder.mutation<Clinic, { clinicId: string; data: FormData }>({
      query: ({ clinicId, data }) => ({
        url: `/clinics/${clinicId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Clinic", id: "LIST" }],
    }),
    createBranch: builder.mutation<any, { data: FormData }>({
      query: ({ data }) => ({
        url: "/clinics/create-branch",
        method: "POST",
        body: data, // Truyền trực tiếp FormData
      }),
    }),
    updateBranch: builder.mutation<Branch, { data: FormData }>({
      query: ({ data }) => ({
        url: `/clinics/update-branch`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Clinic", id: "LIST" }],
    }),
    changeStatusBranch: builder.mutation({
      query: ({ branchId }) => ({
        url: `/clinics/update-branch`, // Truyền ID vào URL
        method: "PUT",
        params: { branchId: branchId }, // ID trong parameters
        // body: { packageId, isActivated },
      }),
    }),
  }),
});

export const {
  useGetClinicsQuery,
  useLazyGetClinicByIdQuery,
  useGetBranchesQuery,
  useLazyGetBranchByIdQuery,
} = clinicsQueryApi;

export const {
  useUpdateClinicMutation,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useChangeStatusBranchMutation
} = clinicsCommandApi;
