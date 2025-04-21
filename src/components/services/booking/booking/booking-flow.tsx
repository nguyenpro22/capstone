"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { SelectClinicStep } from "./steps/select-clinic-step";
import { SelectDoctorDateStep } from "./steps/select-doctor-date-step";
import { BookingSummaryStep } from "./steps/booking-summary-step";
import { BookingSuccess } from "./steps/booking-success-step";
import { SelectProceduresStep } from "./steps/select-procedures-step";
import type { BookingData, Doctor } from "../types/booking";
import { createBookingRequest } from "../utils/booking-utils";
import { BookingService } from "../utils/booking-service";
import { useCreateBookingMutation } from "@/features/booking/api";
import type { Clinic, ServiceDetail } from "@/features/services/types";
import type { TokenData } from "@/utils";
import { toast } from "react-toastify";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { InsufficientBalanceModal } from "./insufficient-balance-modal";
import {
  BOOKING_DATA_EXPIRY,
  BOOKING_DATA_STORAGE_KEY,
  BOOKING_DATA_TIMESTAMP_KEY,
  BOOKING_RETRY_URL_KEY,
} from "@/constants";
import { usePathname } from "next/navigation";

interface BookingFlowProps {
  service: ServiceDetail;
  onClose: () => void;
  userData?: TokenData;
  clinic?: Clinic | null;
  doctor?: Doctor | null;
  liveStreamRoomId?: string | null;
}

