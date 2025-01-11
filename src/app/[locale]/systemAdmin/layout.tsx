'use client'
import { useState } from 'react';
import Sidebar from '@/components/systemAdmin/Sidebar';
import Navbar from '@/components/systemAdmin/Navbar';

export default function SystemAdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar role="systemAdmin" />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Navbar */}
        <div
          className="sticky top-0 z-50 flex items-center bg-white shadow-md px-4 py-2"
        >
          {/* Hamburger Button */}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 shadow-md"
          >
            &#9776; {/* Icon */}
          </button>

          {/* Rest of Navbar */}
          <Navbar />
        </div>

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
