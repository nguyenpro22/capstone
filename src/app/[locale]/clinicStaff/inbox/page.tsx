"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from "uuid";
import { Send, MessageSquare } from "lucide-react";
import {
  useGetAllConversationQuery,
  useGetAllMessageConversationQuery,
} from "@/features/inbox/api";
import { getAccessToken, GetDataByToken, TokenData } from "@/utils";
import { Conversation, Message } from "@/features/inbox/types";

export default function ChatScreen() {
  const [inputMessage, setInputMessage] = useState("");
  const signalRef = useRef<signalR.HubConnection | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const token = getAccessToken() as string;
  const { clinicId } = GetDataByToken(token) as TokenData;
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for chat container

  const { data } = useGetAllConversationQuery({
    entityId: clinicId as string,
    isClinic: true,
  });

  const { data: messageData } = useGetAllMessageConversationQuery({
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
      .withAutomaticReconnect() // Automatically attempt to reconnect if the connection is lost
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
    if (signalRef.current) {
      signalRef.current
        .start()
        .then(() => {
          console.log("SignalR connected");
        })
        .catch((err) => {
          console.error("SignalR connection failed:", err);
        });

      signalRef.current.on("ReceiveMessage", (_sender, message) => {
        const newMessage: Message = message;
        console.log(newMessage);

        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      signalRef.current?.stop().then(() => console.log("SignalR disconnected"));
    };
  }, []);

  useEffect(() => {
    if (data && data.value && data.value.length > 0) {
      const initialConversation = data.value[0];
      setSelectedConversation(initialConversation);
    }
  }, [data]);

  // Handle message submission
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Main Chat Layout */}
      <div className="container px-4 mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[calc(100vh-160px)]">
          {/* Conversation List */}
          <div className="md:col-span-1 lg:col-span-1 bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden h-full">
            {/* <div>Hộp thoại</div> */}
            <ScrollArea className="h-[calc(100%-60px)]">
              <div className="py-2">
                {data?.value != null && data?.value.length > 0 ? (
                  data?.value.map((conversation, index) => (
                    <div
                      key={conversation.conversationId + index}
                      className={`flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                        selectedConversation?.conversationId ===
                        conversation.conversationId
                          ? "bg-gray-100 dark:bg-gray-800"
                          : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="relative flex justify-center items-center">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              conversation.friendImageUrl ??
                              "https://thispersondoesnotexist.com/"
                            }
                          />
                          <AvatarFallback>
                            {conversation.friendName}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <h3 className="font-medium">
                            {conversation?.friendName ?? ""}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Không tìm thấy kết quả
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Messages Area */}
          <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden h-full flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.friendImageUrl} />
                      <AvatarFallback>
                        {selectedConversation.friendName}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="font-medium">
                        {selectedConversation.friendName}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div
                  className="flex-1 p-4 overflow-y-auto"
                  ref={chatContainerRef}
                >
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isClinic ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!message.isClinic && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarImage
                              src={
                                message.senderImageUrl ??
                                "https://thispersondoesnotexist.com/"
                              }
                            />
                            <AvatarFallback>
                              {message.senderName}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div
                            className={`rounded-lg p-3 max-w-xs break-words ${
                              message.isClinic
                                ? "bg-pink-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div
                            className={`flex items-center mt-1 text-xs text-gray-500 ${
                              message.isClinic ? "justify-end" : ""
                            }`}
                          >
                            <span>
                              {new Date(message.createdOnUtc).toLocaleString(
                                "vi-VN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="px-4 py-3 border-t dark:border-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Nhập tin nhắn..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          // console.log('Key pressed:', e.key); // Debug
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
                        className="pr-10"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        sendMessage!(selectedConversation.entityId)(
                          inputMessage
                        );
                        setInputMessage("");
                      }}
                      className="bg-pink-500 hover:bg-pink-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Chưa có cuộc trò chuyện nào
                </h3>
                <p className="text-gray-500 max-w-xs mb-4">
                  Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn
                  tin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
