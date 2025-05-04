import { IResCommon } from "@/lib/api";

import { reAuthQuery } from "@/lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";

export const followCommandApi = createApi({
  reducerPath: "followCommandApi",
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    followClinic: builder.mutation<
      IResCommon<null>,
      { clinicId: string; isFollow: boolean }
    >({
      query: ({ clinicId, isFollow }) => ({
        url: "/followers",
        method: "POST",
        body: { clinicId, isFollow },
      }),
    }),
  }),
});

export const { useFollowClinicMutation } = followCommandApi;
