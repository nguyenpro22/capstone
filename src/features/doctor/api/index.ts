import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import { ErrorResponse, IListResponse, IResCommon } from "@/lib/api";
import {
  Certificate,
  ClinicShiftSchedule,
  DoctorScheduleRequest,
  DoctorWorkingSchedule,
} from "../types";

export const doctorQueryApi = createApi({
  reducerPath: "doctorQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getDoctorSchedules: builder.query<
      IResCommon<IListResponse<DoctorWorkingSchedule>>,
      {
        searchTerm?: string;
        sortColumn?: string;
        sortOrder?: string;
        pageNumber?: number;
        pageSize?: number;
      }
    >({
      query: ({
        searchTerm = "",
        sortColumn = "",
        sortOrder = "",
        pageNumber = 1,
        pageSize = 10,
      }) => ({
        url: `/working-schedules/doctors`,
        method: "GET",
        params: { searchTerm, sortColumn, sortOrder, pageNumber, pageSize },
      }),
    }),
    getDoctorCertificates: builder.query<
      IResCommon<Certificate[]>, // Định nghĩa kiểu trả về
      { doctorId: string } // Định nghĩa tham số cho endpoint
    >({
      query: ({ doctorId }) => ({
        url: `/doctor-certificates/doctors/${doctorId}/certificates`,
        method: "GET", // Đảm bảo là phương thức GET
      }),

      transformErrorResponse: (response: {
        status: number;
        data: ErrorResponse;
      }) => {
        return response;
      },
    }),

    getClinicShiftSchedules: builder.query<
      IResCommon<IListResponse<ClinicShiftSchedule>>,
      {
        clinicId: string;
        searchTerm?: string;
        sortColumn?: string;
        sortOrder?: string;
        pageIndex?: number;
        pageSize?: number;
      }
    >({
      query: ({
        clinicId,
        searchTerm = "",
        sortColumn = "",
        sortOrder = "",
        pageIndex = 1,
        pageSize = 10,
      }) => ({
        url: `/working-schedules/${clinicId}/unregistered`,
        method: "GET",
        params: {
          searchTerm,
          sortColumn,
          sortOrder,
          pageIndex,
          pageSize,
        },
      }),
    }),
  }),
});

export const doctorCommandApi = createApi({
  reducerPath: "doctorCommandApi",
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    addAppointmentNote: builder.mutation<
      IResCommon<null>,
      { customerScheduleId: string; note: string }
    >({
      query: ({ customerScheduleId, note }) => ({
        url: `/customer-schedules/doctor/${customerScheduleId}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      }),
    }),
    registerSchedule: builder.mutation<IResCommon<null>, DoctorScheduleRequest>(
      {
        query: (body) => ({
          url: `/working-schedules/doctor/schedules`,
          method: "POST",
          body,
        }),
        transformErrorResponse: (response: {
          status: number;
          data: ErrorResponse;
        }) => {
          return response;
        },
      }
    ),
    createDoctorCertificate: builder.mutation({
      query: (payload) => ({
        url: 'doctor-certificates',
        method: 'POST',
        body: payload,
      }),
    }),
    updateDoctorCertificate: builder.mutation<IResCommon<null>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/doctor-certificates/${id}`,
        method: "PUT",
        body: formData,
      }),
      transformErrorResponse: (response: {
        status: number
        data: ErrorResponse
      }) => {
        return response
      },
    }),
    deleteDoctorCertificate: builder.mutation({
      query: (id) => ({
        url: `doctor-certificates/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetDoctorSchedulesQuery,
  useGetDoctorCertificatesQuery,
  useLazyGetDoctorCertificatesQuery,
  useGetClinicShiftSchedulesQuery,
} = doctorQueryApi;
export const { useAddAppointmentNoteMutation, useRegisterScheduleMutation,
  useCreateDoctorCertificateMutation,
  useUpdateDoctorCertificateMutation,
  useDeleteDoctorCertificateMutation
 } =
  doctorCommandApi;
