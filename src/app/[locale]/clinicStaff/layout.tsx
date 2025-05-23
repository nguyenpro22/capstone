"use client";
import { useState } from "react";
import type React from "react";
import { ChevronRight } from "lucide-react";

import Sidebar from "@/components/common/Admin/Sidebar";
import Navbar from "@/components/common/Admin/Navbar";

export default function ClinicStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-[#FFF5F7] dark:bg-gray-950">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-950 shadow-md dark:shadow-gray-900 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          role="clinicStaff"
          onClose={() => setSidebarOpen(false)}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Sticky Navbar */}
        <div className="sticky top-0 left-0 right-0 z-30 bg-white dark:bg-gray-950 shadow-sm">
          <div className="relative">
            {!isSidebarOpen && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                <button
                  onClick={toggleSidebar}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Open sidebar"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            )}
            <Navbar sidebarClosed={!isSidebarOpen} />
          </div>
        </div>

        {/* Content */}
        <main className="p-6 bg-[#FFF5F7] dark:bg-gray-950 dark:text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
