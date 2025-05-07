"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGetLiveStreamByIdQuery } from "@/features/livestream/api";
import {
  Camera,
  Users,
  Calendar,
  X,
  Loader2,
  ExternalLink,
  MessageSquare,
  Heart,
  Activity,
  BookOpen,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import type {
  LivestreamRoom,
  LivestreamRoomDetail,
} from "@/features/livestream/types";
import LivestreamActivityLogs from "./livestream-activity-logs";

interface LivestreamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  livestreamId: string | null;
  livestreamInfo: LivestreamRoom | null;
}

// Define the structure of the logs data
interface LogsData {
  items: Array<{
    id: string;
    userId: string;
    email: string;
    fullName: string;
    phone: string | null;
    profilePictureUrl: string | null;
    logType: string;
    message: string | null;
    createdOnUtc: string;
  }>;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Define the structure of the analytics data with logs
interface LivestreamAnalytics extends LivestreamRoomDetail {
  logs?: LogsData;
}

// Define the structure of the logs data
interface AllLogsData {
  all: { value?: LivestreamAnalytics } | null;
  joins: { value?: LivestreamAnalytics } | null;
  messages: { value?: LivestreamAnalytics } | null;
  reactions: { value?: LivestreamAnalytics } | null;
}

export default function LivestreamDetailModal({
  isOpen,
  onClose,
  livestreamId,
  livestreamInfo,
}: LivestreamDetailModalProps) {
  const logsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [manualRefetch, setManualRefetch] = useState<boolean>(false);
  const [forceRender, setForceRender] = useState<number>(0); // Add a counter to force re-renders
  const [initialLoad, setInitialLoad] = useState<boolean>(true); // Track initial load

  // Add a separate state for tab counts to ensure they're always up-to-date
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    joins: 0,
    messages: 0,
    reactions: 0,
  });

  // Store all fetched data for different types
  const [allLogsData, setAllLogsData] = useState<AllLogsData>({
    all: null,
    joins: null,
    messages: null,
    reactions: null,
  });

  // Only enable fetching after the modal is fully open
  useEffect(() => {
    if (isOpen && livestreamId) {
      // Delay fetching to ensure modal is fully rendered
      const timer = setTimeout(() => {
        setShouldFetch(true);
        setInitialLoad(true); // Reset initial load flag when modal opens
      }, 300);
      return () => {
        clearTimeout(timer);
        setShouldFetch(false);
      };
    }
  }, [isOpen, livestreamId]);

  // Memoize query parameters to prevent unnecessary re-renders
  const allQueryParams = useCallback(() => {
    console.log(`Creating all query params with pageIndex: ${currentPage}`);
    return livestreamId
      ? { id: livestreamId, pageIndex: currentPage, pageSize: 6 }
      : "skip";
  }, [livestreamId, currentPage]);

  const joinsQueryParams = useCallback(() => {
    console.log(`Creating joins query params with pageIndex: ${currentPage}`);
    return livestreamId
      ? { id: livestreamId, type: 0, pageIndex: currentPage, pageSize: 6 }
      : "skip";
  }, [livestreamId, currentPage]);

  const messagesQueryParams = useCallback(() => {
    console.log(
      `Creating messages query params with pageIndex: ${currentPage}`
    );
    return livestreamId
      ? { id: livestreamId, type: 1, pageIndex: currentPage, pageSize: 6 }
      : "skip";
  }, [livestreamId, currentPage]);

  const reactionsQueryParams = useCallback(() => {
    console.log(
      `Creating reactions query params with pageIndex: ${currentPage}`
    );
    return livestreamId
      ? { id: livestreamId, type: 2, pageIndex: currentPage, pageSize: 6 }
      : "skip";
  }, [livestreamId, currentPage]);

  // Only run the query if we have a livestreamId, the modal is open, and shouldFetch is true
  const shouldSkipBase = !livestreamId || !isOpen || !shouldFetch;

  // IMPORTANT: On initial load, fetch ALL data types regardless of active tab
  // After initial load, only fetch the active tab unless manually refreshing
  const shouldSkipAll =
    shouldSkipBase || (!initialLoad && activeTab !== "all" && !manualRefetch);
  const shouldSkipJoins =
    shouldSkipBase || (!initialLoad && activeTab !== "joins" && !manualRefetch);
  const shouldSkipMessages =
    shouldSkipBase ||
    (!initialLoad && activeTab !== "messages" && !manualRefetch);
  const shouldSkipReactions =
    shouldSkipBase ||
    (!initialLoad && activeTab !== "reactions" && !manualRefetch);

  // Fetch all data (no type filter)
  const {
    data: allData,
    isLoading: isLoadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useGetLiveStreamByIdQuery(allQueryParams(), {
    skip: shouldSkipAll,
    // Only refetch when explicitly triggered or when parameters change
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Fetch joins data (type=0)
  const {
    data: joinsData,
    isLoading: isLoadingJoins,
    error: errorJoins,
    refetch: refetchJoins,
  } = useGetLiveStreamByIdQuery(joinsQueryParams(), {
    skip: shouldSkipJoins,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Fetch messages data (type=1)
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: errorMessages,
    refetch: refetchMessages,
  } = useGetLiveStreamByIdQuery(messagesQueryParams(), {
    skip: shouldSkipMessages,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Fetch reactions data (type=2)
  const {
    data: reactionsData,
    isLoading: isLoadingReactions,
    error: errorReactions,
    refetch: refetchReactions,
  } = useGetLiveStreamByIdQuery(reactionsQueryParams(), {
    skip: shouldSkipReactions,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Update the allLogsData state when data is fetched
  useEffect(() => {
    if (allData) {
      console.log("All data updated:", allData);
      // Force a complete state update by creating a new object
      setAllLogsData((prev) => {
        const newState = {
          ...prev,
          all: { ...allData }, // Create a new object reference to ensure React detects the change
        };
        console.log("New allLogsData state after all update:", newState);
        return newState;
      });

      // Update tab counts when all data is fetched
      if (allData.value) {
        setTabCounts((prev) => ({
          ...prev,
          all: allData.value?.logs?.totalCount || 0,
        }));
      }

      // Force a re-render to ensure UI updates
      setForceRender((prev) => prev + 1);
    }
  }, [allData]);

  useEffect(() => {
    if (joinsData) {
      console.log("Joins data updated:", joinsData);
      setAllLogsData((prev) => {
        const newState = {
          ...prev,
          joins: { ...joinsData }, // Create a new object reference
        };
        console.log("New allLogsData state after joins update:", newState);
        return newState;
      });

      // Update joins tab count
      if (joinsData.value) {
        setTabCounts((prev) => ({
          ...prev,
          joins: joinsData.value?.logs?.totalCount || 0,
        }));
      }

      // Force a re-render to ensure UI updates
      setForceRender((prev) => prev + 1);
    }
  }, [joinsData]);

  useEffect(() => {
    if (messagesData) {
      console.log("Messages data updated:", messagesData);
      setAllLogsData((prev) => {
        const newState = {
          ...prev,
          messages: { ...messagesData }, // Create a new object reference
        };
        console.log("New allLogsData state after messages update:", newState);
        return newState;
      });

      // Update messages tab count
      if (messagesData.value) {
        setTabCounts((prev) => ({
          ...prev,
          messages: messagesData.value?.logs?.totalCount || 0,
        }));
      }

      // Force a re-render to ensure UI updates
      setForceRender((prev) => prev + 1);
    }
  }, [messagesData]);

  useEffect(() => {
    if (reactionsData) {
      console.log("Reactions data updated:", reactionsData);
      setAllLogsData((prev) => {
        const newState = {
          ...prev,
          reactions: { ...reactionsData }, // Create a new object reference
        };
        console.log("New allLogsData state after reactions update:", newState);
        return newState;
      });

      // Update reactions tab count
      if (reactionsData.value) {
        setTabCounts((prev) => ({
          ...prev,
          reactions: reactionsData.value?.logs?.totalCount || 0,
        }));
      }

      // Force a re-render to ensure UI updates
      setForceRender((prev) => prev + 1);
    }
  }, [reactionsData]);

  // Check if all data has been loaded on initial load
  useEffect(() => {
    if (initialLoad) {
      const allDataLoaded =
        allLogsData.all !== null &&
        allLogsData.joins !== null &&
        allLogsData.messages !== null &&
        allLogsData.reactions !== null;

      if (allDataLoaded) {
        console.log("Initial data load complete");
        setInitialLoad(false);
      }
    }
  }, [initialLoad, allLogsData]);

  // Force fetch all data types when modal first opens
  useEffect(() => {
    if (shouldFetch && initialLoad && livestreamId) {
      console.log("Initial load: fetching all data types");

      // Small delay to ensure queries are properly set up
      const timer = setTimeout(() => {
        // Start with the "all" tab data which should always be fetched first
        refetchAll().then(() => {
          // After the first query succeeds, try the others sequentially
          // This avoids trying to refetch queries that haven't been started
          return refetchJoins()
            .catch((err) => console.log("Joins data not started yet:", err))
            .then(() => refetchMessages())
            .catch((err) => console.log("Messages data not started yet:", err))
            .then(() => refetchReactions())
            .catch((err) => console.log("Reactions data not started yet:", err))
            .finally(() => {
              console.log("Initial data fetch attempts completed");
            });
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [
    shouldFetch,
    initialLoad,
    livestreamId,
    refetchAll,
    refetchJoins,
    refetchMessages,
    refetchReactions,
  ]);

  // Get the current data based on active tab
  const getCurrentData = useCallback(() => {
    console.log("Getting data for tab:", activeTab);
    console.log("Current allLogsData:", allLogsData);

    let result;
    switch (activeTab) {
      case "joins":
        result = allLogsData.joins?.value;
        break;
      case "messages":
        result = allLogsData.messages?.value;
        break;
      case "reactions":
        result = allLogsData.reactions?.value;
        break;
      default:
        result = allLogsData.all?.value;
        break;
    }

    console.log("Returning data for UI:", result);
    return result;
  }, [activeTab, allLogsData, forceRender]); // Add forceRender to dependencies to ensure this updates

  // Handle manual refetch - refetch all data types to ensure counts are updated
  const handleRefetch = () => {
    if (isLoading || shouldSkipBase) return;

    console.log("Triggering manual refetch for active data types");
    setManualRefetch(true);

    // Create an array of promises for queries that have been started
    const refetchPromises = [];

    // Only refetch queries that have been started (not skipped)
    if (!shouldSkipAll) {
      refetchPromises.push(refetchAll());
    }

    if (!shouldSkipJoins) {
      refetchPromises.push(refetchJoins());
    }

    if (!shouldSkipMessages) {
      refetchPromises.push(refetchMessages());
    }

    if (!shouldSkipReactions) {
      refetchPromises.push(refetchReactions());
    }

    // If no queries have been started, at least refetch the active tab
    if (refetchPromises.length === 0) {
      switch (activeTab) {
        case "joins":
          // Temporarily set shouldSkipJoins to false to start the query
          setShouldFetch(true);
          setTimeout(() => refetchJoins(), 0);
          break;
        case "messages":
          setShouldFetch(true);
          setTimeout(() => refetchMessages(), 0);
          break;
        case "reactions":
          setShouldFetch(true);
          setTimeout(() => refetchReactions(), 0);
          break;
        default: // "all"
          setShouldFetch(true);
          setTimeout(() => refetchAll(), 0);
          break;
      }
    } else {
      // Wait for all refetch operations to complete
      Promise.all(refetchPromises).finally(() => {
        setManualRefetch(false);
      });
    }
  };

  // Determine if any data is still loading based on the active tab
  const isLoading =
    (activeTab === "all" && isLoadingAll) ||
    (activeTab === "joins" && isLoadingJoins) ||
    (activeTab === "messages" && isLoadingMessages) ||
    (activeTab === "reactions" && isLoadingReactions) ||
    initialLoad; // Consider loading during initial load

  // The analytics data comes from the API
  const analytics = getCurrentData();

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAllLogsData({
        all: null,
        joins: null,
        messages: null,
        reactions: null,
      });
      setCurrentPage(1);
      setActiveTab("all");
      setForceRender(0);
      setTabCounts({
        all: 0,
        joins: 0,
        messages: 0,
        reactions: 0,
      });
      setInitialLoad(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get time ago string
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  // Handle card click to navigate to specific tab
  const handleCardClick = (tabName: string) => {
    // If changing tabs, reset to page 1
    if (tabName !== activeTab) {
      setCurrentPage(1);
    }

    setActiveTab(tabName);

    // Scroll to logs section
    if (logsRef.current) {
      logsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle tab change from the logs component
  const handleTabChange = (tabName: string) => {
    if (tabName !== activeTab) {
      // Reset to page 1 when changing tabs
      setCurrentPage(1);
      setActiveTab(tabName);
    }
  };

  // Handle page change - this will trigger a refetch for the active tab only
  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage) {
      console.log(
        `Page changing from ${currentPage} to ${newPage} for tab ${activeTab}`
      );

      // Update the page number
      setCurrentPage(newPage);

      // Log the updated state immediately after setting
      console.log(`Current page state updated to: ${newPage}`);

      // Force a refetch with the new page number
      // We need to use a timeout to ensure the state is updated
      setTimeout(() => {
        console.log(`Refetching with new page: ${newPage}`);

        // Only refetch the active tab data
        switch (activeTab) {
          case "joins":
            refetchJoins();
            break;
          case "messages":
            refetchMessages();
            break;
          case "reactions":
            refetchReactions();
            break;
          default: // "all"
            refetchAll();
            break;
        }
      }, 0);
    }
  };

  // Get the summary data for the analytics cards
  const getSummaryData = () => {
    // Use the all data for summary if available
    if (allLogsData.all?.value) {
      return allLogsData.all.value;
    }

    // If not, try to construct from individual data
    if (
      allLogsData.joins?.value &&
      allLogsData.messages?.value &&
      allLogsData.reactions?.value
    ) {
      const joins = allLogsData.joins.value;
      const messages = allLogsData.messages.value;
      const reactions = allLogsData.reactions.value;

      return {
        joinCount: joins.joinCount || 0,
        messageCount: messages.messageCount || 0,
        reactionCount: reactions.reactionCount || 0,
        totalActivities:
          (joins.joinCount || 0) +
          (messages.messageCount || 0) +
          (reactions.reactionCount || 0),
        totalBooking:
          joins.totalBooking ||
          messages.totalBooking ||
          reactions.totalBooking ||
          0,
      };
    }

    // Fallback to empty data
    return {
      joinCount: 0,
      messageCount: 0,
      reactionCount: 0,
      totalActivities: 0,
      totalBooking: 0,
    };
  };

  const summaryData = getSummaryData();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-rose-100 dark:border-rose-800/30">
          <h2 className="text-xl font-bold text-rose-700 dark:text-rose-400">
            Livestream Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          {!livestreamInfo ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No livestream data available.
              </p>
            </div>
          ) : (
            <>
              {/* Livestream Cover */}
              <div className="relative h-64 bg-rose-100 dark:bg-rose-900/30">
                {livestreamInfo.coverImage ? (
                  <Image
                    src={livestreamInfo.coverImage || "/placeholder.svg"}
                    alt={livestreamInfo.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="h-20 w-20 text-rose-300 dark:text-rose-700" />
                  </div>
                )}
              </div>

              {/* Livestream Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  {livestreamInfo.name}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Calendar className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Date
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {formatDate(livestreamInfo.startDate)}
                        </p>
                        <p className="text-sm text-rose-500 dark:text-rose-400">
                          {getTimeAgo(livestreamInfo.startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Users className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Clinic
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {livestreamInfo.clinicName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-rose-500 dark:text-rose-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          ID
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                          {livestreamInfo.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {livestreamInfo.description || "No description provided."}
                    </p>
                  </div>
                </div>

                {/* Analytics Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-rose-500 dark:text-rose-400" />
                      Livestream Analytics
                    </h4>

                    {/* Add refresh button for analytics */}
                    {!isLoading && (
                      <button
                        onClick={handleRefetch}
                        className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 p-1 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                        aria-label="Refresh analytics"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${
                            manualRefetch ? "animate-spin" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-rose-500 dark:text-rose-400" />
                    </div>
                  ) : errorAll && activeTab === "all" ? (
                    <div className="text-center py-4">
                      <p className="text-red-500 dark:text-red-400">
                        Failed to load analytics data
                      </p>
                      <button
                        onClick={handleRefetch}
                        className="mt-2 text-sm text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : summaryData ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {/* Viewers */}
                      <div
                        className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 text-center cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                        onClick={() => handleCardClick("joins")}
                        aria-label="View viewer logs"
                      >
                        <UserPlus className="h-6 w-6 mx-auto mb-2 text-rose-600 dark:text-rose-400" />
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {formatNumber(summaryData.joinCount)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Viewers
                        </p>
                      </div>

                      {/* Messages */}
                      <div
                        className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 text-center cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                        onClick={() => handleCardClick("messages")}
                        aria-label="View message logs"
                      >
                        <MessageSquare className="h-6 w-6 mx-auto mb-2 text-rose-600 dark:text-rose-400" />
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {formatNumber(summaryData.messageCount)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Messages
                        </p>
                      </div>

                      {/* Reactions */}
                      <div
                        className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 text-center cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                        onClick={() => handleCardClick("reactions")}
                        aria-label="View reaction logs"
                      >
                        <Heart className="h-6 w-6 mx-auto mb-2 text-rose-600 dark:text-rose-400" />
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {formatNumber(summaryData.reactionCount)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Reactions
                        </p>
                      </div>

                      {/* Activities */}
                      <div
                        className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 text-center cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                        onClick={() => handleCardClick("all")}
                        aria-label="View all activity logs"
                      >
                        <Activity className="h-6 w-6 mx-auto mb-2 text-rose-600 dark:text-rose-400" />
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {formatNumber(summaryData.totalActivities)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Total Activities
                        </p>
                      </div>

                      {/* Bookings */}
                      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 text-center">
                        <BookOpen className="h-6 w-6 mx-auto mb-2 text-rose-600 dark:text-rose-400" />
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {formatNumber(summaryData.totalBooking)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Bookings
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No analytics data available
                    </p>
                  )}
                </div>

                {/* Activity Logs Section */}
                <div className="mt-8 border-t pt-6" ref={logsRef}>
                  <LivestreamActivityLogs
                    analyticsData={analytics}
                    isLoading={isLoading}
                    onRefetch={handleRefetch}
                    livestreamId={livestreamId}
                    initialActiveTab={activeTab}
                    onTabChange={handleTabChange}
                    allLogsData={allLogsData}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    tabCounts={tabCounts} // Pass the tab counts to the child component
                    forceRender={forceRender} // Pass the force render counter to ensure child updates
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-rose-100 dark:border-rose-800/30 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>

          {livestreamInfo && (
            <button
              onClick={() =>
                window.open(
                  `/clinicManager/live-stream/host-page?roomId=${livestreamInfo.id}`,
                  "_blank"
                )
              }
              className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Full View
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
