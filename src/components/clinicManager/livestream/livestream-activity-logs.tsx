"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import Image from "next/image";

interface LivestreamActivityLogsProps {
  analyticsData: any;
  isLoading: boolean;
  onRefetch: () => void;
  livestreamId: string | null;
  initialActiveTab: string;
  onTabChange: (tab: string) => void;
  allLogsData: any;
  currentPage: number;
  onPageChange: (page: number) => void;
  tabCounts: {
    all: number;
    joins: number;
    messages: number;
    reactions: number;
  };
  forceRender: number;
}

export default function LivestreamActivityLogs({
  analyticsData,
  isLoading,
  onRefetch,
  livestreamId,
  initialActiveTab,
  onTabChange,
  allLogsData,
  currentPage,
  onPageChange,
  tabCounts,
  forceRender,
}: LivestreamActivityLogsProps) {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [manualRefetch, setManualRefetch] = useState(false);

  // Update local active tab when parent changes it
  useEffect(() => {
    setActiveTab(initialActiveTab);
  }, [initialActiveTab]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange(value);
  };

  // Handle manual refetch
  const handleRefetch = () => {
    if (isLoading) return;
    setManualRefetch(true);
    onRefetch();
    setTimeout(() => setManualRefetch(false), 1000);
  };

  // Get the current logs data based on active tab
  const getCurrentLogs = () => {
    let logs = null;

    switch (activeTab) {
      case "joins":
        logs = allLogsData.joins?.value?.logs;
        break;
      case "messages":
        logs = allLogsData.messages?.value?.logs;
        break;
      case "reactions":
        logs = allLogsData.reactions?.value?.logs;
        break;
      default:
        logs = allLogsData.all?.value?.logs;
        break;
    }

    return logs;
  };

  const logs = getCurrentLogs();

  // Log the current page and logs data for debugging
  console.log("Current page in ActivityLogs:", currentPage);
  console.log("Current logs data:", logs);

  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
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

  // Get the log type label
  const getLogTypeLabel = (type: string) => {
    switch (type) {
      case "0":
        return "Join";
      case "1":
        return "Message";
      case "2":
        return "Reaction";
      default:
        return "Activity";
    }
  };

  // Get the log type color
  const getLogTypeColor = (type: string) => {
    switch (type) {
      case "0":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "1":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "2":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Add this effect to update tab counts when data changes
  useEffect(() => {
    // This assumes the parent component is passing the correct tabCounts
    // If not, you may need to calculate them here based on allLogsData
    console.log("Tab counts updated:", tabCounts);
  }, [allLogsData, tabCounts, forceRender]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
          Activity Logs
        </h4>

        {!isLoading && (
          <button
            onClick={handleRefetch}
            className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 p-1 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            aria-label="Refresh logs"
          >
            <RefreshCw
              className={`h-4 w-4 ${manualRefetch ? "animate-spin" : ""}`}
            />
          </button>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All ({tabCounts.all})
          </TabsTrigger>
          <TabsTrigger value="joins" className="text-xs sm:text-sm">
            Joins ({tabCounts.joins})
          </TabsTrigger>
          <TabsTrigger value="messages" className="text-xs sm:text-sm">
            Messages ({tabCounts.messages})
          </TabsTrigger>
          <TabsTrigger value="reactions" className="text-xs sm:text-sm">
            Reactions ({tabCounts.reactions})
          </TabsTrigger>
        </TabsList>

        {/* All Tabs Content */}
        {["all", "joins", "messages", "reactions"].map((tabId) => (
          <TabsContent key={tabId} value={tabId} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-rose-500 dark:text-rose-400" />
              </div>
            ) : !logs?.items?.length ? (
              <div className="text-center py-8 border rounded-md border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  No activity logs found
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {logs.items.map((log: any) => (
                    <div
                      key={log.id}
                      className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800/50 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {log.profilePictureUrl ? (
                            <Image
                              src={log.profilePictureUrl || "/placeholder.svg"}
                              alt={log.fullName}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-gray-500 dark:text-gray-400 text-sm">
                                {log.fullName?.charAt(0) || "U"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {log.fullName || "Unknown User"}
                            </h5>

                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${getLogTypeColor(
                                log.logType
                              )}`}
                            >
                              {getLogTypeLabel(log.logType)}
                            </span>

                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                              {getTimeAgo(log.createdOnUtc)}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                            {log.email}
                          </p>

                          {log.message && (
                            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-sm text-gray-700 dark:text-gray-300">
                              {log.logType === "2" ? (
                                <>
                                  {log.message === "1" && (
                                    <span>👍 Looks great!</span>
                                  )}
                                  {log.message === "2" && (
                                    <span>❤️ Love it!</span>
                                  )}
                                  {log.message === "3" && (
                                    <span>🔥 That's fire!</span>
                                  )}
                                  {log.message === "4" && (
                                    <span>👏 Amazing work!</span>
                                  )}
                                  {log.message === "5" && (
                                    <span>😍 Beautiful!</span>
                                  )}
                                  {!["1", "2", "3", "4", "5"].includes(
                                    log.message
                                  ) && <span>{log.message}</span>}
                                </>
                              ) : (
                                log.message
                              )}
                            </div>
                          )}

                          <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            {formatDate(log.createdOnUtc)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {analyticsData?.logs && analyticsData.logs.totalCount > 0 && (
                  <div className="mt-4 border-t pt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      Showing {logs.items.length} of {logs.totalCount} logs
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          onPageChange &&
                          onPageChange(
                            Math.max(
                              (analyticsData?.logs?.pageIndex || 1) - 1,
                              1
                            )
                          )
                        }
                        disabled={!logs.hasPreviousPage}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="px-2">
                        Page {analyticsData?.logs?.pageIndex || 1} of{" "}
                        {analyticsData?.logs
                          ? Math.ceil(
                              analyticsData.logs.totalCount /
                                analyticsData.logs.pageSize
                            )
                          : 1}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          onPageChange &&
                          onPageChange(
                            (analyticsData?.logs?.pageIndex || 1) + 1
                          )
                        }
                        disabled={!logs.hasNextPage}
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
