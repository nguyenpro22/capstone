import { IResCommon } from "@/lib/api";
import { reAuthQuery } from "@/lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import { FollowStatus } from "../types";

export const followQueryApi = createApi({
  reducerPath: "followQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getFollowStatus: builder.query<IResCommon<FollowStatus>, string>({
      query: (clinicId) => `/followers/${clinicId}`,
    }),
  }),
});

export const { useGetFollowStatusQuery } = followQueryApi;
