"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  ImageIcon,
  Send,
  Mic,
  Check,
  CheckCheck,
  Clock,
  Filter,
  Bell,
  Settings,
  User,
  MessageSquare,
  Calendar,
  Star,
  Trash2,
  X,
  Mail,
} from "lucide-react"

type UserType = {
  id: number
  name: string
  image: string
  status: "online" | "offline" | "away"
  lastSeen?: string
  unread: number
  lastMessage?: string
  lastMessageTime?: string
  isTyping?: boolean
}

type MessageType = {
  id: number
  content: string
  sender: "me" | "user"
  timestamp: string
  status?: "sent" | "delivered" | "read"
  attachments?: {
    type: "image" | "file"
    url: string
    name?: string
  }[]
}

const MessageManagement: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<number | null>(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isRecording, setIsRecording] = useState(false)

  const users: UserType[] = [
    {
      id: 1,
      name: "Emma Johnson",
      image: "https://placehold.co/40x40.png",
      status: "online",
      unread: 2,
      lastMessage: "I'll check the appointment schedule and get back to you",
      lastMessageTime: "10:42 AM",
    },
    {
      id: 2,
      name: "Liam Wilson",
      image: "https://placehold.co/40x40.png",
      status: "online",
      unread: 0,
      lastMessage: "Thanks for the information!",
      lastMessageTime: "Yesterday",
      isTyping: true,
    },
    {
      id: 3,
      name: "Olivia Martinez",
      image: "https://placehold.co/40x40.png",
      status: "away",
      lastSeen: "5m ago",
      unread: 0,
      lastMessage: "Can I reschedule my appointment to next week?",
      lastMessageTime: "Yesterday",
    },
    {
      id: 4,
      name: "Noah Thompson",
      image: "https://placehold.co/40x40.png",
      status: "offline",
      lastSeen: "2h ago",
      unread: 5,
      lastMessage: "I have a question about my treatment plan",
      lastMessageTime: "Wed",
    },
    {
      id: 5,
      name: "Ava Williams",
      image: "https://placehold.co/40x40.png",
      status: "online",
      unread: 0,
      lastMessage: "Perfect, see you then!",
      lastMessageTime: "Tue",
    },
  ]

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedUserData = users.find((user) => user.id === selectedUser)

  const messagesByDate: Record<string, MessageType[]> = {
    Today: [
      {
        id: 1,
        content: "Good morning! I wanted to check if my appointment for tomorrow is still confirmed?",
        sender: "user",
        timestamp: "09:30 AM",
        status: "read",
      },
      {
        id: 2,
        content: "Good morning! Yes, your appointment is confirmed for tomorrow at 2:00 PM with Dr. Smith.",
        sender: "me",
        timestamp: "09:45 AM",
        status: "read",
      },
      {
        id: 3,
        content: "Perfect, thank you! Should I bring anything specific with me?",
        sender: "user",
        timestamp: "10:15 AM",
        status: "read",
      },
      {
        id: 4,
        content:
          "Just your ID and insurance card. Also, please arrive 15 minutes early to complete any paperwork if needed.",
        sender: "me",
        timestamp: "10:30 AM",
        status: "delivered",
      },
      {
        id: 5,
        content: "I'll check the appointment schedule and get back to you",
        sender: "user",
        timestamp: "10:42 AM",
        status: "sent",
      },
      {
        id: 6,
        content: "Here's the information brochure about the procedure you asked for:",
        sender: "me",
        timestamp: "10:45 AM",
        status: "sent",
        attachments: [
          {
            type: "file",
            url: "#",
            name: "procedure_info.pdf",
          },
        ],
      },
    ],
    Yesterday: [
      {
        id: 7,
        content: "Do you have any dietary restrictions we should be aware of before your procedure?",
        sender: "me",
        timestamp: "03:20 PM",
        status: "read",
      },
      {
        id: 8,
        content: "I'm allergic to penicillin and I avoid dairy products.",
        sender: "user",
        timestamp: "04:05 PM",
        status: "read",
      },
      {
        id: 9,
        content: "Thank you for letting us know. I've updated your medical record with this information.",
        sender: "me",
        timestamp: "04:10 PM",
        status: "read",
      },
      {
        id: 10,
        content: "Here's a photo of the rash I mentioned during our last consultation:",
        sender: "user",
        timestamp: "05:30 PM",
        status: "read",
        attachments: [
          {
            type: "image",
            url: "https://placehold.co/300x200.png",
          },
        ],
      },
    ],
  }

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesByDate])

  const handleSendMessage = () => {
    if (newMessage.trim() === "" && !isRecording) return

    // In a real app, you would send the message to an API
    // and then update the state with the response

    setNewMessage("")
    setIsRecording(false)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Messages
          </h2>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-5 h-5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
                All
              </button>
              <button className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                Unread
              </button>
              <button className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                Important
              </button>
            </div>
            <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`flex items-center p-3 cursor-pointer transition-colors duration-150 ${
                  selectedUser === user.id
                    ? "bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 dark:border-purple-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent"
                }`}
              >
                <div className="relative">
                  <Image
                    src={user.image || "/placeholder.svg"}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                      user.status === "online"
                        ? "bg-green-500"
                        : user.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                    }`}
                  ></span>
                </div>

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.lastMessageTime}</p>
                  </div>

                  <div className="flex items-center">
                    {user.isTyping ? (
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">typing...</p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.lastMessage}</p>
                    )}
                  </div>
                </div>

                {user.unread > 0 && (
                  <span className="ml-2 flex-shrink-0 text-xs bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {user.unread}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
              <div className="flex items-center">
                <div className="relative cursor-pointer" onClick={() => setShowUserProfile(!showUserProfile)}>
                  <Image
                    src={selectedUserData?.image || "https://placehold.co/40x40.png" || "/placeholder.svg"}
                    alt={selectedUserData?.name || "User"}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                      selectedUserData?.status === "online"
                        ? "bg-green-500"
                        : selectedUserData?.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                    }`}
                  ></span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold dark:text-white">{selectedUserData?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedUserData?.status === "online"
                      ? "Online"
                      : selectedUserData?.status === "away"
                        ? `Away · Last seen ${selectedUserData?.lastSeen}`
                        : `Offline · Last seen ${selectedUserData?.lastSeen}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-900">
              {Object.entries(messagesByDate).map(([date, messages]) => (
                <div key={date} className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-1 rounded-full">
                      {date}
                    </div>
                  </div>

                  {messages.map((message, index) => {
                    const isConsecutive = index > 0 && messages[index - 1].sender === message.sender

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "me" ? "justify-end" : "justify-start"
                        } ${isConsecutive ? "mt-1" : "mt-4"}`}
                      >
                        {message.sender !== "me" && !isConsecutive && (
                          <div className="flex-shrink-0 mr-3">
                            <Image
                              src={selectedUserData?.image || "https://placehold.co/32x32.png" || "/placeholder.svg"}
                              alt={selectedUserData?.name || "User"}
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                            />
                          </div>
                        )}

                        <div className={`max-w-[70%] ${message.sender !== "me" && isConsecutive ? "ml-11" : ""}`}>
                          {/* Message content */}
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              message.sender === "me"
                                ? "bg-purple-600 text-white dark:bg-purple-700"
                                : "bg-white text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                            } ${
                              message.sender === "me"
                                ? isConsecutive
                                  ? "rounded-tr-sm"
                                  : ""
                                : isConsecutive
                                  ? "rounded-tl-sm"
                                  : ""
                            }`}
                          >
                            {message.content}

                            {/* Attachments */}
                            {message.attachments &&
                              message.attachments.map((attachment, i) => (
                                <div key={i} className="mt-2">
                                  {attachment.type === "image" ? (
                                    <div className="relative rounded-lg overflow-hidden">
                                      <Image
                                        src={attachment.url || "/placeholder.svg"}
                                        alt="Attachment"
                                        width={300}
                                        height={200}
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      className={`flex items-center p-2 rounded-md ${
                                        message.sender === "me"
                                          ? "bg-purple-700 dark:bg-purple-800"
                                          : "bg-gray-100 dark:bg-gray-700"
                                      }`}
                                    >
                                      <Paperclip
                                        className={`w-4 h-4 mr-2 ${
                                          message.sender === "me"
                                            ? "text-purple-200 dark:text-purple-300"
                                            : "text-gray-500 dark:text-gray-400"
                                        }`}
                                      />
                                      <span
                                        className={`text-sm ${
                                          message.sender === "me"
                                            ? "text-purple-100 dark:text-purple-200"
                                            : "text-gray-700 dark:text-gray-300"
                                        }`}
                                      >
                                        {attachment.name}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>

                          {/* Message metadata */}
                          <div
                            className={`flex items-center mt-1 text-xs ${
                              message.sender === "me" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span className="text-gray-500 dark:text-gray-400 mr-1">{message.timestamp}</span>
                            {message.sender === "me" && (
                              <span className="text-gray-500 dark:text-gray-400">
                                {message.status === "read" ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                                ) : message.status === "delivered" ? (
                                  <CheckCheck className="w-3.5 h-3.5" />
                                ) : message.status === "sent" ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center space-x-2">
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-5 h-5" />
              </button>

              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                <Paperclip className="w-5 h-5" />
              </button>

              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                <ImageIcon className="w-5 h-5" />
              </button>

              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={isRecording ? "Recording audio..." : "Type a message"}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className={`w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    isRecording
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                      : ""
                  }`}
                  disabled={isRecording}
                />
                {isRecording && (
                  <div className="absolute right-4 top-2.5 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                    <span className="text-xs text-red-600 dark:text-red-400">Recording...</span>
                  </div>
                )}
              </div>

              {newMessage.trim() ? (
                <button
                  className="p-2 rounded-full bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
                  onClick={handleSendMessage}
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <button
                  className={`p-2 rounded-full ${
                    isRecording
                      ? "bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-500"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  onClick={toggleRecording}
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Your Messages</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              Select a conversation from the list to start chatting or search for a specific user.
            </p>
            <button className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors">
              Start New Conversation
            </button>
          </div>
        )}
      </div>

      {/* User Profile Sidebar - Shown when user profile is clicked */}
      {showUserProfile && selectedUserData && (
        <div className="w-1/4 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 dark:text-white">Profile</h3>
            <button
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              onClick={() => setShowUserProfile(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex flex-col items-center border-b border-gray-200 dark:border-gray-700">
            <div className="relative mb-4">
              <Image
                src={selectedUserData.image || "/placeholder.svg"}
                alt={selectedUserData.name}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                  selectedUserData.status === "online"
                    ? "bg-green-500"
                    : selectedUserData.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                }`}
              ></span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{selectedUserData.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {selectedUserData.status === "online"
                ? "Online"
                : selectedUserData.status === "away"
                  ? `Away · Last seen ${selectedUserData.lastSeen}`
                  : `Offline · Last seen ${selectedUserData.lastSeen}`}
            </p>
            <div className="flex space-x-2 mt-2">
              <button className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                Contact Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm dark:text-white">
                      {selectedUserData.name.toLowerCase().replace(" ", ".")}
                      @example.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                    <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm dark:text-white">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Next Appointment</p>
                    <p className="text-sm dark:text-white">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Shared Files</h4>
              <div className="space-y-2">
                <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">procedure_info.pdf</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Today</span>
                </div>
                <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <ImageIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">rash_photo.jpg</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Yesterday</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Actions</h4>
              <div className="space-y-2">
                <button className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-left">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Add to favorites</span>
                </button>
                <button className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-left">
                  <Bell className="w-4 h-4 text-purple-500 dark:text-purple-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Mute notifications</span>
                </button>
                <button className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-left">
                  <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Delete conversation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker - Would be implemented with a proper emoji picker library in a real app */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-72">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium dark:text-white">Emoji</h4>
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowEmojiPicker(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {/* This would be populated by an emoji picker library */}
            {["😊", "😂", "❤️", "👍", "🙏", "🔥", "🎉", "👋", "😍", "🤔", "😢", "😎", "🤗", "😴", "🤢", "😇"].map(
              (emoji, index) => (
                <button
                  key={index}
                  className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
                  onClick={() => {
                    setNewMessage((prev) => prev + emoji)
                    setShowEmojiPicker(false)
                  }}
                >
                  {emoji}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageManagement
