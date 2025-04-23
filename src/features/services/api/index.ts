import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import { IListResponse, IResCommon } from "@/lib/api";
import { DoctorServiceData, ServiceDetail, ServiceItem } from "../types";

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getAllServices: builder.query<
      IResCommon<IListResponse<ServiceItem>>,
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
        url: `/services`,
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

    getServiceById: builder.query<IResCommon<ServiceDetail>, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "GET",
      }),
    }),

    // getDoctorByServiceId: builder.query<IResCommon<DoctorServiceData>, string>({
    //   query: (id) => ({
    //     url: `/services/${id}/doctors`,
    //     method: "GET",
    //   }),
    // }),
  }),
});

export const doctorServiceApi = createApi({
  reducerPath: "doctorServiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.beautify.asia/query-api/v2",
  }),
  endpoints: (builder) => ({
    getDoctorByServiceId: builder.query<IResCommon<DoctorServiceData>, string>({
      query: (id) => ({
        url: `/services/${id}/doctors`,
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
  // useGetDoctorByServiceIdQuery,
  // useLazyGetDoctorByServiceIdQuery,
} = serviceApi;

export const {
  useGetDoctorByServiceIdQuery,
  useLazyGetDoctorByServiceIdQuery,
} = doctorServiceApi;
