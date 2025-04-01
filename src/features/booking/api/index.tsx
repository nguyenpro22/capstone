import { reAuthQuery } from '@/lib/api';
import { createApi } from '@reduxjs/toolkit/query/react';

// API GET endpoints for bookings
export const bookingQueryApi = createApi({
  reducerPath: 'bookingQueryApi',
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    // Get total appointments by month-year
    getAppointmentsTotal: builder.query({
      query: (date) => `bookings/appointments/total?Date=${date}`,
    }),
    
    // Get appointments by specific date
    getAppointmentsByDate: builder.query({
      query: (date) => `bookings/appointments/${date}`,
    }),
  }),
});

// Export hooks for using the API
export const { 
  useGetAppointmentsTotalQuery, 
  useLazyGetAppointmentsTotalQuery,
  useGetAppointmentsByDateQuery,
  useLazyGetAppointmentsByDateQuery
} = bookingQueryApi;