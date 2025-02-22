import { createApi } from '@reduxjs/toolkit/query/react';
import { Clinic, ClinicDetailResponse, ClinicsResponse } from "@/features/clinic/types";
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
  }),
});

export const {
  useGetClinicsQuery,
  useLazyGetClinicByIdQuery,
} = clinicsQueryApi;

export const {
  useUpdateClinicMutation,
} = clinicsCommandApi;
