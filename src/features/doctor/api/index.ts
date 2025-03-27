import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import { IListResponse, IResCommon } from "@/lib/api";
import { DoctorWorkingSchedule } from "../types";

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

export const { useGetDoctorSchedulesQuery } = doctorQueryApi;
