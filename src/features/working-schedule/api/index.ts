import { IListResponse } from './../../../lib/api/type';
import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import { IResCommon } from "@/lib/api";
import { BusyTimeSlot, WorkingSchedule, WorkingScheduleDetail, WorkingScheduleResponse } from "../types";


export const workingScheduleApi = createApi({
  reducerPath: "workingScheduleApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getDoctorBusyTimes: builder.query<
    IResCommon<BusyTimeSlot[]>,
      { doctorId: string; clinicId: string; date: string }
    >({
      query: ({ doctorId, clinicId, date }) => ({
        url: `working-schedules/doctors/busy-times`,
        method: "GET",
        params: { doctorId, clinicId, date },
      }),
    }),
    getWorkingSchedule: builder.query<
    IResCommon<IListResponse<WorkingSchedule>>,
          {
            pageIndex?: number;
            pageSize?: number;
            searchTerm?: string;
            sortColumn?: string;
            sortOrder?: string;
          }
        >({
          query: ({
            pageIndex = 1,
            pageSize = 10,
            searchTerm = "",
            sortColumn = "",
            sortOrder = "",
          }) => ({
            url: `/working-schedules/clinics`,
            method: "GET",
            params: {
              pageIndex,
              pageSize,
              searchTerm,
              sortColumn,
              sortOrder,
            },
          }),
        }),
  getWorkingSchedulesByShiftGroup: builder.query<
  IResCommon<IListResponse<WorkingScheduleDetail>>,
      {
        shiftGroupId: string;
        pageNumber?: number;
        pageSize?: number;
        searchTerm?: string;
        sortColumn?: string;
        sortOrder?: string;
      }
    >({
      query: ({
        shiftGroupId,
        pageNumber = 1,
        pageSize = 10,
        searchTerm = "",
        sortColumn = "",
        sortOrder = "",
      }) => ({
        url: `/working-schedules/shift-groups/${shiftGroupId}`,
        method: "GET",
        params: {
          pageNumber,
          pageSize,
          searchTerm,
          sortColumn,
          sortOrder,
        },
      }),
    }),
  }),
});
export const workingScheduleCommandApi = createApi({
  reducerPath: "workingScheduleCommandApi",
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    createClinicSchedules: builder.mutation<
    void,
      {   workingDates: WorkingSchedule[]  }
  >({
    query: ( data ) => ({
      url: `working-schedules/schedules`,
      method: "POST",
      body: data,
      }),
    }),
  }),
});
  // Thêm endpoint để tạo lịch làm việc mới
 
export const {
  useGetDoctorBusyTimesQuery,
  useLazyGetDoctorBusyTimesQuery,
  useGetWorkingScheduleQuery,
  useGetWorkingSchedulesByShiftGroupQuery
} = workingScheduleApi;
export const {
useCreateClinicSchedulesMutation
} = workingScheduleCommandApi;