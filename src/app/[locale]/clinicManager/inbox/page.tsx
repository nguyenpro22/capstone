'use client';
import React, { useState } from "react";

const MessageManagement: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const users = [
    { id: 1, name: "User 1", image: "https://via.placeholder.com/40", unread: 0 },
    { id: 2, name: "User 2", image: "https://via.placeholder.com/40", unread: 1 },
    { id: 3, name: "User 3", image: "https://via.placeholder.com/40", unread: 1 },
    { id: 4, name: "User 4", image: "https://via.placeholder.com/40", unread: 5 },
    { id: 5, name: "User 5", image: "https://via.placeholder.com/40", unread: 0 },
  ];

  const messages = [
    { id: 1, content: "Hello!", sender: "me" },
    { id: 2, content: "How are you?", sender: "me" },
    { id: 3, content: "I'm fine, thank you!", sender: "user" },
    { id: 4, content: "What about you?", sender: "user" },
    { id: 5, content: "Great, thanks for asking!", sender: "me" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r">
        <h2 className="text-xl font-semibold px-4 py-4 border-b">Inbox</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user.id)}
              className={`flex items-center px-4 py-2 cursor-pointer ${
                selectedUser === user.id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">Last message...</p>
              </div>
              {user.unread > 0 && (
                <span className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {user.unread}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center">
            <img
              src="https://via.placeholder.com/40"
              alt="Selected User"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium">Selected User</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="text-gray-500 hover:text-gray-700">
              <span>⋮</span>
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              📞
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.sender === "me"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t bg-white flex items-center space-x-2">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            📷
          </button>
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 border rounded-full px-4 py-2"
          />
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            📎
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageManagement;
