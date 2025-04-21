import { IListResponse, IResCommon, reAuthQuery } from "@/lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Shift, ShiftPayLoad, ShiftUpdate } from "../types";

export const configsQueryApi = createApi({
  reducerPath: "configsQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getAllShifts: builder.query<
      IResCommon<IListResponse<Shift>>,
      { pageIndex: number; pageSize: number }
    >({
      query: ({ pageIndex = 1, pageSize = 10 }) => ({
        url: `/shiftConfigs`,
        method: "GET",
        params: {
          pageIndex,
          pageSize,
        },
      }),
    }),
  }),
});

export const configsCommandApi = createApi({
  reducerPath: "configsCommandApi",
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    createShift: builder.mutation<IResCommon<string>, ShiftPayLoad>({
      query: (body) => ({
        url: "/shiftConfigs",
        method: "POST",
        body,
      }),
    }),
    updateShift: builder.mutation<IResCommon<string>, ShiftUpdate>({
      query: (body) => ({
        url: "/shiftConfigs",
        method: "PUT",
        body,
      }),
    }),
    deleteShift: builder.mutation<IResCommon<string>, { id: string }>({
      query: ({ id }) => ({
        url: `/shiftConfigs/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetAllShiftsQuery } = configsQueryApi;
export const {
  useCreateShiftMutation,
  useDeleteShiftMutation,
  useUpdateShiftMutation,
} = configsCommandApi;
