"use client";
import { useState, useEffect } from "react";
import type React from "react";
import Sidebar from "@/components/common/Admin/Sidebar";
import Navbar from "@/components/common/Admin/Navbar";
import { ChevronRight } from "lucide-react";

export default function SystemAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);

      // Auto-close sidebar on mobile when first loading
      if (window.innerWidth < 768 && isSidebarOpen) {
        setSidebarOpen(false);
      }

      // Auto-open sidebar on desktop when resizing from mobile
      if (window.innerWidth >= 768 && !isSidebarOpen) {
        setSidebarOpen(true);
      }
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-[#FFF5F7] dark:bg-gray-950">
      {/* Sidebar - Only use fixed positioning on desktop */}
      <div
        className={`${
          isMobile
            ? "hidden"
            : "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-950 shadow-md dark:shadow-gray-900 transform transition-transform duration-300"
        } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar
          role="systemAdmin"
          onClose={() => setSidebarOpen(false)}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* Mobile Sidebar - Rendered separately but not positioned */}
      {isMobile && (
        <Sidebar
          role="systemAdmin"
          onClose={() => setSidebarOpen(false)}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      )}

      {/* Main Content - Adjust margin only on desktop */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isSidebarOpen && !isMobile ? "ml-64" : "ml-0"
        }`}
      >
        {/* Sticky Navbar */}
        <div className="sticky top-0 left-0 right-0 z-30 bg-white dark:bg-gray-950 shadow-sm">
          <div className="relative">
            {!isSidebarOpen && !isMobile && (
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
        <main className="p-4 md:p-3 bg-[#FFF5F7] dark:bg-gray-950 dark:text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
