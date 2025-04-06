import { IListResponse, IResCommon, reAuthQuery } from "@/lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Booking, BookingRequest, CustomerSchedule, TimeSlot } from "../types";

// API GET chạy trên port 3000
export const bookingQueryApi = createApi({
  reducerPath: "bookingQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getBookings: builder.query<
      IResCommon<IListResponse<Booking>>,
      { pageIndex?: number; pageSize?: number; serchTerm?: string }
    >({
      query: ({ pageIndex = 1, pageSize = 10, serchTerm = "" }) =>
        `bookings?pageNumber=1&pageSize=10`,
    }),
    getBusyTimes: builder.query<
      IResCommon<TimeSlot[]>,
      { doctorId: string; clinicId: string; date: string }
    >({
      query: ({ doctorId, clinicId, date }) => ({
        url: `/working-schedules/doctors/busy-times?doctorId=${doctorId}&clinicId=${clinicId}&date=${date}`,
        method: "GET",
      }),
    }),
    getBookingById: builder.query<IResCommon<Booking>, string>({
      query: (id) => `clinic/${id}?id=${id}`,
    }),
  }),
});

// API POST chạy trên port 4000

export const bookingCommandApi = createApi({
  reducerPath: "bookingCommandApi",
  baseQuery: reAuthQuery("command"), // Chạy trên port 4000
  endpoints: (builder) => ({
    createBooking: builder.mutation<any, BookingRequest>({
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
  useGetBusyTimesQuery,
} = bookingQueryApi;

export const { useCreateBookingMutation, useUpdateBookingMutation } =
  bookingCommandApi;
