"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Upload,
  History,
  ArrowRight,
  Loader2,
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import Image from "next/image";
import { useGetLiveStreamsQuery } from "@/features/livestream/api";
import LivestreamDetailModal from "@/components/clinicManager/livestream/livestream-detail-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from "@/features/event/api";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslations } from "next-intl";
import EventCreationWizard from "@/components/clinicManager/event/event-creation-wizard";
import EventEditForm from "@/components/clinicManager/event/event-edit-form";
import DeleteConfirmationDialog from "@/components/clinicManager/event/delete-confirmation-dialog";

interface LivestreamRoom {
  id: string;
  name: string;
  startDate: string;
  clinicId: string;
  clinicName: string;
  description?: string;
  coverImage?: string;
}

interface EventFormData {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  image?: File | null;
}

export default function LiveStreamPage() {
  const t = useTranslations("livestream");
  const router = useRouter();
  const [livestreamName, setLivestreamName] = useState<string>("");
  const [livestreamDescription, setLivestreamDescription] =
    useState<string>("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay
  const [activeTab, setActiveTab] = useState<string>("livestreams");

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Event management states
  const [eventPageIndex, setEventPageIndex] = useState<number>(0);
  const [eventPageSize] = useState<number>(10);
  const [eventSearchTerm, setEventSearchTerm] = useState<string>("");
  const debouncedEventSearchTerm = useDebounce(eventSearchTerm, 500); // 500ms delay
  const [isEventDialogOpen, setIsEventDialogOpen] = useState<boolean>(false);

  // Reset page index when search term changes
  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearchTerm]);

  // Reset event page index when event search term changes
  useEffect(() => {
    setEventPageIndex(0);
  }, [debouncedEventSearchTerm]);

  // Initialize with current date and time
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [eventFormData, setEventFormData] = useState<EventFormData>({
    name: "",
    description: "",
    startDate: now.toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
    endDate: tomorrow.toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
    image: null,
  });

  const [eventImagePreview, setEventImagePreview] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Add state for the modal
  const [selectedLivestreamId, setSelectedLivestreamId] = useState<
    string | null
  >(null);
  const [selectedLivestreamInfo, setSelectedLivestreamInfo] =
    useState<LivestreamRoom | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Add this RTK Query hook instead:
  const user = useSelector((state: RootState) => state?.auth?.user);
  const {
    data,
    isLoading: isLoadingHistory,
    refetch,
    error,
  } = useGetLiveStreamsQuery({
    clinicId: user?.clinicId || "",
    pageIndex,
    pageSize,
    searchTerm: debouncedSearchTerm,
  });

  // Event RTK Query hooks
  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useGetEventsQuery({
    clinicId: user?.clinicId || "",
    pageIndex: eventPageIndex,
    pageSize: eventPageSize,
    searchTerm: debouncedEventSearchTerm,
  });

  const [createEvent, { isLoading: isCreatingEvent }] =
    useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdatingEvent }] =
    useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeletingEvent }] =
    useDeleteEventMutation();

  // Extract the livestreams from the response with proper type handling
  const pastLivestreams = data?.value?.items || [];
  const pagination = data?.value || {
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  // Extract events data
  const events = eventsData?.value?.items || [];
  const eventsPagination = eventsData?.value || {
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  // Function to open the modal with the selected livestream
  const openLivestreamDetails = (livestream: LivestreamRoom) => {
    setSelectedLivestreamId(livestream.id);
    setSelectedLivestreamInfo(livestream);
    setIsModalOpen(true);
  };

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setCoverImage(base64String); // ✅ Save base64 string to state
        setCoverImagePreview(base64String); // ✅ Preview image
      };
      reader.readAsDataURL(file);
    }
  };

  // Event form handlers
  const resetEventForm = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setEventFormData({
      name: "",
      description: "",
      startDate: now.toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM for input
      endDate: tomorrow.toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM for input
      image: null,
    });
    setEventImagePreview("");
    setIsEditMode(false);
    setSelectedEventId(null);
  };

  const handleEventFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that end date is after start date
    const startDate = new Date(eventFormData.startDate);
    const endDate = new Date(eventFormData.endDate);

    if (endDate <= startDate) {
      toast.error(t("endDateMustBeAfterStartDate"));
      return;
    }

    // Validate image requirement when editing
    if (isEditMode && !eventImagePreview && !eventFormData.image) {
      toast.error(t("imageRequired"));
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      if (eventFormData.image) formData.append("image", eventFormData.image);
      formData.append("name", eventFormData.name);
      formData.append("description", eventFormData.description);
      formData.append(
        "startDate",
        new Date(eventFormData.startDate).toISOString()
      );
      formData.append("endDate", new Date(eventFormData.endDate).toISOString());
      formData.append("clinicId", user?.clinicId || "");

      if (isEditMode && selectedEventId) {
        await updateEvent({
          id: selectedEventId,
          formData,
        }).unwrap();
        toast.success(t("eventUpdatedSuccess"));
      } else {
        await createEvent(formData).unwrap();
        toast.success(t("eventCreatedSuccess"));
      }

      setIsEventDialogOpen(false);
      resetEventForm();
      refetchEvents();
    } catch (error: any) {
      console.error("Error saving event:", error);

      // Handle validation errors
      if (error.data && error.data.errors && Array.isArray(error.data.errors)) {
        // Display each validation error as a separate toast
        error.data.errors.forEach((err: { message: string }) => {
          toast.error(err.message);
        });
      } else if (error.data && error.data.detail) {
        // Display the general error message if available
        toast.error(error.data.detail);
      } else {
        // Fallback error message
        toast.error(t("failedToSaveEvent"));
      }
    }
  };

  const handleCreateLivestream = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCreating) return;
    if (!livestreamName.trim()) {
      alert(t("pleaseEnterName"));
      return;
    }

    try {
      setIsCreating(true);

      const livestreamData = {
        name: livestreamName,
        description: livestreamDescription,
        image: "coverImage", // ✅ Base64 encoded image
      };

      sessionStorage.setItem("livestreamData", JSON.stringify(livestreamData));
      router.push("/clinicManager/live-stream/host-page");
    } catch (error) {
      console.error("Error preparing livestream:", error);
      alert(t("errorPreparingLivestream"));
      setIsCreating(false);
    }
  };

  // Handle pagination
  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setPageIndex(pageIndex - 1);
    }
  };

  // Handle event pagination
  const handleEventNextPage = () => {
    if (eventsPagination.hasNextPage) {
      setEventPageIndex(eventPageIndex + 1);
    }
  };

  const handleEventPreviousPage = () => {
    if (eventsPagination.hasPreviousPage) {
      setEventPageIndex(eventPageIndex - 1);
    }
  };

  // Format date for better readability
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // Get time ago string
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Calculate time differences properly
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} ${diffDays > 1 ? t("daysAgo") : t("dayAgo")}`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours > 1 ? t("hoursAgo") : t("hourAgo")}`;
    } else if (diffMins > 0) {
      return `${diffMins} ${diffMins > 1 ? t("minutesAgo") : t("minuteAgo")}`;
    } else {
      return t("justNow");
    }
  };

  const openAddEventDialog = () => {
    setIsEditMode(false);
    setSelectedEventId(null);
    setIsEventDialogOpen(true);
    resetEventForm();
  };

  const openEditEventDialog = (event: any) => {
    setIsEditMode(true);
    setSelectedEventId(event.id);
    setIsEventDialogOpen(true);

    // Populate the form with the event data for editing
    setEventFormData({
      id: event.id,
      name: event.name,
      description: event.description,
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      endDate: new Date(event.endDate).toISOString().slice(0, 16),
      image: null, // Assuming you don't want to pre-fill the image
    });
    setEventImagePreview(event.imageUrl || "");
  };

  // Open delete confirmation dialog
  const openDeleteConfirmation = (id: string) => {
    setEventToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      await deleteEvent(eventToDelete).unwrap();
      toast.success(t("eventDeletedSuccess"));
      refetchEvents();
    } catch (error: any) {
      console.error("Error deleting event:", error);

      // Handle validation errors
      if (error.data && error.data.errors && Array.isArray(error.data.errors)) {
        // Display each validation error as a separate toast
        error.data.errors.forEach((err: { message: string }) => {
          toast.error(err.message);
        });
      } else if (error.data && error.data.detail) {
        // Display the general error message if available
        toast.error(error.data.detail);
      } else {
        // Fallback error message
        toast.error(t("failedToDeleteEvent"));
      }
    } finally {
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  // Add this CSS helper function to limit image sizes in HTML content
  const renderHTML = (htmlContent: string) => {
    // Process HTML to limit image sizes
    const processedHTML = htmlContent.replace(
      /<img\s/g,
      '<img style="max-height: 20px; max-width: 100px; object-fit: contain; display: inline-block; vertical-align: middle;" '
    );

    return { __html: processedHTML };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/30 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-rose-100 dark:border-rose-900/30">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-rose-700 dark:text-rose-400">
            {t("livestreamManagement")}
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs
          defaultValue="livestreams"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 p-1 rounded-xl">
            <TabsTrigger
              value="livestreams"
              className="text-base data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-rose-600 dark:data-[state=active]:text-rose-400 data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              <Camera className="mr-2 h-4 w-4" />
              {t("livestreams")}
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="text-base data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-rose-600 dark:data-[state=active]:text-rose-400 data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {t("events")}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="livestreams"
            className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-3 duration-300"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-rose-100 dark:border-rose-900/30">
              <form onSubmit={handleCreateLivestream} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {t("livestreamName")}*
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={livestreamName}
                        onChange={(e) => setLivestreamName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white"
                        placeholder={t("livestreamNamePlaceholder")}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {t("description")}
                      </label>
                      <textarea
                        id="description"
                        value={livestreamDescription}
                        onChange={(e) =>
                          setLivestreamDescription(e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white"
                        placeholder={t("livestreamDescriptionPlaceholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("coverImage")}
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
                          <Image
                            src={coverImagePreview || "/placeholder.svg"}
                            alt={t("coverPreview")}
                            width={200}
                            height={200}
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
                            {t("clickToUploadCoverImage")}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {t("imageFormatInfo")}
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
                        {t("creating")}
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-5 w-5" />
                        {t("startLivestream")}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Past Livestreams Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-rose-800 dark:text-rose-400 flex items-center">
                  <History className="mr-2 h-5 w-5" />
                  {t("pastLivestreams")}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t("searchLivestreams")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 pr-10 border border-rose-200 dark:border-rose-800/50 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white"
                    />
                    <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  </div>
                  <button
                    onClick={() => refetch()}
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
                    {t("refresh")}
                  </button>
                </div>
              </div>

              {isLoadingHistory ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-rose-500 dark:text-rose-400" />
                </div>
              ) : error ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-rose-100 dark:border-rose-800/30">
                  <div className="flex flex-col items-center">
                    <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-3 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-red-500 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                      {t("errorLoadingLivestreams")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {t("livestreamLoadingErrorMessage")}
                    </p>
                    <button
                      onClick={() => refetch()}
                      className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition"
                    >
                      {t("tryAgain")}
                    </button>
                  </div>
                </div>
              ) : pastLivestreams.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-rose-100 dark:border-rose-800/30 mx-auto">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-rose-200 dark:divide-rose-800/30">
                      <thead className="bg-rose-50 dark:bg-rose-900/20">
                        <tr className="text-center">
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                          >
                            {t("name")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                          >
                            {t("description")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                          >
                            {t("startDate")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                          >
                            {t("timeAgo")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                          >
                            {t("actions")}
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
                            style={{ cursor: "pointer" }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
                                  {room.coverImage ? (
                                    <Image
                                      src={
                                        room.coverImage || "/placeholder.svg"
                                      }
                                      alt=""
                                      width={40}
                                      height={40}
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
                            <td className="px-6 py-4 text-center">
                              <div
                                className="text-sm text-gray-900 dark:text-white truncate max-w-[200px] mx-auto"
                                title={room.description || t("noDescription")}
                              >
                                {room.description || t("noDescription")}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {formatDate(room.startDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300">
                                {getTimeAgo(room.startDate)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openLivestreamDetails(room);
                                }}
                                className="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 flex items-center justify-center mx-auto"
                              >
                                {t("viewDetails")}
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
                      {t("showing")}{" "}
                      <span className="font-medium">
                        {pastLivestreams.length}
                      </span>{" "}
                      {t("of")}{" "}
                      <span className="font-medium">
                        {pagination.totalCount}
                      </span>{" "}
                      {t("livestreams")}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className={`px-3 py-1 border border-rose-200 dark:border-rose-800/50 rounded-md text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 ${
                          !pagination.hasPreviousPage
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={handlePreviousPage}
                        disabled={!pagination.hasPreviousPage}
                      >
                        {t("previous")}
                      </button>
                      <button
                        className={`px-3 py-1 bg-rose-500 dark:bg-rose-600 text-white rounded-md text-sm hover:bg-rose-600 dark:hover:bg-rose-700 ${
                          !pagination.hasNextPage
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={handleNextPage}
                        disabled={!pagination.hasNextPage}
                      >
                        {t("next")}
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
                      {t("noPastLivestreams")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {t("noLivestreamsCreatedYet")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="events"
            className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-3 duration-300"
          >
            {/* Events Management Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-rose-800 dark:text-rose-400 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  {t("eventManagement")}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t("searchEvents")}
                      value={eventSearchTerm}
                      onChange={(e) => setEventSearchTerm(e.target.value)}
                      className="px-4 py-2 pr-10 border border-rose-200 dark:border-rose-800/50 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white"
                    />
                    <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  </div>
                  <button
                    onClick={() => refetchEvents()}
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
                    {t("refresh")}
                  </button>
                  <Button
                    onClick={openAddEventDialog}
                    className="bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("addEvent")}
                  </Button>
                </div>
              </div>

              {isLoadingEvents ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-rose-500 dark:text-rose-400" />
                </div>
              ) : events.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-rose-100 dark:border-rose-800/30 mx-auto">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-rose-200 dark:divide-rose-800/30">
                      <thead className="bg-rose-50 dark:bg-rose-900/20">
                        <tr className="text-center">
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                          >
                            {t("event")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                          >
                            {t("description")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                          >
                            {t("startDate")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                          >
                            {t("endDate")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-rose-800 dark:text-rose-300 uppercase tracking-wider"
                          >
                            {t("actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-rose-100 dark:divide-rose-800/30">
                        {events.map((event, index) => (
                          <tr
                            key={event.id}
                            className={
                              index % 2 === 0
                                ? "bg-white dark:bg-gray-800"
                                : "bg-rose-50/30 dark:bg-rose-900/10"
                            }
                            style={{ height: "48px" }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center overflow-hidden">
                                  {event.imageUrl ? (
                                    <Image
                                      src={event.imageUrl || "/placeholder.svg"}
                                      alt=""
                                      width={40}
                                      height={40}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <Calendar className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                                    {event.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div
                                className="text-sm text-gray-900 dark:text-white truncate max-w-[200px] mx-auto h-6 overflow-hidden"
                                title={
                                  event.description
                                    ? event.description.replace(/<[^>]*>/g, "")
                                    : t("noDescription")
                                }
                              >
                                {event.description ? (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: event.description,
                                    }}
                                    className="max-h-6 overflow-hidden"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 1,
                                      WebkitBoxOrient: "vertical",
                                    }}
                                  />
                                ) : (
                                  t("noDescription")
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {formatDate(event.startDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {formatDate(event.endDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => openEditEventDialog(event)}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    openDeleteConfirmation(event.id)
                                  }
                                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-6 py-3 border-t border-rose-100 dark:border-rose-800/30 flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t("showing")}{" "}
                      <span className="font-medium">{events.length}</span>{" "}
                      {t("of")}{" "}
                      <span className="font-medium">
                        {eventsPagination.totalCount}
                      </span>{" "}
                      {t("events")}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className={`px-3 py-1 border border-rose-200 dark:border-rose-800/50 rounded-md text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 ${
                          !eventsPagination.hasPreviousPage
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={handleEventPreviousPage}
                        disabled={!eventsPagination.hasPreviousPage}
                      >
                        {t("previous")}
                      </button>
                      <button
                        className={`px-3 py-1 bg-rose-500 dark:bg-rose-600 text-white rounded-md text-sm hover:bg-rose-600 dark:hover:bg-rose-700 ${
                          !eventsPagination.hasNextPage
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={handleEventNextPage}
                        disabled={!eventsPagination.hasNextPage}
                      >
                        {t("next")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-rose-100 dark:border-rose-800/30">
                  <div className="flex flex-col items-center">
                    <div className="bg-rose-100 dark:bg-rose-900/30 rounded-full p-3 mb-4">
                      <Calendar className="h-8 w-8 text-rose-500 dark:text-rose-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                      {t("noEventsFound")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {t("noEventsCreatedYet")}
                    </p>
                    <Button
                      onClick={openAddEventDialog}
                      className="bg-rose-500 hover:bg-rose-600 text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("createFirstEvent")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Livestream Detail Modal */}
      <LivestreamDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        livestreamId={selectedLivestreamId}
        livestreamInfo={selectedLivestreamInfo}
      />

      {/* Event Form Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-lg overflow-hidden p-0 max-h-[95vh]">
          {isEditMode ? (
            <EventEditForm
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              eventImagePreview={eventImagePreview}
              setEventImagePreview={setEventImagePreview}
              onSuccess={refetchEvents}
              isLoading={isUpdatingEvent}
              onClose={() => setIsEventDialogOpen(false)}
            />
          ) : (
            <EventCreationWizard
              isOpen={isEventDialogOpen}
              onClose={() => setIsEventDialogOpen(false)}
              isEditMode={false}
              onSuccess={refetchEvents}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setEventToDelete(null);
        }}
        onConfirm={handleDeleteEvent}
        isDeleting={isDeletingEvent}
      />
    </div>
  );
}
