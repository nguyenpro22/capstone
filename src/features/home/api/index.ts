import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import { IListResponse, IResCommon } from "@/lib/api";
import { ICategory, IUser } from "../types";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getAllcategories: builder.query<
      IResCommon<IListResponse<ICategory>>,
      { pageIndex?: number; pageSize?: number }
    >({
      query: ({ pageIndex = 1, pageSize = 10 }) => ({
        url: `/categories?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),
  }),
});

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getUserProfile: builder.query<IResCommon<IUser>, void>({
      query: () => ({
        url: `/users/information`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserProfileQuery } = userApi;

export const { useGetAllcategoriesQuery } = categoryApi;
