import { IListResponse, IResCommon, reAuthQuery } from "@/lib/api"
import { createApi } from "@reduxjs/toolkit/query/react"
import { Event, EventDetail, CreateEventRequest, UpdateEventRequest, GetEventsParams } from "../types"

// API GET running on port 3000
export const eventQueryApi = createApi({
  reducerPath: "eventQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getEvents: builder.query<IResCommon<IListResponse<Event>>, GetEventsParams>({
      query: ({ startDate, endDate, searchTerm, pageIndex, pageSize, clinicId }) => {
        let url = `events?pageIndex=${pageIndex}&pageSize=${pageSize}`;
        
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        if (searchTerm) url += `&searchTerm=${searchTerm}`;
        if (clinicId) url += `&clinicId=${clinicId}`;
        
        return url;
      },
    }),
    getEventById: builder.query<IResCommon<EventDetail>, string>({
      query: (id) => `events/${id}`,
    }),
  }),
})

// API POST/PUT/DELETE running on port 4000
export const eventCommandApi = createApi({
  reducerPath: "eventCommandApi",
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    createEvent: builder.mutation<IResCommon<Event>, CreateEventRequest>({
      query: (eventData) => {
        const formData = new FormData();
        if (eventData.image) formData.append('image', eventData.image);
        formData.append('name', eventData.name);
        formData.append('description', eventData.description);
        formData.append('startDate', eventData.startDate);
        formData.append('endDate', eventData.endDate);
        formData.append('clinicId', eventData.clinicId);
        
        return {
          url: 'events',
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, it will be set automatically for FormData
        };
      },
    }),
    updateEvent: builder.mutation<IResCommon<Event>, UpdateEventRequest>({
      query: ({ id, ...eventData }) => {
        const formData = new FormData();
        if (eventData.image) formData.append('image', eventData.image);
        formData.append('name', eventData.name);
        formData.append('description', eventData.description);
        formData.append('startDate', eventData.startDate);
        formData.append('endDate', eventData.endDate);
        if (eventData.clinicId) formData.append('clinicId', eventData.clinicId);
        
        return {
          url: `events/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
    }),
    deleteEvent: builder.mutation<IResCommon<void>, string>({
      query: (id) => ({
        url: `events/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const { 
  useGetEventsQuery,
  useGetEventByIdQuery
} = eventQueryApi

export const { 
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation
} = eventCommandApi