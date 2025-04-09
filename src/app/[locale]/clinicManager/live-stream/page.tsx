"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, History, ArrowRight, Loader2 } from "lucide-react";
import { url } from "inspector";

interface LivestreamRoom {
  id: string;
  name: string;
  startDate: string;
  clinicId: string;
  clinicName: string;
  description?: string;
  coverImage?: string;
}

export default function LiveStreamPage() {
  const router = useRouter();
  const [livestreamName, setLivestreamName] = useState<string>("");
  const [livestreamDescription, setLivestreamDescription] =
    useState<string>("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [pastLivestreams, setPastLivestreams] = useState<LivestreamRoom[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateLivestream = async (e: React.FormEvent) => {
    e.preventDefault();

    // Evitar múltiples envíos simultáneos
    if (isCreating) {
      console.log("Room creation already in progress, please wait...");
      return;
    }

    if (!livestreamName.trim()) {
      alert("Please enter a name for your livestream");
      return;
    }

    try {
      setIsCreating(true);

      // Crear un objeto con la información del livestream
      const livestreamData = {
        name: livestreamName,
        description: livestreamDescription,
        image: coverImage,
        // Si necesitas enviar la imagen, puedes convertirla a base64 o usar FormData
      };

      // Guardar la información en sessionStorage para usarla en la página de host
      sessionStorage.setItem("livestreamData", JSON.stringify(livestreamData));

      // Si tienes la imagen, también puedes guardarla (aunque esto puede ser grande para sessionStorage)
      if (coverImagePreview) {
        sessionStorage.setItem("coverImagePreview", coverImagePreview);
      }

      console.log("Navigating to host page with data:", livestreamData);

      // Navegar a la página de host
      router.push("/clinicManager/live-stream/host-page");
    } catch (error) {
      console.error("Error preparing livestream:", error);
      alert(
        "An error occurred while preparing the livestream. Please try again."
      );
      setIsCreating(false);
    }
  };

  // Fetch past livestreams
  const fetchPastLivestreams = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch(
        "https://api.beautify.asia/signaling-api/LiveStream/Rooms?clinicId=78705cfa-7097-408f-93e2-70950fc886a3"
      );
      const data = await response.json();

      if (data.isSuccess) {
        setPastLivestreams(data.value);
      } else {
        console.error(
          "Failed to fetch livestream history:",
          data.error?.message
        );
      }
    } catch (error) {
      console.error("Error fetching livestream history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchPastLivestreams();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/30 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-rose-100 dark:border-rose-900/30">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-rose-700 dark:text-rose-400">
            Create New Livestream
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-rose-100 dark:border-rose-900/30">
          <form onSubmit={handleCreateLivestream} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Livestream Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={livestreamName}
                    onChange={(e) => setLivestreamName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Spring Skincare Routine"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={livestreamDescription}
                    onChange={(e) => setLivestreamDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe what your livestream will be about..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cover Image
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 h-[200px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                    coverImagePreview
                      ? "border-rose-300 dark:border-rose-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {coverImagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={coverImagePreview || "/placeholder.svg"}
                        alt="Cover preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverImage(null);
                          setCoverImagePreview("");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-600 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload a cover image
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-rose-600 hover:to-pink-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={!livestreamName.trim() || isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-5 w-5" />
                    Start Livestream
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Past Livestreams Section */}
      <div className="container mx-auto px-4 py-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-rose-800 dark:text-rose-400 flex items-center">
              <History className="mr-2 h-5 w-5" />
              Past Livestreams
            </h2>
            <button
              onClick={fetchPastLivestreams}
              className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 text-sm font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          {isLoadingHistory ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-rose-500 dark:text-rose-400" />
            </div>
          ) : pastLivestreams.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-rose-100 dark:border-rose-800/30">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-rose-200 dark:divide-rose-800/30">
                  <thead className="bg-rose-50 dark:bg-rose-900/20">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                      >
                        Clinic
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                      >
                        Start Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                      >
                        Time Ago
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-rose-100 dark:divide-rose-800/30">
                    {pastLivestreams.map((room, index) => (
                      <tr
                        key={room.id}
                        className={
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-rose-50/30 dark:bg-rose-900/10"
                        }
                        onClick={() =>
                          router.push(
                            `/clinicManager/live-stream/host-page?roomId=${room.id}`
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
                              {room.coverImage ? (
                                <img
                                  src={room.coverImage || "/placeholder.svg"}
                                  alt=""
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <Camera className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                                {room.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {room.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {room.clinicName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {formatDate(room.startDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300">
                            {getTimeAgo(room.startDate)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/clinicManager/live-stream/host-page?roomId=${room.id}`
                              );
                            }}
                            className="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 flex items-center justify-end"
                          >
                            View Details
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white dark:bg-gray-800 px-6 py-3 border-t border-rose-100 dark:border-rose-800/30 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-medium">{pastLivestreams.length}</span>{" "}
                  livestreams
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-rose-200 dark:border-rose-800/50 rounded-md text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-rose-500 dark:bg-rose-600 text-white rounded-md text-sm hover:bg-rose-600 dark:hover:bg-rose-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-rose-100 dark:border-rose-800/30">
              <div className="flex flex-col items-center">
                <div className="bg-rose-100 dark:bg-rose-900/30 rounded-full p-3 mb-4">
                  <History className="h-8 w-8 text-rose-500 dark:text-rose-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                  No Past Livestreams
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You haven&apos;t created any livestreams yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
