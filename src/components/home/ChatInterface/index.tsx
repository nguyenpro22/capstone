"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: number
  sender: "user" | "clinic"
  content: string
  timestamp: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    // Fetch chat history here
    // For now, we'll use mock data
    const mockMessages: Message[] = [
      { id: 1, sender: "clinic", content: "Hello! How can we assist you today?", timestamp: "10:00 AM" },
      { id: 2, sender: "user", content: "I have a question about my upcoming appointment.", timestamp: "10:05 AM" },
      { id: 3, sender: "clinic", content: "Of course! What would you like to know?", timestamp: "10:07 AM" },
    ]
    setMessages(mockMessages)
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: "user",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMsg])
      setNewMessage("")
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat with Beauty Clinic</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                {message.content}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{message.timestamp}</div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  )
}

