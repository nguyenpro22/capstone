import { createApi } from "@reduxjs/toolkit/query/react"
import { reAuthQuery } from "@/lib/api"
import type { DoctorResponse, DoctorServiceResponse, DoctorServiceRequest } from "../types"

// API GET chạy trên port 3000
export const doctorServiceQueryApi = createApi({
  reducerPath: "doctorServiceQueryApi",
  baseQuery: reAuthQuery("query"),
  tagTypes: ["DoctorServices"],
  endpoints: (builder) => ({
    // Lấy danh sách bác sĩ của một dịch vụ
    getDoctorsByServiceId: builder.query<DoctorServiceResponse, string>({
      query: (serviceId) => `/services/${serviceId}/doctors`,
      providesTags: (result, error, serviceId) => [{ type: "DoctorServices", id: serviceId }],
    }),

    // Lấy danh sách bác sĩ có thể thêm vào dịch vụ
    getAvailableDoctors: builder.query<
      DoctorResponse,
      { pageIndex: number; pageSize: number; searchTerm: string; serviceId?: string }
    >({
      query: ({ pageIndex, pageSize, searchTerm, serviceId }) => {
        let url = `/doctors?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`
        if (serviceId) {
          url += `&serviceId=${serviceId}&available=true`
        }
        return url
      },
    }),
  }),
})

// API POST chạy trên port 4000
export const doctorServiceCommandApi = createApi({
  reducerPath: "doctorServiceCommandApi",
  baseQuery: reAuthQuery("command"), // Chạy trên port 4000
  tagTypes: ["DoctorServices"],
  endpoints: (builder) => ({
    // Thêm bác sĩ vào dịch vụ
    addDoctorToService: builder.mutation<any, DoctorServiceRequest>({
      query: (data) => ({
        url: "/doctor-services",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { doctorId }) => doctorId.map((id) => ({ type: "DoctorServices", id })),
    }),

    // Xóa bác sĩ khỏi dịch vụ
   removeDoctorFromService: builder.mutation<any, { doctorServiceIds: string[] }>({
    query: (data) => ({
      url: `/doctor-services`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    }),
    invalidatesTags: (result, error) => [{ type: "DoctorServices", id: "LIST" }],
  }),
  }),
})

export const { useGetDoctorsByServiceIdQuery, useGetAvailableDoctorsQuery, useLazyGetAvailableDoctorsQuery } =
  doctorServiceQueryApi

export const { useAddDoctorToServiceMutation, useRemoveDoctorFromServiceMutation } = doctorServiceCommandApi

