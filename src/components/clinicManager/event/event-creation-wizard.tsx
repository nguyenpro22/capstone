"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  useCreateEventMutation,
  useUpdateEventMutation,
} from "@/features/event/api";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

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
}

interface EventCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode?: boolean;
  eventData?: any;
  onSuccess: () => void;
}

export default function EventCreationWizard({
  isOpen,
  onClose,
  isEditMode = false,
  eventData,
  onSuccess,
}: EventCreationWizardProps) {
  const t = useTranslations("livestream");
  const user = useSelector((state: RootState) => state?.auth?.user);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const eventFileInputRef = useRef<HTMLInputElement>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string>("");

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

  const [createEvent, { isLoading: isCreatingEvent }] =
    useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdatingEvent }] =
    useUpdateEventMutation();

  // Ensure editor is loaded
  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  // Initialize form data if in edit mode
  useEffect(() => {
    if (isEditMode && eventData) {
      // Format dates for datetime-local input (YYYY-MM-DDTHH:MM)
      let startDate = "";
      let endDate = "";

      try {
        startDate = new Date(eventData.startDate).toISOString().slice(0, 16);
      } catch (error) {
        console.error("Error parsing startDate:", error);
        startDate = new Date().toISOString().slice(0, 16);
      }

      try {
        endDate = new Date(eventData.endDate).toISOString().slice(0, 16);
      } catch (error) {
        console.error("Error parsing endDate:", error);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        endDate = tomorrow.toISOString().slice(0, 16);
      }

      setEventFormData({
        id: eventData.id,
        name: eventData.name,
        description: eventData.description || "",
        startDate: startDate,
        endDate: endDate,
        image: null,
      });

      if (eventData.imageUrl) {
        setEventImagePreview(eventData.imageUrl);
      }
    } else {
      resetForm();
    }
  }, [isEditMode, eventData, isOpen]);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setEventFormData({
      name: "",
      description: "",
      startDate: now.toISOString().slice(0, 16),
      endDate: tomorrow.toISOString().slice(0, 16),
      image: null,
    });
    setEventImagePreview("");
    setCurrentStep(1);
  };

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

  const handleSubmit = async () => {
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

      if (isEditMode && eventFormData.id) {
        await updateEvent({
          id: eventFormData.id,
          formData,
        }).unwrap();
        toast.success(t("eventUpdatedSuccess"));
      } else {
        await createEvent(formData).unwrap();
        toast.success(t("eventCreatedSuccess"));
      }

      onSuccess();
      onClose();
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

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!eventFormData.name.trim()) {
        toast.error(t("pleaseEnterName"));
        return;
      }

      const startDate = new Date(eventFormData.startDate);
      const endDate = new Date(eventFormData.endDate);

      if (endDate <= startDate) {
        toast.error(t("endDateMustBeAfterStartDate"));
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="event-name" className="text-sm font-medium">
                {t("name")}*
              </label>
              <Input
                id="event-name"
                value={eventFormData.name}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, name: e.target.value })
                }
                placeholder={t("enterEventName")}
                required
              />
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
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
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="event-description"
                className="text-sm font-medium"
              >
                {t("description")}
              </label>
              {editorLoaded && (
                <div onClick={(e) => e.stopPropagation()}>
                  <div className="h-[300px] flex flex-col overflow-hidden">
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
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("image")}</label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 h-[200px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
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
                      width={200}
                      height={200}
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
        );
      default:
        return null;
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step
                  ? "bg-rose-500 text-white"
                  : currentStep > step
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              {currentStep > step ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div
                className={`w-12 h-1 ${
                  currentStep > step
                    ? "bg-green-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return t("basicInformation");
      case 2:
        return t("eventDescription");
      case 3:
        return t("coverImage");
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden">
      <div className="p-6 flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2 text-center">
          {isEditMode ? t("editEvent") : t("createNewEvent")}
        </h2>

        {renderStepIndicator()}

        <h3 className="text-lg font-medium mb-4 text-center text-rose-600 dark:text-rose-400">
          {getStepTitle()}
        </h3>

        <div className="mb-6">{renderStepContent()}</div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mt-auto flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={currentStep === 1 ? onClose : prevStep}
          className="flex items-center"
        >
          {currentStep === 1 ? (
            t("cancel")
          ) : (
            <>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("previous")}
            </>
          )}
        </Button>

        <Button
          type="button"
          onClick={currentStep === 3 ? handleSubmit : nextStep}
          className="bg-rose-500 hover:bg-rose-600 text-white flex items-center"
          disabled={isCreatingEvent || isUpdatingEvent}
        >
          {isCreatingEvent || isUpdatingEvent ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? t("updating") : t("creating")}
            </>
          ) : currentStep === 3 ? (
            isEditMode ? (
              t("updateEvent")
            ) : (
              t("createEvent")
            )
          ) : (
            <>
              {t("next")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