export function BookingFlow({
  service,
  onClose,
  userData,
  clinic,
  doctor,
  liveStreamRoomId,
}: BookingFlowProps) {
  const [submitBooking] = useCreateBookingMutation();
  const [currentStep, setCurrentStep] = useState(0);
  const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] =
    useState(false);
  const [amountNeeded, setAmountNeeded] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    service,
    doctor: doctor || null,
    clinic: clinic ? { ...clinic, address: clinic.address || "" } : null,
    date: null,
    time: null,
    selectedProcedures: [],
    customerInfo: {
      name: userData?.name || "",
      phone: userData?.phone || "",
      email: userData?.email || "",
      notes: "",
    },
    paymentMethod: "cash",
    isDefault: false,
    skipDoctorSelection: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [highestRatedDoctor, setHighestRatedDoctor] = useState<Doctor | null>(
    null
  );
  const [isRestoringData, setIsRestoringData] = useState(false);

  const path = usePathname();
  const t = useTranslations("bookingFlow");

  // Define steps based on whether clinic is provided
  const steps = [
    ...(clinic
      ? []
      : [{ title: t("selectClinicStep"), component: SelectClinicStep }]),
    { title: t("selectDoctorDateStep"), component: SelectDoctorDateStep },
    { title: t("selectServiceStep"), component: SelectProceduresStep },
    { title: t("confirmInfoStep"), component: BookingSummaryStep },
    { title: t("completeStep"), component: BookingSuccess },
  ];

  // Fetch highest rated doctor when service changes
  useEffect(() => {
    const fetchHighestRatedDoctor = async () => {
      try {
        if (service.doctorServices && service.doctorServices.length > 0) {
          setHighestRatedDoctor(service.doctorServices[0].doctor);
        } else {
          const doctors = await BookingService.getDoctorsByService(service);
          if (doctors.length > 0) {
            setHighestRatedDoctor(doctors[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchHighestRatedDoctor();
  }, [service]);

  // Update booking data when clinic changes
  useEffect(() => {
    if (clinic) {
      updateBookingData({
        clinic: { ...clinic, address: clinic.address || "" },
      });
    }
  }, [clinic]);

  // Auto-select highest rated doctor if skipDoctorSelection is true
  useEffect(() => {
    if (
      bookingData.skipDoctorSelection &&
      highestRatedDoctor &&
      !bookingData.doctor
    ) {
      updateBookingData({ doctor: highestRatedDoctor });
    }
  }, [bookingData.skipDoctorSelection, highestRatedDoctor, bookingData.doctor]);

  // Check for saved booking data on component mount
  useEffect(() => {
    checkForSavedBookingData();
  }, []);

  // Helper functions for localStorage
  const saveBookingDataToLocalStorage = useCallback(() => {
    try {
      const dataToSave = {
        bookingData,
        currentStep,
      };

      localStorage.setItem(
        BOOKING_DATA_STORAGE_KEY,
        JSON.stringify(dataToSave)
      );
      localStorage.setItem(
        BOOKING_DATA_TIMESTAMP_KEY,
        JSON.stringify(new Date().getTime())
      );
      localStorage.setItem(BOOKING_RETRY_URL_KEY, path);
    } catch (error) {
      console.error("Error saving booking data:", error);
    }
  }, [bookingData, currentStep, path]);

  const clearSavedBookingData = useCallback(() => {
    // Uncomment to actually clear data
    localStorage.removeItem(BOOKING_DATA_STORAGE_KEY);
    localStorage.removeItem(BOOKING_DATA_TIMESTAMP_KEY);
    localStorage.removeItem(BOOKING_RETRY_URL_KEY);
  }, []);

  const checkForSavedBookingData = useCallback(() => {
    try {
      const savedDataJson = localStorage.getItem(BOOKING_DATA_STORAGE_KEY);
      const savedTimestampJson = localStorage.getItem(
        BOOKING_DATA_TIMESTAMP_KEY
      );

      if (!savedDataJson || !savedTimestampJson) return;

      const savedTimestamp = JSON.parse(savedTimestampJson);
      const currentTime = new Date().getTime();

      // Check if the saved data has expired
      if (currentTime - savedTimestamp > BOOKING_DATA_EXPIRY) {
        clearSavedBookingData();
        return;
      }

      // Parse and restore the saved booking data
      const savedData = JSON.parse(savedDataJson);

      const booking = {
        ...savedData,
        bookingData: {
          ...savedData.bookingData,
          date: savedData.bookingData?.date
            ? new Date(savedData.bookingData.date)
            : null,
        },
      };

      if (savedData) {
        setIsRestoringData(true);

        // Restore the booking data
        setBookingData(booking.bookingData || {});

        // Restore other state if needed
        if (savedData.currentStep) {
          setCurrentStep(savedData.currentStep);
        }

        // Show a toast notification
        toast.info(
          t("bookingDataRestored") ||
            "Dữ liệu đặt dịch vụ của bạn đã được khôi phục"
        );

        // Clean up the URL parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

        clearSavedBookingData();

        // Automatically resubmit if the user returned from deposit
      }
    } catch (error) {
      console.error("Error restoring booking data:", error);
      clearSavedBookingData();
    }
  }, [clearSavedBookingData, t]);

  useEffect(() => {
    if (isRestoringData) {
      handleSubmit();
      setIsRestoringData(false);
    }
  }, [isRestoringData]);

  // Update booking data
  const updateBookingData = useCallback((data: Partial<BookingData>) => {
    setBookingData((prev) => {
      const newData = { ...prev, ...data };
      // Only update if data has changed
      return JSON.stringify(prev) === JSON.stringify(newData) ? prev : newData;
    });
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 2) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else if (currentStep === steps.length - 2) {
      // Submit booking on the summary step
      handleSubmit();
    } else {
      // On success step, just close
      onClose();
    }
  }, [currentStep, steps.length, onClose]);

  const handleBack = useCallback(() => {
    if (currentStep > 0 && currentStep < steps.length - 1) {
      // Don't allow going back from success step
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  }, [currentStep, steps.length]);

  // Error handling helpers
  const isInsufficientBalanceError = useCallback(
    (error: any): boolean =>
      error.data?.error?.code === "400" &&
      error.data?.error?.message?.includes("Insufficient balance"),
    []
  );

  const extractRequiredAmount = useCallback((message: string): number => {
    const match = message.match(/tối thiểu\s([\d,.]+)/i);
    const amount =
      match && match[1] ? Number.parseInt(match[1].replace(/,/g, ""), 10) : 0;
    return isNaN(amount) || amount < 3000 ? 3000 : amount;
  }, []);

  const handleInsufficientBalanceError = useCallback(
    (error: any) => {
      const message = error.data?.error?.message || "";
      const amount = extractRequiredAmount(message);
      saveBookingDataToLocalStorage();
      setAmountNeeded(amount);
      setShowInsufficientBalanceModal(true);
      toast.error(message || t("insufficientBalance") || "Số dư không đủ");
    },
    [extractRequiredAmount, saveBookingDataToLocalStorage, t]
  );

  const handleGenericBookingError = useCallback(
    (error: any) => {
      if (error.data && !error.data.isSuccess) {
        const messages = error.data.errors;

        if (messages?.length > 0) {
          messages.forEach((err: { code: string; message: string }) => {
            toast.error(err.message);
          });
        } else if (error.data.error?.message) {
          toast.error(
            error.data.error.message || t("errorOccurred") || "Có lỗi xảy ra"
          );
        } else {
          toast.error(t("generalError") || "Lỗi chung");
        }
      } else {
        toast.error(t("connectionError") || "Lỗi kết nối");
      }
    },
    [t]
  );

  // Submit booking
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const bookingRequest = createBookingRequest(bookingData);
      const requestWithRoom = liveStreamRoomId
        ? { ...bookingRequest, liveStreamRoomId }
        : bookingRequest;

      const result = await submitBooking(requestWithRoom).unwrap();

      clearSavedBookingData();
      setBookingId(result.value);
      setBookingComplete(true);
      setCurrentStep(steps.length - 1);
    } catch (error: any) {
      console.error("Error submitting booking:", error);

      if (isInsufficientBalanceError(error)) {
        handleInsufficientBalanceError(error);
      } else {
        handleGenericBookingError(error);
      }
    } finally {
      if (!showInsufficientBalanceModal) {
        setIsSubmitting(false);
      }
    }
  }, [
    bookingData,
    clearSavedBookingData,
    handleGenericBookingError,
    handleInsufficientBalanceError,
    isInsufficientBalanceError,
    isSubmitting,
    liveStreamRoomId,
    showInsufficientBalanceModal,
    steps.length,
    submitBooking,
  ]);

  // Handle deposit action
  const handleDepositAction = useCallback(() => {
    // Save the current booking data to localStorage before redirecting
    saveBookingDataToLocalStorage();

    // Close the modal
    setShowInsufficientBalanceModal(false);
    const depositUrl =
      amountNeeded > 0
        ? `/profile?tab=deposit&amount=${amountNeeded}&from_booking=true`
        : "/profile?tab=deposit&from_booking=true";
    window.location.href = depositUrl;
  }, [amountNeeded, saveBookingDataToLocalStorage]);

  // Check if user can proceed to next step
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 0: // Clinic selection
        return bookingData.clinic !== null;
      case 1: // Doctor and date selection
        return (
          (bookingData.skipDoctorSelection || bookingData.doctor !== null) &&
          bookingData.date !== null &&
          bookingData.time !== null
        );
      case 2: // Service selection
        return (
          bookingData.isDefault || bookingData.selectedProcedures.length > 0
        );
      case 3: // Summary
        return (
          bookingData.customerInfo.name.trim() !== "" &&
          bookingData.customerInfo.phone.trim() !== ""
        );
      case 4: // Success step - always can proceed (to close)
        return true;
      default:
        return false;
    }
  }, [currentStep, bookingData]);

  // Render the appropriate step component based on currentStep
  const renderStepContent = useCallback(() => {
    const StepComponent = steps[currentStep]?.component;

    if (!StepComponent) return null;

    switch (currentStep) {
      case 0:
        return (
          <SelectClinicStep
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        );
      case 1:
        return (
          <SelectDoctorDateStep
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            highestRatedDoctor={highestRatedDoctor}
          />
        );
      case 2:
        return (
          <SelectProceduresStep
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        );
      case 3:
        return (
          <BookingSummaryStep
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        );
      case 4:
        return (
          <BookingSuccess
            bookingId={bookingId || ""}
            bookingData={bookingData}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    bookingData,
    updateBookingData,
    highestRatedDoctor,
    bookingId,
    onClose,
    steps,
  ]);

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-3xl my-8 max-h-[90vh]">
        <Card className="border-purple-200 dark:border-purple-800/30 shadow-lg">
          <CardContent className="p-0 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-purple-50/70 dark:bg-purple-900/20 p-4 border-b border-purple-100 dark:border-purple-800/20">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-purple-800 dark:text-purple-300">
                  {currentStep === steps.length - 1
                    ? t("bookingSuccessful")
                    : t("bookingService")}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/30"
                >
                  <span className="sr-only">{t("close")}</span>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Progress steps - hide on success step */}
              {currentStep < steps.length - 1 && (
                <div className="flex justify-between mt-4">
                  {steps.slice(0, steps.length - 1).map((step, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center space-y-1"
                      style={{ width: `${100 / (steps.length - 1)}%` }}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                          index < currentStep
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white"
                            : index === currentStep
                            ? "bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        )}
                      >
                        {index < currentStep ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div
                        className={cn(
                          "text-xs text-center",
                          index <= currentStep
                            ? "text-purple-700 dark:text-purple-300 font-medium"
                            : "text-gray-500 dark:text-gray-400"
                        )}
                      >
                        {step.title}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step content */}
            <div className="p-6 overflow-y-auto bg-white dark:bg-gray-900">
              {renderStepContent()}
            </div>

            {/* Footer - modified for success step */}
            <div className="p-4 border-t border-purple-100 dark:border-purple-800/20 bg-purple-50/50 dark:bg-purple-900/10 flex justify-between">
              {currentStep > 0 && currentStep < steps.length - 1 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-1 border-purple-200 dark:border-purple-800/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("back")}
                </Button>
              ) : currentStep === 0 ? (
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-purple-200 dark:border-purple-800/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  {t("cancel")}
                </Button>
              ) : (
                <div></div> // Empty div for spacing on success step
              )}

              {currentStep < steps.length - 1 ? (
                <div>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed() || isSubmitting}
                    className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600"
                  >
                    {currentStep < steps.length - 2 ? (
                      <>
                        {t("next")}
                        <ChevronRight className="h-4 w-4" />
                      </>
                    ) : isSubmitting ? (
                      t("loading")
                    ) : (
                      t("complete")
                    )}
                  </Button>
                  <InsufficientBalanceModal
                    isOpen={showInsufficientBalanceModal}
                    onClose={() => {
                      setShowInsufficientBalanceModal(false);
                      setIsSubmitting(false);
                      toast.info(t("bookingCancelledMessage"));
                    }}
                    onDeposit={handleDepositAction}
                    amountNeeded={amountNeeded}
                  />
                </div>
              ) : (
                <Button
                  onClick={onClose}
                  className="ml-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600"
                >
                  {t("close")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
