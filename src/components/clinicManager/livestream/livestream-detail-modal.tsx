"use client";

import { useEffect } from "react";
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
import { LivestreamRoom } from "@/features/livestream/types";

interface LivestreamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  livestreamId: string | null;
  livestreamInfo: LivestreamRoom | null;
}

export default function LivestreamDetailModal({
  isOpen,
  onClose,
  livestreamId,
  livestreamInfo,
}: LivestreamDetailModalProps) {
  // Only run the query if we have a livestreamId and the modal is open
  const shouldSkip = !livestreamId || !isOpen;

  // Fetch livestream details using the ID
  const {
    data: livestreamData,
    isLoading,
    error,
    refetch,
  } = useGetLiveStreamByIdQuery(
    livestreamId || "", // Provide a default value to avoid undefined
    {
      skip: shouldSkip,
    }
  );

  // The analytics data comes from the API
  const analytics = livestreamData?.value;

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

  if (!isOpen) return null;

  // Safe refetch function that handles the case where refetch might not be available
  const handleRefetch = () => {
    if (typeof refetch === "function") {
      refetch();
    }
  };

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
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-rose-500 dark:text-rose-400" />
                    </div>
                  ) : error ? (
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
                  ) : analytics ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {/* Viewers */}
                      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 text-center">
                        <UserPlus className="h-6 w-6 mx-auto mb-2 text-rose-600 dark:text-rose-400" />
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {formatNumber(analytics.joinCount)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Viewers
                        </p>
                      </div>

                      {/* Messages */}
                      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 text-center">
                        <MessageSquare className="h-6 w-6 mx-auto mb-2 text-rose-600 dark:text-rose-400" />
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {formatNumber(analytics.messageCount)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Messages
                        </p>
                      </div>

                      {/* Reactions */}
                      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 text-center">
                        <Heart className="h-6 w-6 mx-auto mb-2 text-rose-600 dark:text-rose-400" />
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {formatNumber(analytics.reactionCount)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Reactions
                        </p>
                      </div>

                      {/* Activities */}
                      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 text-center">
                        <Activity className="h-6 w-6 mx-auto mb-2 text-rose-600 dark:text-rose-400" />
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {formatNumber(analytics.totalActivities)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Total Activities
                        </p>
                      </div>

                      {/* Bookings */}
                      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 text-center">
                        <BookOpen className="h-6 w-6 mx-auto mb-2 text-rose-600 dark:text-rose-400" />
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {formatNumber(analytics.totalBooking)}
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
