"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import { useTranslations } from "next-intl";

import * as signalR from "@microsoft/signalr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from "uuid";
import {
  Send,
  MessageSquare,
  Search,
  Clock,
  Bell,
  ChevronLeft,
  MoreVertical,
  Smile,
  X,
  Download,
} from "lucide-react";
import {
  useGetAllConversationQuery,
  useGetAllMessageConversationQuery,
} from "@/features/inbox/api";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";
import type { Conversation, Message } from "@/features/inbox/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import EmojiPicker from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { toast } from "react-toastify";
import { Progress } from "@/components/ui/progress";

// Extended Message type to support different content types
interface ExtendedMessage extends Message {
  contentType?: "text" | "image" | "file" | "emoji";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

interface ConversationNotification {
  conversationId: string;
  newMessageCount: number;
}

export default function ChatScreen() {
  // Get translations using the useTranslations hook
  const t = useTranslations("chat");

  const [inputMessage, setInputMessage] = useState("");
  const signalRef = useRef<signalR.HubConnection | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const token = getAccessToken() as string;
  const { clinicId } = GetDataByToken(token) as TokenData;
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [conversationNotification, setConversationNotification] = useState<
    ConversationNotification[]
  >([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [isUploading, setIsUploading] = useState(false);

  const { data, isLoading: isLoadingConversations } =
    useGetAllConversationQuery({
      entityId: clinicId as string,
      isClinic: true,
    });

  const {
    data: messageData,
    refetch,
    isLoading: isLoadingMessages,
  } = useGetAllMessageConversationQuery(
    {
      conversationId: selectedConversation?.conversationId ?? "",
    },
    {
      skip: !selectedConversation?.conversationId,
    }
  );

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
      // Convert regular messages to extended messages with contentType
      const extendedMessages = messageData.value.map((msg: Message) => {
        // Try to determine if the content is a JSON string containing file or image info
        try {
          const parsedContent = JSON.parse(msg.content);
          if (parsedContent.type === "image") {
            return {
              ...msg,
              contentType: "image",
              fileUrl: parsedContent.url,
              fileName: parsedContent.name,
            } as ExtendedMessage;
          } else if (parsedContent.type === "file") {
            return {
              ...msg,
              contentType: "file",
              fileUrl: parsedContent.url,
              fileName: parsedContent.name,
              fileSize: parsedContent.size,
              fileType: parsedContent.fileType,
            } as ExtendedMessage;
          } else if (parsedContent.type === "emoji") {
            return {
              ...msg,
              contentType: "emoji",
              content: parsedContent.emoji,
            } as ExtendedMessage;
          }
        } catch (e) {
          // Not JSON, treat as regular text
        }

        return {
          ...msg,
          contentType: "text",
        } as ExtendedMessage;
      });

      setMessages(extendedMessages);
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
      const newMessage = message as ExtendedMessage;

      // Try to determine if the content is a JSON string containing file or image info
      try {
        const parsedContent = JSON.parse(newMessage.content);
        if (parsedContent.type === "image") {
          newMessage.contentType = "image";
          newMessage.fileUrl = parsedContent.url;
          newMessage.fileName = parsedContent.name;
        } else if (parsedContent.type === "file") {
          newMessage.contentType = "file";
          newMessage.fileUrl = parsedContent.url;
          newMessage.fileName = parsedContent.name;
          newMessage.fileSize = parsedContent.size;
          newMessage.fileType = parsedContent.fileType;
        } else if (parsedContent.type === "emoji") {
          newMessage.contentType = "emoji";
          newMessage.content = parsedContent.emoji;
        }
      } catch (e) {
        // Not JSON, treat as regular text
        newMessage.contentType = "text";
      }

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
    setShowMobileConversations(false);
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
    (receiverId: string) =>
      async (
        message: string,
        contentType: "text" | "image" | "file" | "emoji" = "text",
        fileData?: any
      ) => {
        if (signalRef.current && receiverId && selectedConversation?.entityId) {
          let messageContent = message;

          // Format message content based on type
          if (contentType === "image") {
            messageContent = JSON.stringify({
              type: "image",
              url: fileData.url,
              name: fileData.name,
            });
          } else if (contentType === "file") {
            messageContent = JSON.stringify({
              type: "file",
              url: fileData.url,
              name: fileData.name,
              size: fileData.size,
              fileType: fileData.type,
            });
          } else if (contentType === "emoji") {
            messageContent = JSON.stringify({
              type: "emoji",
              emoji: message,
            });
          }

          await signalRef.current.invoke(
            "SendMessage",
            clinicId,
            receiverId,
            true,
            messageContent
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
            const milliseconds = Math.floor(
              localTime.getUTCMilliseconds() / 100
            );
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
          };

          const timestamp = createTimestamp();
          const randomId = uuidv4();

          const newMessage: ExtendedMessage = {
            id: randomId,
            conversationId: selectedConversation?.conversationId as string,
            senderId: clinicId as string,
            content: message,
            createdOnUtc: timestamp,
            isClinic: true,
            senderName: selectedConversation?.friendName as string,
            senderImageUrl: selectedConversation?.friendImageUrl as string,
            contentType: contentType,
          };

          if (contentType === "image") {
            newMessage.fileUrl = fileData.url;
            newMessage.fileName = fileData.name;
          } else if (contentType === "file") {
            newMessage.fileUrl = fileData.url;
            newMessage.fileName = fileData.name;
            newMessage.fileSize = fileData.size;
            newMessage.fileType = fileData.type;
          }

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
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBackToConversations = () => {
    setShowMobileConversations(true);
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    if (selectedConversation) {
      sendMessage(selectedConversation.entityId)(emojiData.emoji, "emoji");
      setShowEmojiPicker(false);
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "image"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedConversation) return;

    const file = files[0];
    const fileId = uuidv4();

    // Mock upload progress
    setIsUploading(true);
    setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

    try {
      // Simulate file upload with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress((prev) => ({ ...prev, [fileId]: i }));
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // In a real implementation, you would upload the file to your server or cloud storage
      // and get back a URL. For this demo, we'll create an object URL.
      const fileUrl = URL.createObjectURL(file);

      // Send the message with file data
      await sendMessage(selectedConversation.entityId)(file.name, type, {
        url: fileUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      });

      toast.success(
        type === "image"
          ? t("fileUpload.imageSuccess")
          : t("fileUpload.fileSuccess")
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(
        type === "image"
          ? t("fileUpload.imageError")
          : t("fileUpload.fileError")
      );
    } finally {
      setIsUploading(false);
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });

      // Reset the file input
      if (type === "file" && fileInputRef.current) {
        fileInputRef.current.value = "";
      } else if (type === "image" && imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word") || fileType.includes("doc")) return "📝";
    if (
      fileType.includes("excel") ||
      fileType.includes("sheet") ||
      fileType.includes("csv")
    )
      return "📊";
    if (fileType.includes("powerpoint") || fileType.includes("presentation"))
      return "📑";
    if (
      fileType.includes("zip") ||
      fileType.includes("rar") ||
      fileType.includes("tar")
    )
      return "🗜️";
    if (fileType.includes("audio")) return "🎵";
    if (fileType.includes("video")) return "🎬";
    return "📁";
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[calc(100vh-160px)]">
          {/* Conversation List - Hidden on mobile when a conversation is selected */}
          <div
            className={`md:col-span-1 lg:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col ${
              !showMobileConversations ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-4 border-b dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
              <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-rose-500" />
                {t("title")}
              </h2>
              <div className="relative">
                <Input
                  placeholder={t("search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-rose-500 focus:border-rose-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="py-2">
                {isLoadingConversations ? (
                  // Loading skeleton for conversations
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="p-3 flex items-center">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="ml-3 flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))
                ) : filteredConversations.length > 0 ? (
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
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] text-white font-medium">
                              {notification.newMessageCount > 9
                                ? "9+"
                                : notification.newMessageCount}
                            </span>
                          )}
                          <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
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

          {/* Messages Area - Shown on mobile when a conversation is selected */}
          <div
            className={`md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col ${
              showMobileConversations ? "hidden md:flex" : "flex"
            }`}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 md:hidden"
                      onClick={handleBackToConversations}
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </Button>
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
                  <div className="flex items-center space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("actions.moreOptions")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Messages */}
                <div
                  className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-950"
                  ref={chatContainerRef}
                  onClick={focusInput}
                >
                  {isLoadingMessages ? (
                    // Loading skeleton for messages
                    <div className="space-y-6">
                      {Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              index % 2 === 0 ? "justify-end" : "justify-start"
                            }`}
                          >
                            {index % 2 !== 0 && (
                              <Skeleton className="h-8 w-8 rounded-full mr-2" />
                            )}
                            <div>
                              <Skeleton
                                className={`h-10 w-48 ${
                                  index % 2 === 0
                                    ? "rounded-tr-none"
                                    : "rounded-tl-none"
                                } rounded-2xl`}
                              />
                              <div className="mt-1 h-3"></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-6">
                      {messages.map((message, index) => {
                        const showDate =
                          index === 0 ||
                          formatDate(messages[index - 1].createdOnUtc) !==
                            formatDate(message.createdOnUtc);

                        // Check if this message is from the same sender as the previous one
                        const isSameSenderAsPrevious =
                          index > 0 &&
                          messages[index - 1].isClinic === message.isClinic &&
                          formatDate(messages[index - 1].createdOnUtc) ===
                            formatDate(message.createdOnUtc);

                        // Determine if we should show the avatar (only for first message in a group)
                        const showAvatar =
                          !message.isClinic && !isSameSenderAsPrevious;

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
                              } group ${
                                isSameSenderAsPrevious ? "mt-1" : "mt-4"
                              }`}
                            >
                              {!message.isClinic && (
                                <div className="w-8 h-8 mr-2 flex-shrink-0">
                                  {showAvatar ? (
                                    <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800 shadow-sm">
                                      <AvatarImage
                                        src={message.senderImageUrl ?? ""}
                                      />
                                      <AvatarFallback className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                                        {message.senderName
                                          ?.substring(0, 2)
                                          .toUpperCase() || ""}
                                      </AvatarFallback>
                                    </Avatar>
                                  ) : null}
                                </div>
                              )}
                              <div>
                                {message.contentType === "text" && (
                                  <div
                                    className={`rounded-2xl p-3 max-w-xs md:max-w-md break-words shadow-sm ${
                                      message.isClinic
                                        ? "bg-rose-500 text-white rounded-tr-none"
                                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
                                    }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                )}

                                {message.contentType === "emoji" && (
                                  <div
                                    className={`rounded-2xl p-3 max-w-xs md:max-w-md break-words shadow-sm ${
                                      message.isClinic
                                        ? "bg-rose-500/10 rounded-tr-none"
                                        : "bg-white/10 dark:bg-gray-800/10 rounded-tl-none"
                                    }`}
                                  >
                                    <span className="text-3xl">
                                      {message.content}
                                    </span>
                                  </div>
                                )}

                                {message.contentType === "image" &&
                                  message.fileUrl && (
                                    <div
                                      className={`rounded-2xl p-2 max-w-xs md:max-w-md overflow-hidden shadow-sm ${
                                        message.isClinic
                                          ? "bg-rose-500/10 rounded-tr-none"
                                          : "bg-white dark:bg-gray-800 rounded-tl-none"
                                      }`}
                                    >
                                      <div className="relative rounded-lg overflow-hidden">
                                        <Image
                                          src={
                                            message.fileUrl ||
                                            "/placeholder.svg" ||
                                            "/placeholder.svg"
                                          }
                                          alt={
                                            message.fileName ||
                                            t("fileTypes.image")
                                          }
                                          width={300}
                                          height={200}
                                          className="object-contain max-h-[300px] w-auto"
                                          style={{ maxWidth: "100%" }}
                                        />
                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                                          <a
                                            href={message.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download={message.fileName}
                                            className="bg-white/80 p-2 rounded-full"
                                          >
                                            <Download className="h-5 w-5 text-gray-800" />
                                          </a>
                                        </div>
                                      </div>
                                      {message.fileName && (
                                        <p className="text-xs mt-1 text-center text-gray-600 dark:text-gray-300">
                                          {message.fileName}
                                        </p>
                                      )}
                                    </div>
                                  )}

                                {message.contentType === "file" &&
                                  message.fileUrl && (
                                    <div
                                      className={`rounded-2xl p-3 max-w-xs md:max-w-md break-words shadow-sm ${
                                        message.isClinic
                                          ? "bg-rose-500/10 rounded-tr-none"
                                          : "bg-white dark:bg-gray-800 rounded-tl-none"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="text-2xl">
                                          {getFileIcon(message.fileType || "")}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                            {message.fileName}
                                          </p>
                                          {message.fileSize && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                              {formatFileSize(message.fileSize)}
                                            </p>
                                          )}
                                        </div>
                                        <a
                                          href={message.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          download={message.fileName}
                                          className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                          <Download className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                        </a>
                                      </div>
                                    </div>
                                  )}

                                <div
                                  className={`flex items-center mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity ${
                                    message.isClinic ? "justify-end" : ""
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

                  {/* Upload Progress Indicators */}
                  {Object.keys(uploadProgress).length > 0 && (
                    <div className="fixed bottom-20 right-6 max-w-xs w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {t("uploading")}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => setUploadProgress({})}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3 space-y-3">
                        {Object.entries(uploadProgress).map(
                          ([id, progress]) => (
                            <div key={id} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-300">
                                  {t("uploading")}
                                </span>
                                <span className="text-gray-600 dark:text-gray-300">
                                  {progress}%
                                </span>
                              </div>
                              <Progress value={progress} className="h-1.5" />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="px-4 py-3 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <Popover
                        open={showEmojiPicker}
                        onOpenChange={setShowEmojiPicker}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full h-9 w-9"
                          >
                            <Smile className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full p-0 border-none shadow-xl"
                          align="start"
                        >
                          <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            width="100%"
                            height={350}
                            previewConfig={{ showPreview: false }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        placeholder={t("inputPlaceholder")}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (inputMessage.trim()) {
                              (async () => {
                                await sendMessage!(
                                  selectedConversation.entityId
                                )(inputMessage, "text");
                                setInputMessage("");
                              })();
                            }
                          }
                        }}
                        className="pr-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-rose-500 focus:border-rose-500 rounded-full"
                        disabled={isUploading}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        if (inputMessage.trim()) {
                          sendMessage!(selectedConversation.entityId)(
                            inputMessage,
                            "text"
                          );
                          setInputMessage("");
                        }
                      }}
                      className="bg-rose-500 hover:bg-rose-600 transition-colors rounded-full"
                      disabled={!inputMessage.trim() || isUploading}
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
