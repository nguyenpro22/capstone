import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Tải động LangToggle
const LangToggle = dynamic(() => import("@/components/common/LangToggle"), {
  ssr: false,
});

export default function Navbar({ children }: { children?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between w-full px-4 py-4">
      {/* Thanh tìm kiếm nằm sát mép trái màn hình */}
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Các biểu tượng và thông tin người dùng nằm sát mép phải màn hình */}
      <div className="flex items-center space-x-4">
        {/* Thông báo */}
        <div className="relative">
          <button className="relative text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11.5a6.5 6.5 0 10-13 0v2.658c0 .538-.214 1.055-.595 1.437L3 17h5m7 0a3.001 3.001 0 01-6 0m6 0H9"
              />
            </svg>
          </button>
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </div>

        {/* Chọn ngôn ngữ */}
        <LangToggle />

        {/* Thông tin người dùng */}
        <div className="flex items-center space-x-2">
          <Image
            src="https://via.placeholder.com/40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
            width={96} // Thay đổi kích thước phù hợp
            height={96}
          />
          <div>
            <p className="text-sm font-medium text-gray-800">Moni Roy</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
