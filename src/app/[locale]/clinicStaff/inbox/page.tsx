"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from "uuid";
import { Send, MessageSquare, Search, Clock, Bell, Globe } from "lucide-react";
import {
  useGetAllConversationQuery,
  useGetAllMessageConversationQuery,
} from "@/features/inbox/api";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";
import type { Conversation, Message } from "@/features/inbox/types";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

interface ConversationNotification {
  conversationId: string;
  newMessageCount: number;
}

export default function ChatScreen() {
  const t = useTranslations("chat");
  const locale = useLocale();

  const [inputMessage, setInputMessage] = useState("");
  const signalRef = useRef<signalR.HubConnection | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const token = getAccessToken() as string;
  const { clinicId } = GetDataByToken(token) as TokenData;
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationNotification, setConversationNotification] = useState<
    ConversationNotification[]
  >([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data } = useGetAllConversationQuery({
    entityId: clinicId as string,
    isClinic: true,
  });

  const { data: messageData, refetch } = useGetAllMessageConversationQuery({
    conversationId: selectedConversation?.conversationId ?? "",
  });

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `https://api.beautify.asia/signaling-api/ChatHub?clinicId=${clinicId}&type=1`,
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        }
      )
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .withHubProtocol(new signalR.JsonHubProtocol())
      .build();

    signalRef.current = newConnection;
  }, [clinicId]);

  useEffect(() => {
    if (messageData && messageData.value) {
      setMessages(messageData.value);
    }
  }, [messageData]);

  useEffect(() => {
    if (signalRef.current != null && selectedConversation == null) {
      signalRef.current
        .start()
        .then(() => {
          console.log("SignalR connected");
        })
        .catch((err) => {
          console.error("SignalR connection failed:", err);
        });
    }

    const handleReceiveMessage = (_sender: any, message: Message) => {
      const newMessage: Message = message;

      console.log("Received message:", newMessage);
      console.log(
        "Current conversation ID:",
        selectedConversation?.conversationId
      );
      console.log("Message conversation ID:", newMessage.conversationId);

      if (selectedConversation?.conversationId !== newMessage.conversationId) {
        const notification: ConversationNotification = {
          conversationId: newMessage.conversationId,
          newMessageCount: 1,
        };
        setConversationNotification((prevNotifications) => {
          const existingNotification = prevNotifications.find(
            (n) => n.conversationId === notification.conversationId
          );
          if (existingNotification) {
            return prevNotifications.map((n) =>
              n.conversationId === notification.conversationId
                ? { ...n, newMessageCount: n.newMessageCount + 1 }
                : n
            );
          } else {
            return [...prevNotifications, notification];
          }
        });
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    if (signalRef.current != null && selectedConversation != null) {
      signalRef.current.off("ReceiveMessage");
      signalRef.current.on("ReceiveMessage", handleReceiveMessage);
    }

    return () => {
      if (signalRef.current != null) {
        signalRef.current.off("ReceiveMessage");
      }
    };
  }, [selectedConversation]);

  useEffect(() => {
    if (data && data.value && data.value.length > 0) {
      const initialConversation = data.value[0];
      setSelectedConversation(initialConversation);
    }
  }, [data]);

  const handleSelectedCoversation = (conversation: Conversation) => () => {
    setSelectedConversation(conversation);
    setConversationNotification((prevNotifications) => {
      const existingNotification = prevNotifications.find(
        (n) => n.conversationId === conversation.conversationId
      );
      if (existingNotification) {
        return prevNotifications.map((n) =>
          n.conversationId === conversation.conversationId
            ? { ...n, newMessageCount: 0 }
            : n
        );
      } else {
        return [...prevNotifications];
      }
    });
  };

  useEffect(() => {
    if (selectedConversation?.conversationId) {
      refetch();
    }
  }, [selectedConversation, refetch]);

  const sendMessage = useCallback(
    (receiverId: string) => async (message: string) => {
      if (
        signalRef.current &&
        message &&
        receiverId &&
        selectedConversation?.entityId
      ) {
        console.log({ receiverId, clinicId, message });
        await signalRef.current.invoke(
          "SendMessage",
          clinicId,
          receiverId,
          true,
          message
        );

        const createTimestamp = (): string => {
          const date = new Date();
          const vietnamTimezoneOffset = 7 * 60; // 7 hours in minutes
          const localTime = new Date(
            date.getTime() + vietnamTimezoneOffset * 60 * 1000
          );
          const year = localTime.getUTCFullYear();
          const month = String(localTime.getUTCMonth() + 1).padStart(2, "0");
          const day = String(localTime.getUTCDate()).padStart(2, "0");
          const hours = String(localTime.getUTCHours()).padStart(2, "0");
          const minutes = String(localTime.getUTCMinutes()).padStart(2, "0");
          const seconds = String(localTime.getUTCSeconds()).padStart(2, "0");
          const milliseconds = Math.floor(localTime.getUTCMilliseconds() / 100);
          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
        };

        const timestamp = createTimestamp();
        const randomId = uuidv4();
        const newMessage: Message = {
          id: randomId,
          conversationId: selectedConversation?.conversationId as string,
          senderId: clinicId as string,
          content: message,
          createdOnUtc: timestamp,
          isClinic: true,
          senderName: selectedConversation?.friendName as string,
          senderImageUrl: selectedConversation?.friendImageUrl as string,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    },
    [signalRef, selectedConversation, clinicId]
  );

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredConversations =
    data?.value?.filter((conversation) =>
      conversation.friendName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(locale === "vi" ? "vi-VN" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(locale === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t("title")}
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[calc(100vh-160px)]">
          {/* Conversation List */}
          <div className="md:col-span-1 lg:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b dark:border-gray-800">
              <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                {t("title")}
              </h2>
              <div className="relative">
                <Input
                  placeholder={t("search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="py-2">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => {
                    const notification = conversationNotification.find(
                      (n) => n.conversationId === conversation.conversationId
                    );
                    const hasNewMessages =
                      notification && notification.newMessageCount > 0;

                    return (
                      <div
                        key={conversation.conversationId}
                        className={`p-3 flex items-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 ${
                          selectedConversation?.conversationId ===
                          conversation.conversationId
                            ? "bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500"
                            : "border-l-4 border-transparent"
                        } ${
                          hasNewMessages
                            ? "bg-rose-50/50 dark:bg-rose-900/5"
                            : ""
                        }`}
                        onClick={handleSelectedCoversation(conversation)}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-sm">
                            <AvatarImage
                              src={
                                conversation.friendImageUrl ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                            />
                            <AvatarFallback className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                              {conversation.friendName
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {hasNewMessages && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                          )}
                        </div>
                        <div className="ml-3 flex-1 overflow-hidden">
                          <div className="flex justify-between items-center">
                            <h3
                              className={`font-medium truncate ${
                                hasNewMessages
                                  ? "text-rose-600 dark:text-rose-400 font-semibold"
                                  : "text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {conversation?.friendName ?? ""}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              12:30
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {hasNewMessages ? (
                              <span className="text-rose-600 dark:text-rose-400">
                                {t("newMessages", {
                                  count: notification?.newMessageCount,
                                })}
                              </span>
                            ) : (
                              t("clickToView")
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                    <Search className="h-8 w-8 mb-2 text-gray-400" />
                    <p>{t("noResults")}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Messages Area */}
          <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 shadow-sm">
                      <AvatarImage
                        src={
                          selectedConversation.friendImageUrl ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                      />
                      <AvatarFallback className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                        {selectedConversation.friendName
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {selectedConversation.friendName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="h-1.5 w-1.5 bg-green-500 rounded-full inline-block mr-1.5"></span>
                        {t("online")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div
                  className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-950"
                  ref={chatContainerRef}
                >
                  {messages.length > 0 ? (
                    <div className="space-y-6">
                      {messages.map((message, index) => {
                        const showDate =
                          index === 0 ||
                          formatDate(messages[index - 1].createdOnUtc) !==
                            formatDate(message.createdOnUtc);

                        return (
                          <div key={message.id}>
                            {showDate && (
                              <div className="flex justify-center my-4">
                                <Badge
                                  variant="outline"
                                  className="bg-white dark:bg-gray-800 text-gray-500 flex items-center gap-1 px-3 py-1"
                                >
                                  <Clock className="h-3 w-3" />
                                  {formatDate(message.createdOnUtc)}
                                </Badge>
                              </div>
                            )}
                            <div
                              className={`flex ${
                                message.isClinic
                                  ? "justify-end"
                                  : "justify-start"
                              } group`}
                            >
                              {!message.isClinic && (
                                <Avatar className="h-8 w-8 mr-2 mt-1 border-2 border-white dark:border-gray-800 shadow-sm">
                                  <AvatarImage
                                    src={message.senderImageUrl ?? ""}
                                  />
                                  <AvatarFallback className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                                    {message.senderName
                                      ?.substring(0, 2)
                                      .toUpperCase() || ""}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div>
                                <div
                                  className={`rounded-2xl p-3 max-w-xs md:max-w-md break-words shadow-sm ${
                                    message.isClinic
                                      ? "bg-rose-500 text-white rounded-tr-none"
                                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                </div>
                                <div
                                  className={`flex items-center mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity ${
                                    !message.isClinic ? "justify-end" : ""
                                  }`}
                                >
                                  <span>
                                    {formatTime(message.createdOnUtc)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="h-8 w-8 text-rose-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
                        {t("noMessages")}
                      </h3>
                      <p className="text-gray-500 max-w-xs">
                        {t("startConversation", {
                          name: selectedConversation.friendName,
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="px-4 py-3 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder={t("inputPlaceholder")}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            (async () => {
                              await sendMessage!(selectedConversation.entityId)(
                                inputMessage
                              );
                              setInputMessage("");
                            })();
                          }
                        }}
                        className="pr-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-rose-500 focus:border-rose-500"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        sendMessage!(selectedConversation.entityId)(
                          inputMessage
                        );
                        setInputMessage("");
                      }}
                      className="bg-rose-500 hover:bg-rose-600 transition-colors"
                      disabled={!inputMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">{t("send")}</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <MessageSquare className="h-10 w-10 text-rose-500" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-gray-800 dark:text-gray-200">
                  {t("noConversations")}
                </h3>
                <p className="text-gray-500 max-w-sm mb-6">
                  {t("selectConversation")}
                </p>
                <Button
                  variant="outline"
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/20"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {t("enableNotifications")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
