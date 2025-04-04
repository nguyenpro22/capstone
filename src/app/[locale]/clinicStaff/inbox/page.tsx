"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Send } from "lucide-react"

// Sample data
const conversations = [
  {
    id: 1,
    name: "Emma Thompson",
    lastMessage: "When is my next appointment?",
    time: "10:30 AM",
    unread: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "James Wilson",
    lastMessage: "I need to reschedule my session",
    time: "Yesterday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Sophia Garcia",
    lastMessage: "Thanks for the great service!",
    time: "Yesterday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Michael Brown",
    lastMessage: "Do you have any openings tomorrow?",
    time: "Mar 25",
    unread: 1,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const messages = [
  {
    id: 1,
    sender: "Emma Thompson",
    content: "Hi, I was wondering when my next appointment is scheduled?",
    time: "10:15 AM",
    isMe: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    sender: "Me",
    content: "Hello Emma! Let me check that for you.",
    time: "10:18 AM",
    isMe: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    sender: "Me",
    content: "I can see you're scheduled for a Facial Treatment on April 5th at 2:00 PM.",
    time: "10:20 AM",
    isMe: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    sender: "Emma Thompson",
    content: "Perfect, thank you! Will I get a reminder?",
    time: "10:25 AM",
    isMe: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    sender: "Emma Thompson",
    content: "Also, should I do anything to prepare for the treatment?",
    time: "10:30 AM",
    isMe: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function InboxPage() {
  const [activeConversation, setActiveConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inbox</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <Card className="md:col-span-1 overflow-hidden flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="h-8" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <div className="divide-y">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${activeConversation === conversation.id ? "bg-gray-50" : ""}`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conversation.name}</h3>
                        <span className="text-xs text-muted-foreground">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="bg-pink-500 hover:bg-pink-600">{conversation.unread}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 overflow-hidden flex flex-col">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>ET</AvatarFallback>
              </Avatar>
              <CardTitle className="text-base">Emma Thompson</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-2 max-w-[80%] ${message.isMe ? "flex-row-reverse" : ""}`}>
                  {!message.isMe && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.isMe ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.content}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">{message.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button className="gap-2">
                <Send size={16} />
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

