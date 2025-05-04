import { createApi } from "@reduxjs/toolkit/query/react";
import { reAuthQuery } from "@/lib/api/reAuthQuery";
import { IListResponse, IResCommon } from "@/lib/api";
import { SubmitSurveyAnswerPayload, SurveyItem } from "../types";

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
    submitSurveyAnswers: builder.mutation<Response, SubmitSurveyAnswerPayload>({
      query: (payload) => ({
        url: "/survey-answers",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const landingQueryApi = createApi({
  reducerPath: "landingQueryApi",
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getSurvey: builder.query<
      IResCommon<IListResponse<SurveyItem>>,
      {
        searchTerm?: string;
        page?: number;
        pageSize?: number;
        sortColumn?: string;
        sortOrder?: string;
      }
    >({
      query: ({
        searchTerm = "",
        page = 1,
        pageSize = 10,
        sortColumn = "",
        sortOrder = "desc",
      }) => ({
        url: "/surveys",
        method: "GET",
        params: { searchTerm, page, pageSize, sortColumn, sortOrder },
      }),
    }),
  }),
});

export const { useClinicRegistrationMutation, useSubmitSurveyAnswersMutation } =
  landingApi;

export const { useGetSurveyQuery } = landingQueryApi;
