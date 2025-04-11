import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IListResponse,
  IResCommon,
  IResListCommon,
  reAuthQuery,
} from "@/lib/api";
import { Conversation, Message } from "@/features/inbox/types";

// Correctly define types for the API
export const inboxApi = createApi({
  reducerPath: "inboxApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.beautify.asia/signaling-api",
  }), // If you want to use base URL
  endpoints: (builder) => ({
    getAllConversation: builder.query<
      IResCommon<Conversation[]>, // Response type
      { entityId: string; isClinic: boolean } // Request parameters type
    >({
      query: ({ entityId, isClinic }) => ({
        url: `/Chat/Conversations/${entityId}`, // Relative URL with base URL already configured
        method: "GET",
        params: {
          isClinic,
        },
      }),
    }),
    getAllMessageConversation: builder.query<
      IResCommon<Message[]>, // Response type
      { conversationId: string } // Request parameters type
    >({
      query: ({ conversationId }) => ({
        url: `/Chat/Messages/${conversationId}`, // Relative URL with base URL already configured
        method: "GET",
      }),
    }),
  }),
});

export interface SendMessageBody {
  entityId: string;
  content: string;
  isClinic: boolean;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: reAuthQuery("signaling"),
  endpoints: (builder) => ({
    sendMessage: builder.mutation<any, { data: SendMessageBody }>({
      query: ({ data }) => ({
        url: `/Chat`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetAllConversationQuery, useGetAllMessageConversationQuery } =
  inboxApi;

export const { useSendMessageMutation } = chatApi;
