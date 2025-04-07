"use client";

import { useState, type FormEvent } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border border-rose-300 rounded-lg px-4 py-2 bg-rose-50 focus:ring-rose-500 focus:border-rose-500 outline-none"
          placeholder={placeholder}
        />
        <button
          type="submit"
          className="ml-2 bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition"
        >
          ➡️
        </button>
      </div>
    </form>
  );
}
