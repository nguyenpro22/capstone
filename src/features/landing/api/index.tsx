import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";

export const landingApi = createApi({
  reducerPath: "landingApi",
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    clinicRegistration: builder.mutation<Response, Partial<FormData>>({
      query: (credentials) => ({
        url: "/clinics",
        method: "POST",
        body: credentials,
        formData: true,
      }),
    }),
  }),
});

export const { useClinicRegistrationMutation } = landingApi;
