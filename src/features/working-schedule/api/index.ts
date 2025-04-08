import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import { IResCommon } from "@/lib/api";
import { BusyTimeSlot } from "../types";


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
  }),
});

export const {
  useGetDoctorBusyTimesQuery,
  useLazyGetDoctorBusyTimesQuery,
} = workingScheduleApi;