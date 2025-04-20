import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import { ErrorResponse, IListResponse, IResCommon } from "@/lib/api";
import {
  CreateFeedbackPayload,
  OrderItem,
  ScheduleDetail,
  ServiceBooking,
} from "../types";

export const orderQueryApi = createApi({
  reducerPath: "orderQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getOrders: builder.query<
      IResCommon<IListResponse<OrderItem>>,
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
        url: `/orders/clinic`,
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
    getScheduleDetail: builder.query<IResCommon<ScheduleDetail>, string>({
      query: (orderId) => `orders/${orderId}`,
    }),
    getOrderDetailById: builder.query<IResCommon<ServiceBooking[]>, string>({
      query: (id) => ({
        url: `/order-details/${id}`,
        method: "GET",
      }),
      transformErrorResponse: (response: {
        status: number;
        data: ErrorResponse;
      }) => {
        return response;
      },
    }),

    getOrdersForClinicAdmin: builder.query<
      IResCommon<IListResponse<OrderItem>>,
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
        url: `/orders/clinic/branches`,
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
  }),
});

export const orderCommandApi = createApi({
  reducerPath: "orderCommandApi",
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    createFeedbacks: builder.mutation<IResCommon<Response>, FormData>({
      query: (body) => ({
        url: "feedbacks",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrdersForClinicAdminQuery,
  useLazyGetOrdersForClinicAdminQuery,
  useLazyGetOrdersQuery,
  useGetOrderDetailByIdQuery,
  useLazyGetOrderDetailByIdQuery,
  useLazyGetScheduleDetailQuery,
  useGetScheduleDetailQuery,
} = orderQueryApi;

export const { useCreateFeedbacksMutation } = orderCommandApi;
