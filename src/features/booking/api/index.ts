import { IListResponse, IResCommon, reAuthQuery } from "@/lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AppointmentDetail,
  AvailableTime,
  Booking,
  BookingRequest,
  CustomerSchedule,
} from "../types";
import { OrderItem } from "@/features/order/types";

// API GET chạy trên port 3000
export const bookingQueryApi = createApi({
  reducerPath: "bookingQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getBookings: builder.query<
      IResCommon<IListResponse<Booking>>,
      {
        searchTerm?: string;
        sortColumn?: string;
        sortOrder?: string;
        pageIndex?: number;
        pageSize?: number;
      }
    >({
      query: ({
        searchTerm = "",
        sortColumn = "",
        sortOrder = "",
        pageIndex = 1,
        pageSize = 10,
      }) => ({
        url: `/bookings`,
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
    getAvalableTimes: builder.query<
      IResCommon<AvailableTime[]>,
      {
        doctorId: string;
        serviceIdOrCustomerScheduleId: string;
        clinicId: string;
        date: string;
      }
    >({
      query: ({ doctorId, serviceIdOrCustomerScheduleId, clinicId, date }) => ({
        url: `/working-schedules/doctors/available-times`,
        method: "GET",
        params: {
          doctorId,
          serviceIdOrCustomerScheduleId,
          clinicId,
          isCustomerSchedule: "false",
          date,
        },
      }),
      keepUnusedDataFor: 0,
    }),
    getBookingById: builder.query<IResCommon<Booking>, string>({
      query: (id) => `clinic/${id}?id=${id}`,
    }),
    getBookingByBookingId: builder.query<
      IResCommon<AppointmentDetail>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `bookings/${id}`,
        method: "GET",
      }),
    }),
    // Get total appointments by month-year
    getAppointmentsTotal: builder.query({
      query: (date) => `bookings/appointments/total?Date=${date}`,
    }),

    // Get appointments by specific date
    getAppointmentsByDate: builder.query({
      query: (date) => `bookings/appointments/${date}`,
    }),
    getOrders: builder.query<
      IResCommon<IListResponse<OrderItem>>,
      {
        searchTerm?: string;
        sortColumn?: string;
        sortOrder?: string;
        pageIndex?: number;
        pageSize?: number;
      }
    >({
      query: ({
        searchTerm = "",
        sortColumn = "",
        sortOrder = "",
        pageIndex = 1,
        pageSize = 10,
      }) => ({
        url: `/orders`,
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

// API POST chạy trên port 4000

export const bookingCommandApi = createApi({
  reducerPath: "bookingCommandApi",
  baseQuery: reAuthQuery("command"), // Chạy trên port 4000
  endpoints: (builder) => ({
    createBooking: builder.mutation<IResCommon<string>, BookingRequest>({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
      }),
    }),
    updateBooking: builder.mutation<IResCommon<null>, CustomerSchedule>({
      query: (body) => ({
        url: `/customer-schedules/customer/${body.customerScheduleId}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useGetAvalableTimesQuery,
  useLazyGetAvalableTimesQuery,
  useGetAppointmentsTotalQuery,
  useLazyGetAppointmentsTotalQuery,
  useGetAppointmentsByDateQuery,
  useLazyGetAppointmentsByDateQuery,
  useGetBookingByBookingIdQuery,
  useGetOrdersQuery,
} = bookingQueryApi;

export const { useCreateBookingMutation, useUpdateBookingMutation } =
  bookingCommandApi;
