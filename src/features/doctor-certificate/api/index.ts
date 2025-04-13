// import { createApi } from "@reduxjs/toolkit/query/react"
// import { reAuthQuery } from "@/lib/api/reAuthQuery"
// import type { IListResponse, IResCommon } from "@/lib/api"

// // Command API for write operations
// export const doctorCertificateCommandApi = createApi({
//     reducerPath: "customerScheduleCommandApi",
//     baseQuery: reAuthQuery("command"),
//     endpoints: (builder) => ({
//       // Create a new schedule
//       createSchedule: builder.mutation<IResCommon<CustomerSchedule>, FormData>({
//         query: (data) => ({
//           url: "/customer-schedules",
//           method: "POST",
//           body: data,
//         }),
//       }),
  
//       // Update an existing schedule
//       updateSchedule: builder.mutation<IResCommon<CustomerSchedule>, { id: string; data: FormData }>({
//         query: ({ id, data }) => ({
//           url: `/customer-schedules/${id}`,
//           method: "PUT",
//           body: data,
//         }),
//       }),
  
//       // Delete a schedule
//       deleteSchedule: builder.mutation<IResCommon<void>, string>({
//         query: (id) => ({
//           url: `/customer-schedules/${id}`,
//           method: "DELETE",
//         }),
//       }),

//       // Change schedule status (confirm, cancel, etc.)
//       changeScheduleStatus: builder.mutation<IResCommon<CustomerSchedule>, { id: string; status: string }>({
//         query: ({ id, status }) => ({
//           url: `/customer-schedules/${id}/status`,
//           method: "PATCH",
//           body: { status },
//         }),
//       }),
  
//       // Update schedule status directly (using the new endpoint)
//       updateScheduleStatus: builder.mutation<IResCommon<CustomerSchedule>, { scheduleId: string; status: string }>({
//         query: ({ scheduleId, status }) => ({
//           url: `customer-schedules/${scheduleId}/${status}`,
//           method: "PATCH",
//         }),
//       }),

  
  
//       // Update customer schedule (from the image)
//       updateCustomerSchedule: builder.mutation<IResCommon<CustomerSchedule>, UpdateCustomerScheduleRequest>({
//         query: (data) => ({
//           url: `customer-schedules/staff/${data.customerScheduleId}`,
//           method: "PATCH",
//           body: {
//             customerScheduleId: data.customerScheduleId,
//             date: data.date,
//             startTime: data.startTime,
//           },
//         }),
//       }),
      
  
      
//     }),
//   })