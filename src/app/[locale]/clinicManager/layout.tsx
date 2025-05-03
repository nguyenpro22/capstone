"use client";

import type React from "react";

import { useEffect, useState, useLayoutEffect } from "react";
import Sidebar from "@/components/common/Admin/Sidebar";
import Navbar from "@/components/common/Admin/Navbar";
import { ChevronRight } from "lucide-react";
import FirstLoginFlow from "@/components/login/first-login-flow";
import { ReRegisterClinicForm } from "@/components/clinicManager/re-register-clinic-form";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ClinicManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("registerClinic");

  // Initialize with true, but we'll check the actual size before rendering
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  // Add a state to track if we've completed the initial size check
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  // First login flow state
  const [showFirstLoginFlow, setShowFirstLoginFlow] = useState(false);
  // Add state for rejected clinic
  const [isRejected, setIsRejected] = useState(false);

  const router = useRouter();

  // Function to check if we're on a real mobile device vs just a narrow viewport
  const isRealMobileDevice = () => {
    // Check for touch capability as a better indicator of a mobile device
    const hasTouchScreen =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    // Check for a narrow viewport
    const hasNarrowViewport = window.innerWidth < 768;

    // If it has touch AND a narrow viewport, it's likely a real mobile device
    // If it just has a narrow viewport (like when dev tools are open), it's probably not
    return hasTouchScreen && hasNarrowViewport;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Check for first login when the layout mounts
  useEffect(() => {
    // Check if it's a first login scenario
    const token = getAccessToken();
    if (token) {
      const tokenData = GetDataByToken(token) as TokenData;
      const isFirstLogin = tokenData?.isFirstLogin == "True";
      const IsRejected = tokenData?.isRejected == "true";

      if (isFirstLogin) {
        setShowFirstLoginFlow(true);
      }

      // Set the rejected state based on token data
      setIsRejected(IsRejected);
    }
  }, []);

  // Use useLayoutEffect to run before the browser paints
  // This helps prevent the flash of incorrect sidebar state
  useLayoutEffect(() => {
    // Only close the sidebar on initial load if it's a real mobile device
    const shouldCloseSidebar = isRealMobileDevice();
    setSidebarOpen(!shouldCloseSidebar);
    setInitialCheckComplete(true);

    // Store the sidebar state in localStorage to persist across refreshes
    const storedState = localStorage.getItem("sidebarOpen");
    if (storedState !== null) {
      setSidebarOpen(storedState === "true");
    }
  }, []);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    if (initialCheckComplete) {
      localStorage.setItem("sidebarOpen", String(isSidebarOpen));
    }
  }, [isSidebarOpen, initialCheckComplete]);

  useEffect(() => {
    // Function to handle resize events, including developer tools opening
    const handleResize = () => {
      // If we're not on a real mobile device but the viewport is narrow (like when dev tools are open)
      // and the sidebar is closed, we should open it
      if (!isRealMobileDevice() && !isSidebarOpen && window.innerWidth < 1200) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    // Also run once on mount to ensure correct initial state
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  // Handle completion of first login flow
  const handleFirstLoginComplete = () => {
    // IMPORTANT: We're not immediately hiding the FirstLoginFlow component anymore
    // The component itself will handle the redirection after showing the success dialog
    // setShowFirstLoginFlow(false) - This line is removed
  };

  // Handle completion of re-registration
  const handleReRegistrationComplete = () => {
    setIsRejected(false);
  };

  // Show the first login flow if needed
  if (showFirstLoginFlow) {
    return <FirstLoginFlow onComplete={() => setShowFirstLoginFlow(false)} />;
  }

  // Show the re-register form if the clinic is rejected
  if (isRejected) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] dark:bg-gray-950 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {t("reRegister.rejectedInformation")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {t("reRegister.updateInformation")}
            </p>
          </div>
          <ReRegisterClinicForm />
        </div>
      </div>
    );
  }

  // Don't render until we've completed the initial check
  if (!initialCheckComplete) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex min-h-screen bg-[#FFF5F7] dark:bg-gray-950">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-950 shadow-md dark:shadow-gray-900 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <Sidebar
          role="clinicManager"
          onClose={() => setSidebarOpen(false)}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "ml-0"
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
