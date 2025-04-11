"use client";
import { use, useCallback, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from "uuid";
import {
  Search,
  Send,
  ImageIcon,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  Clock,
  Bell,
  Mic,
  Home,
  MessageSquare,
  ShoppingBag,
  User,
  PlaySquare,
} from "lucide-react";
import Image from "next/image";
import { useGetAllConversationQuery } from "@/features/inbox/api";
import { da } from "date-fns/locale";
import { getAccessToken, GetDataByToken, TokenData } from "@/utils";
import { Conversation, Message } from "@/features/inbox/types";

export default function ChatScreen() {
  const [inputMessage, setInputMessage] = useState("");
  const signalRef = useRef<signalR.HubConnection | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const token = getAccessToken() as string;
  const { userId } = GetDataByToken(token) as TokenData;

  const { data } = useGetAllConversationQuery({
    entityId: userId,
    isClinic: false,
  });

  // Sample messages for the selected conversation
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `https://api.beautify.asia/signaling-api/ChatHub?userId=${userId}&type=0`,
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
  }, [userId]);

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
        await signalRef.current.invoke(
          "SendMessage",
          userId,
          receiverId,
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
          senderId: userId as string,
          content: message,
          createdOnUtc: timestamp,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    },
    [signalRef, selectedConversation, userId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b sticky top-0 z-10 font-sans">
        <div className="container px-4 mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-serif font-bold">
              Chat với thẩm mỹ viện
            </h1>
          </div>
        </div>
      </header>

      {/* Main Chat Layout */}
      <div className="container px-4 mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[calc(100vh-160px)]">
          {/* Conversation List */}
          <div className="md:col-span-1 lg:col-span-1 bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden h-full">
            <ScrollArea className="h-[calc(100%-60px)]">
              <div className="py-2">
                {data?.value != null && data?.value.length > 0 ? (
                  data?.value.map((conversation) => (
                    <div
                      key={conversation.conversationId}
                      className={`flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                        selectedConversation?.conversationId ===
                        conversation.conversationId
                          ? "bg-gray-100 dark:bg-gray-800"
                          : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conversation.friendImageUrl} />
                          <AvatarFallback>
                            {conversation.friendName.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
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
                        {selectedConversation.friendName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="font-medium">
                        {selectedConversation.friendName}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {/* {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!message.isOwn && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarImage src={selectedConversation.avatar} />
                            <AvatarFallback>
                              {selectedConversation.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div
                            className={`rounded-lg p-3 max-w-xs break-words ${
                              message.isOwn
                                ? "bg-pink-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <div
                            className={`flex items-center mt-1 text-xs text-gray-500 ${
                              message.isOwn ? "justify-end" : ""
                            }`}
                          >
                            <span>{message.timestamp}</span>
                            {message.isOwn && (
                              <span className="ml-1">
                                {message.status === "read" ? (
                                  <CheckCheck className="h-3 w-3 text-blue-500" />
                                ) : message.status === "delivered" ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))} */}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="px-4 py-3 border-t dark:border-gray-800">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ImageIcon className="h-5 w-5 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Mic className="h-5 w-5 text-gray-500" />
                    </Button>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        <Smile className="h-5 w-5 text-gray-500" />
                      </Button>
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
