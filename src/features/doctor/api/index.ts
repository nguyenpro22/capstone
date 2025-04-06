import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import { IListResponse, IResCommon } from "@/lib/api";
import { DoctorSchedule, DoctorWorkingSchedule } from "../types";
import { register } from "module";

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
        method: "POST",
        body: note.toString(),
      }),
    }),
  }),
});

export const { useGetDoctorSchedulesQuery } = doctorQueryApi;
export const { useAddAppointmentNoteMutation } = doctorCommandApi;
