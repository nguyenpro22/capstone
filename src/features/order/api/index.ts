import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import { IListResponse, IResCommon } from "@/lib/api";
import { OrderItem } from "../types";


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

    getOrderById: builder.query<IResCommon<OrderItem>, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
} = orderQueryApi;
