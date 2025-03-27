"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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

// Define types for our chat data
interface Clinic {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isUser: boolean;
  attachments?: {
    type: "image" | "file";
    url: string;
    name?: string;
  }[];
}

export default function ChatScreen() {
  // Mock data for clinics
  const clinics: Clinic[] = [
    {
      id: "1",
      name: "Beauty Clinic Saigon",
      avatar:
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740575109/c2fpxfjhi1bpcfqys7ax.png",
      lastMessage: "Xin chào, chúng tôi có thể giúp gì cho bạn?",
      lastMessageTime: "10:30",
      unreadCount: 2,
      online: true,
    },
    {
      id: "2",
      name: "Luxury Spa & Clinic",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Cảm ơn bạn đã đặt lịch. Chúng tôi sẽ xác nhận lại sau.",
      lastMessageTime: "Hôm qua",
      unreadCount: 0,
      online: true,
    },
    {
      id: "3",
      name: "Seoul Beauty Center",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Bạn có thể đến vào lúc 15:00 chiều mai nhé.",
      lastMessageTime: "Hôm qua",
      unreadCount: 0,
      online: false,
    },
    {
      id: "4",
      name: "Tokyo Aesthetic Clinic",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Chúng tôi có chương trình khuyến mãi đặc biệt tháng này.",
      lastMessageTime: "23/02",
      unreadCount: 0,
      online: false,
    },
    {
      id: "5",
      name: "Paris Beauty Lounge",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Xin chào, bạn quan tâm đến dịch vụ nào của chúng tôi?",
      lastMessageTime: "20/02",
      unreadCount: 0,
      online: false,
    },
  ];

  // Mock data for messages with the selected clinic
  const messages: Message[] = [
    {
      id: "1",
      senderId: "1",
      text: "Xin chào, tôi là tư vấn viên của Beauty Clinic Saigon. Tôi có thể giúp gì cho bạn?",
      timestamp: "10:00",
      status: "read",
      isUser: false,
    },
    {
      id: "2",
      senderId: "user",
      text: "Chào bạn, tôi muốn tìm hiểu về dịch vụ nâng mũi của phòng khám.",
      timestamp: "10:05",
      status: "read",
      isUser: true,
    },
    {
      id: "3",
      senderId: "1",
      text: "Dạ, chúng tôi có nhiều dịch vụ nâng mũi khác nhau như nâng mũi cấu trúc, nâng mũi S-line, nâng mũi sụn tự thân. Bạn quan tâm đến loại nào ạ?",
      timestamp: "10:07",
      status: "read",
      isUser: false,
    },
    {
      id: "4",
      senderId: "user",
      text: "Tôi quan tâm đến nâng mũi cấu trúc. Bạn có thể cho tôi biết thêm chi tiết và chi phí không?",
      timestamp: "10:10",
      status: "read",
      isUser: true,
    },
    {
      id: "5",
      senderId: "1",
      text: "Dạ, nâng mũi cấu trúc là phương pháp sử dụng sụn nhân tạo kết hợp với đầu mũi bằng sụn tự thân, giúp tạo dáng mũi cao, thon gọn và tự nhiên. Chi phí dao động từ 10-15 triệu đồng tùy theo yêu cầu cụ thể.",
      timestamp: "10:15",
      status: "read",
      isUser: false,
    },
    {
      id: "6",
      senderId: "1",
      text: "Đây là một số hình ảnh trước và sau khi thực hiện dịch vụ nâng mũi cấu trúc tại phòng khám chúng tôi:",
      timestamp: "10:16",
      status: "read",
      isUser: false,
      attachments: [
        {
          type: "image",
          url: "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740576255/gynaxhkdy9u3c8id159o.png",
        },
        {
          type: "image",
          url: "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740576257/zb2kg2egoc9v26suet1e.png",
        },
      ],
    },
    {
      id: "7",
      senderId: "user",
      text: "Cảm ơn bạn. Thời gian hồi phục sau phẫu thuật là bao lâu?",
      timestamp: "10:20",
      status: "delivered",
      isUser: true,
    },
    {
      id: "8",
      senderId: "1",
      text: "Thời gian hồi phục thông thường là 7-10 ngày để tháo băng và rút chỉ. Sau 2-3 tuần, sưng sẽ giảm đáng kể và bạn có thể quay lại công việc bình thường. Kết quả cuối cùng sẽ ổn định sau 1-3 tháng.",
      timestamp: "10:25",
      status: "delivered",
      isUser: false,
    },
    {
      id: "9",
      senderId: "1",
      text: "Bạn có thể đặt lịch tư vấn trực tiếp với bác sĩ để được đánh giá cụ thể hơn. Chúng tôi có lịch tư vấn miễn phí vào các ngày trong tuần.",
      timestamp: "10:30",
      status: "sent",
      isUser: false,
    },
  ];

  const [selectedClinic, setSelectedClinic] = useState<Clinic>(clinics[0]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredClinics = clinics.filter((clinic) =>
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    // In a real app, you would send the message to the server here
    setInputMessage("");
  };

  // Function to render message status icon
  const renderMessageStatus = (status: "sent" | "delivered" | "read") => {
    switch (status) {
      case "sent":
        return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-3.5 w-3.5 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b sticky top-0 z-10">
        <div className="container px-4 mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-serif font-bold">
              Chat với thẩm mỹ viện
            </h1>
            <div className="flex items-center gap-2">
              {isSearchOpen ? (
                <div className="relative">
                  <Input
                    placeholder="Tìm kiếm..."
                    className="w-40 md:w-60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-x"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container px-4 mx-auto py-6">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 border rounded-lg bg-white dark:bg-gray-900 overflow-hidden">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm thẩm mỹ viện..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Tabs defaultValue="all">
              <div className="px-3 pt-3">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    Tất cả
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">
                    Chưa đọc
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all" className="m-0">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="divide-y">
                    {filteredClinics.map((clinic) => (
                      <div
                        key={clinic.id}
                        className={`p-3 hover:bg-muted cursor-pointer transition-colors ${
                          selectedClinic.id === clinic.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedClinic(clinic)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12 border">
                              <AvatarImage
                                src={clinic.avatar}
                                alt={clinic.name}
                              />
                              <AvatarFallback>
                                {clinic.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {clinic.online && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium truncate">
                                {clinic.name}
                              </h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {clinic.lastMessageTime}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {clinic.lastMessage}
                            </p>
                          </div>
                        </div>
                        {clinic.unreadCount > 0 && (
                          <div className="flex justify-end mt-1">
                            <Badge
                              variant="default"
                              className="rounded-full h-5 min-w-5 px-1.5"
                            >
                              {clinic.unreadCount}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="divide-y">
                    {filteredClinics
                      .filter((clinic) => clinic.unreadCount > 0)
                      .map((clinic) => (
                        <div
                          key={clinic.id}
                          className={`p-3 hover:bg-muted cursor-pointer transition-colors ${
                            selectedClinic.id === clinic.id ? "bg-muted" : ""
                          }`}
                          onClick={() => setSelectedClinic(clinic)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12 border">
                                <AvatarImage
                                  src={clinic.avatar}
                                  alt={clinic.name}
                                />
                                <AvatarFallback>
                                  {clinic.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {clinic.online && (
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium truncate">
                                  {clinic.name}
                                </h3>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                  {clinic.lastMessageTime}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate mt-1">
                                {clinic.lastMessage}
                              </p>
                            </div>
                          </div>
                          {clinic.unreadCount > 0 && (
                            <div className="flex justify-end mt-1">
                              <Badge
                                variant="default"
                                className="rounded-full h-5 min-w-5 px-1.5"
                              >
                                {clinic.unreadCount}
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 border rounded-lg bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={selectedClinic.avatar}
                    alt={selectedClinic.name}
                  />
                  <AvatarFallback>
                    {selectedClinic.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedClinic.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedClinic.online
                      ? "Đang hoạt động"
                      : "Không hoạt động"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex gap-2 max-w-[80%]">
                      {!message.isUser && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage
                            src={selectedClinic.avatar}
                            alt={selectedClinic.name}
                          />
                          <AvatarFallback>
                            {selectedClinic.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.isUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p>{message.text}</p>
                        </div>

                        {/* Attachments */}
                        {message.attachments &&
                          message.attachments.length > 0 && (
                            <div className="mt-2 flex gap-2">
                              {message.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className="relative rounded-lg overflow-hidden"
                                >
                                  {attachment.type === "image" && (
                                    <Image
                                      src={attachment.url || "/placeholder.svg"}
                                      alt="Attachment"
                                      width={200}
                                      height={150}
                                      className="object-cover rounded-lg"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <span>{message.timestamp}</span>
                          {message.isUser &&
                            renderMessageStatus(message.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center my-4">
                  <Badge variant="outline" className="bg-muted/50 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Hôm nay
                  </Badge>
                </div>
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Nhập tin nhắn..."
                  className="flex-1"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full"
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t py-2 z-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-around">
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Trang chủ</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-2 text-primary"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">Chat</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <PlaySquare className="h-5 w-5" />
              <span className="text-xs">Livestream</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="text-xs">Đơn hàng</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Cá nhân</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
