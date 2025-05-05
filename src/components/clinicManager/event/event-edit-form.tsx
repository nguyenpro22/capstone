"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useUpdateEventMutation } from "@/features/event/api";
import { toast } from "react-toastify";

// Dynamically import QuillEditor to avoid SSR issues
const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full border rounded-md bg-muted/20 animate-pulse" />
  ),
});

interface EventFormData {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  image?: File | null;
  clinicId?: string;
}

interface EventEditFormProps {
  eventFormData: EventFormData;
  setEventFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  eventImagePreview: string;
  setEventImagePreview: React.Dispatch<React.SetStateAction<string>>;
  onSuccess?: () => void;
  isLoading?: boolean;
  onClose: () => void;
}

export default function EventEditForm({
  eventFormData,
  setEventFormData,
  eventImagePreview,
  setEventImagePreview,
  onSuccess,
  isLoading: externalLoading,
  onClose,
}: EventEditFormProps) {
  const t = useTranslations("livestream");
  const eventFileInputRef = useRef<HTMLInputElement>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const isLoading = externalLoading || isUpdating;

  // Ensure editor is loaded
  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  // Handle event image change
  const handleEventImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEventFormData({ ...eventFormData, image: file });

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setEventImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle event description change from QuillEditor
  const handleEventDescriptionChange = (value: string) => {
    setEventFormData({
      ...eventFormData,
      description: value,
    });
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

    if (!eventFormData.id) {
      toast.error("Event ID is missing");
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
      if (eventFormData.clinicId)
        formData.append("clinicId", eventFormData.clinicId);

      // Call the API
      await updateEvent({
        id: eventFormData.id,
        formData,
      }).unwrap();

      toast.success(t("eventUpdatedSuccess"));
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating event:", error);

      // Handle validation errors
      if (error.data && error.data.errors && Array.isArray(error.data.errors)) {
        error.data.errors.forEach((err: { message: string }) => {
          toast.error(err.message);
        });
      } else if (error.data && error.data.detail) {
        toast.error(error.data.detail);
      } else {
        toast.error(t("failedToSaveEvent"));
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <DialogHeader className="p-6 pb-2">
        <DialogTitle>{t("editEvent")}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleEventFormSubmit} className="flex flex-col h-full">
        <div
          className="px-6 py-4 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 130px)" }}
        >
          <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="event-name" className="text-sm font-medium">
                {t("name")}*
              </label>
              <Input
                id="event-name"
                value={eventFormData.name}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Description field with better height and spacing */}
            <div className="grid grid-cols-1 gap-2">
              <label
                htmlFor="event-description"
                className="text-sm font-medium"
              >
                {t("description")}
              </label>
              <div>
                {editorLoaded && (
                  <div className="mb-8">
                    <div className="border rounded-md">
                      <QuillEditor
                        value={eventFormData.description}
                        onChange={handleEventDescriptionChange}
                        placeholder={t("enterEventDescription")}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Add more spacing before the date fields */}
            <div className="grid grid-cols-1 gap-2 mt-8 pt-4">
              <label htmlFor="event-start-date" className="text-sm font-medium">
                {t("startDate")}*
              </label>
              <Input
                id="event-start-date"
                type="datetime-local"
                value={eventFormData.startDate}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    startDate: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="event-end-date" className="text-sm font-medium">
                {t("endDate")}*
              </label>
              <Input
                id="event-end-date"
                type="datetime-local"
                value={eventFormData.endDate}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    endDate: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium">{t("image")}</label>
              <div>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 h-[180px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                    eventImagePreview
                      ? "border-rose-300 dark:border-rose-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onClick={() => eventFileInputRef.current?.click()}
                >
                  {eventImagePreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={eventImagePreview || "/placeholder.svg"}
                        alt={t("eventImagePreview")}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEventFormData({ ...eventFormData, image: null });
                          setEventImagePreview("");
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
                        {t("clickToUploadImage")}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {t("imageFormatInfo")}
                      </p>
                    </>
                  )}
                  <input
                    ref={eventFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleEventImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            className="bg-rose-500 hover:bg-rose-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("updating")}
              </>
            ) : (
              t("updateEvent")
            )}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
}
