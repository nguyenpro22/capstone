import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import type { IListResponse, IResCommon } from "@/lib/api";
import type {
  ApproveCustomerScheduleRequest,
  BusyTime,
  CustomerSchedule,
  UpdateCustomerScheduleRequest,
} from "../types";

// Query API for read operations
export const customerScheduleQueryApi = createApi({
  reducerPath: "customerScheduleQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    // Get customer schedules by customer name and phone
    getCustomerSchedules: builder.query<
      IResCommon<IListResponse<CustomerSchedule>>,
      {
        customerName: string
        customerPhone: string
        pageIndex?: number
        pageSize?: number
        searchTerm?: string
      }
    >({
      query: ({ customerName= "", customerPhone = "", pageIndex = 1, pageSize = 8, searchTerm = "" }) => ({
        url: `/customer-schedules/customer/${encodeURIComponent(customerName)}`,
        method: "GET",
        params: {
          customerPhone: customerPhone,
          pageIndex: pageIndex,
          pageSize: pageSize,
          searchTerm: searchTerm,
        },
      }),
      keepUnusedDataFor: 0,
    }),

    // Get clinic schedules with pagination and filtering
    getClinicSchedules: builder.query<
      IResCommon<IListResponse<CustomerSchedule>>,
      {
        pageIndex?: number;
        pageSize?: number;
        searchTerm?: string;
        sortColumn?: string;
        sortOrder?: string;
        status?: string;
      }
    >({
      query: ({
        pageIndex = 1,
        pageSize = 10,
        searchTerm = "",
        sortColumn = "",
        sortOrder = "",
      }) => ({
        url: `customer-schedules/clinic`,
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

    // Get schedule by ID
    getScheduleById: builder.query<IResCommon<CustomerSchedule>, { id: string; isNextSchedule?: boolean }>({
      query: (params) => {
        const { id, isNextSchedule = false } = params
        return {
          url: `customer-schedules/${id}`,
          method: "GET",
          params: { isNextSchedule },
        }
      },
      keepUnusedDataFor: 0,
    }),

    // Get next schedule availability
    getNextScheduleAvailability: builder.query({
      query: (customerScheduleId) => ({
        url: `/customer-schedules/${customerScheduleId}/next-schedule/availability`,
        method: "GET",
      }),
    }),
    getBusyTimes: builder.query<
      IResCommon<BusyTime[]>,
      {
        customerId: string;
        date: string;
      }
    >({
      query: ({ customerId, date }) => ({
        url: `/customer-schedules/${customerId}/busy-time/${date}`,
        method: "GET",
      }),
    }),
  }),
});

// Command API for write operations
export const customerScheduleCommandApi = createApi({
  reducerPath: "customerScheduleCommandApi",
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    // Create a new schedule
    createSchedule: builder.mutation<IResCommon<CustomerSchedule>, FormData>({
      query: (data) => ({
        url: "/customer-schedules",
        method: "POST",
        body: data,
      }),
    }),

    // Update an existing schedule
    updateSchedule: builder.mutation<
      IResCommon<CustomerSchedule>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/customer-schedules/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Delete a schedule
    deleteSchedule: builder.mutation<IResCommon<void>, string>({
      query: (id) => ({
        url: `/customer-schedules/${id}`,
        method: "DELETE",
      }),
    }),

    // Change schedule status (confirm, cancel, etc.)
    changeScheduleStatus: builder.mutation<
      IResCommon<CustomerSchedule>,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/customer-schedules/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),

    // Update schedule status directly (using the new endpoint)
    updateScheduleStatus: builder.mutation<
      IResCommon<CustomerSchedule>,
      { scheduleId: string; status: string }
    >({
      query: ({ scheduleId, status }) => ({
        url: `customer-schedules/${scheduleId}/${status}`,
        method: "PATCH",
      }),
    }),

    // Check-in a customer for their appointment
    checkInCustomer: builder.mutation<IResCommon<CustomerSchedule>, string>({
      query: (id) => ({
        url: `customer-schedules/${id}/check-in`,
        method: "POST",
      }),
    }),

    // Generate schedules for remaining steps
    generateSchedules: builder.mutation<IResCommon<CustomerSchedule[]>, string>(
      {
        query: (customerScheduleId) => ({
          url: `customer-schedules/generate/${customerScheduleId}`,
          method: "POST",
        }),
      }
    ),

    // Update customer schedule (from the image)
    updateCustomerSchedule: builder.mutation<
      IResCommon<CustomerSchedule>,
      UpdateCustomerScheduleRequest
    >({
      query: (data) => ({
        url: `customer-schedules/staff/${data.customerScheduleId}`,
        method: "PATCH",
        body: {
          customerScheduleId: data.customerScheduleId,
          date: data.date,
          startTime: data.startTime,
          isNext: data.isNext,
        },
      }),
    }),
    approveSchedule: builder.mutation<
      IResCommon<CustomerSchedule>,
      ApproveCustomerScheduleRequest
    >({
      query: (data) => ({
        url: `/customer-schedules/staff/approve/${data.customerScheduleId}`,
        method: "PATCH",
        body: {
          customerScheduleId: data.customerScheduleId,
          status: data.status,
        },
      }),
    }),
  }),
});

// Export hooks for queries
export const {
  useGetCustomerSchedulesQuery,
  useLazyGetCustomerSchedulesQuery,
  useGetClinicSchedulesQuery,
  useLazyGetClinicSchedulesQuery,
  useGetScheduleByIdQuery,
  useLazyGetScheduleByIdQuery,
  useLazyGetNextScheduleAvailabilityQuery,
  useLazyGetBusyTimesQuery,
  useGetBusyTimesQuery,
} = customerScheduleQueryApi;

// Export hooks for commands
export const {
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useChangeScheduleStatusMutation,
  useUpdateScheduleStatusMutation,
  useCheckInCustomerMutation,
  useGenerateSchedulesMutation,
  useUpdateCustomerScheduleMutation, // Export the new hook
  useApproveScheduleMutation,
} = customerScheduleCommandApi;
