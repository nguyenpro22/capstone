import { createApi } from "@reduxjs/toolkit/query/react"
import { reAuthQuery } from "@/lib/api/reAuthQuery"
import type { IListResponse, IResCommon } from "@/lib/api"
import { AdminDashboardDateTimeResponse, ClinicDashboard, ClinicDashboardDateTimeResponse } from "../types";

// Query API for read operations
export const clinicManagerDashboardQueryApi = createApi({
  reducerPath: "clinicManagerDashboardQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    // Get schedule by ID
    getDashboard: builder.query<IResCommon<ClinicDashboard>, string>({
      query: (id) => ({
        url: `/dashboards/clinics`,
        method: "GET",
      }),
    }),
    // Get dashboard data by datetime range
    getDashboardByDateTime: builder.query<IResCommon<ClinicDashboardDateTimeResponse>, {
        startDate?: string;
        endDate?: string;
        isDisplayWeek?: boolean;
        date?: string;
      }>({
        query: (params) => {
          const queryParams: Record<string, string | boolean> = {};
      
          if (params.date) {
            queryParams.date = params.date;
          } else if (params.startDate && params.endDate && typeof params.isDisplayWeek === 'boolean') {
            queryParams.startDate = params.startDate;
            queryParams.endDate = params.endDate;
            queryParams.isDisplayWeek = params.isDisplayWeek;
          }
      
          return {
            url: `/dashboards/clinics/datetime`,
            method: "GET",
            params: queryParams,
          };
        },
      }),

      getDashboardAdminByDateTime: builder.query<IResCommon<AdminDashboardDateTimeResponse>, {
        startDate?: string;
        endDate?: string;
        isDisplayWeek?: boolean;
        date?: string;
      }>({
        query: (params) => {
          const queryParams: Record<string, string | boolean> = {};
      
          if (params.date) {
            queryParams.date = params.date;
          } else if (params.startDate && params.endDate && typeof params.isDisplayWeek === 'boolean') {
            queryParams.startDate = params.startDate;
            queryParams.endDate = params.endDate;
            queryParams.isDisplayWeek = params.isDisplayWeek;
          }
      
          return {
            url: `/dashboards/systems/datetime`,
            method: "GET",
            params: queryParams,
          };
        },
      }),
      
      

      // Get next schedule availability
      getNextScheduleAvailability: builder.query({
        query: (customerScheduleId) => ({
          url: `/customer-schedules/${customerScheduleId}/next-schedule/availability`,
          method: "GET",
        }),
      }),
  }),
})
// Export hooks for queries
export const {
    useGetDashboardQuery,
    useLazyGetDashboardQuery,
    useGetDashboardByDateTimeQuery,
    useLazyGetDashboardByDateTimeQuery,
    useGetDashboardAdminByDateTimeQuery,
    useLazyGetDashboardAdminByDateTimeQuery,
    useLazyGetNextScheduleAvailabilityQuery,
  } = clinicManagerDashboardQueryApi
  