import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import { IListResponse, IResCommon } from "@/lib/api";
import { ServiceDetail } from "../types";

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getAllServices: builder.query<
      IResCommon<IListResponse<ServiceDetail>>,
      { pageIndex?: number; pageSize?: number }
    >({
      query: ({ pageIndex = 1, pageSize = 10 }) => ({
        url: `/services?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),

    getServiceById: builder.query<IResCommon<ServiceDetail>, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useLazyGetAllServicesQuery,
  useGetServiceByIdQuery,
  useLazyGetServiceByIdQuery,
} = serviceApi;
