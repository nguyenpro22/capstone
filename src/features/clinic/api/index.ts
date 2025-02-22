import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Clinic } from "@/features/clinic/types";  // Giả sử alias @/types được cấu hình
interface ClinicsResponse {
  value: {
    items: Clinic[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  isSuccess: boolean;
}

interface ClinicDetailResponse {
  value: Clinic;
  isSuccess: boolean;
}
export const clinicsApi = createApi({
  reducerPath: "clinicsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://160.187.240.214:3000/api/v1" }),
  tagTypes: ["Clinic"], // 👈 Định nghĩa tagTypes ở đây
  endpoints: (builder) => ({
    getClinics: builder.query<ClinicsResponse, { pageIndex: number; pageSize: number, searchTerm: string }>({
      query: ({ pageIndex, pageSize, searchTerm }) => `clinics?pageIndex=${pageIndex}&pageSize=${pageSize}&serchTerm=${searchTerm}`,
    }),
    getClinicById: builder.query<ClinicDetailResponse, string>({
      query: (id) => `clinics/${id}`,
    }),
    updateClinic: builder.mutation<Clinic, { clinicId: string; data: FormData }>(
      {
        query: ({ clinicId, data }) => ({
          url: `http://160.187.240.214:4000/api/v1/clinics/${clinicId}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: [{ type: "Clinic", id: "LIST" }], // 👈 Sửa invalidatesTags về đúng kiểu

      }
    ),
    
  }),
});

export const { useGetClinicsQuery,useGetClinicByIdQuery, useUpdateClinicMutation } = clinicsApi;
