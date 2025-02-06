import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import type { IClinicRegistrationRequest } from "../types";

export const landingApi = createApi({
  reducerPath: "landingApi",
  baseQuery: reAuthQuery,
  endpoints: (builder) => ({
    clinicRegistration: builder.mutation<Response, IClinicRegistrationRequest>({
      query: (credentials) => ({
        url: "http://160.187.240.214:4000/api/v1/clinics/apply",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useClinicRegistrationMutation } = landingApi;
