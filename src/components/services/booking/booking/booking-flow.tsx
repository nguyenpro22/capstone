"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { SelectClinicStep } from "./steps/select-clinic-step";
import { SelectDoctorDateStep } from "./steps/select-doctor-date-step";
import { BookingSummaryStep } from "./steps/booking-summary-step";
import { BookingSuccess } from "./steps/booking-success-step";
import type { BookingData, Doctor } from "../types/booking";
import { createBookingRequest } from "../utils/booking-utils";
import { BookingService } from "../utils/booking-service";
import { useCreateBookingMutation } from "@/features/booking/api";
import type { Clinic, ServiceDetail } from "@/features/services/types";
import type { TokenData } from "@/utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslations } from "next-intl"; // Import useTranslations
import { SelectProceduresStep } from "./steps/select-procedures-step";
import { cn } from "@/lib/utils";

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
  const [bookingData, setBookingData] = useState<BookingData>({
    service,
    doctor: doctor || null,
    clinic: clinic || null,
    date: null,
    time: null,
    selectedProcedures: [],
    customerInfo: {
      name: userData?.name || "",
      phone: "",
      email: userData?.email || "",
      notes: "",
    },
    paymentMethod: "cash", // Default payment method
    isDefault: false,
    skipDoctorSelection: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [highestRatedDoctor, setHighestRatedDoctor] = useState<Doctor | null>(
    null
  );
  const t = useTranslations("bookingFlow"); // Use the hook with the namespace

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
        // If doctorServices is available in the service, use it
        if (service.doctorServices && service.doctorServices.length > 0) {
          // In a real app, you would sort by rating
          // Here we'll just take the first one as an example
          setHighestRatedDoctor(service.doctorServices[0].doctor);
        } else {
          // Fallback to fetching doctors
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

  useEffect(() => {
    if (clinic) {
      updateBookingData({ clinic });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData.skipDoctorSelection, highestRatedDoctor]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 2) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else if (currentStep === steps.length - 2) {
      // This is the summary step
      // Submit booking on the summary step
      handleSubmit();
    } else {
      // On success step, just close
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, steps.length, onClose]);

  const handleBack = useCallback(() => {
    if (currentStep > 0 && currentStep < steps.length - 1) {
      // Don't allow going back from success step
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  }, [currentStep, steps.length]);

  const updateBookingData = useCallback((data: Partial<BookingData>) => {
    setBookingData((prev) => {
      const newData = { ...prev, ...data };
      if (JSON.stringify(prev) === JSON.stringify(newData)) {
        return prev; // Don't update state if data hasn't changed
      }
      return newData;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Create booking request from booking data
      let bookingRequest = createBookingRequest(bookingData);
      if (liveStreamRoomId) {
        bookingRequest = { ...bookingRequest, liveStreamRoomId };
      }
      // Call API to submit booking
      const result = await submitBooking(bookingRequest).unwrap();

      setBookingId(result.bookingId);
      setBookingComplete(true);

      // Move to success step
      setCurrentStep(steps.length - 1);
    } catch (error: any) {
      console.error("Error submitting booking:", error);

      // Handle validation errors from the API
      if (error.data && !error.data.isSuccess) {
        // Check if there are specific validation errors
        if (error.data.errors && error.data.errors.length > 0) {
          // Display each validation error as a toast
          error.data.errors.forEach(
            (err: { code: string; message: string }) => {
              toast.error(err.message);
            }
          );
        } else if (error.data.error) {
          // Display the general error message
          toast.error(error.data.error.message || t("errorOccurred"));
        } else {
          // Fallback error message
          toast.error(t("generalError"));
        }
      } else {
        // Handle network or other errors
        toast.error(t("connectionError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [bookingData, steps.length, submitBooking, liveStreamRoomId, t]);

  // Check if current step is valid and can proceed
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
  const renderStepContent = () => {
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
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
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
                      {index < steps.length - 2 && (
                        <div
                          className={cn(
                            "h-0.5 absolute w-[calc(${100 / (steps.length - 1)}%-2rem)]",
                            index < currentStep
                              ? "bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400"
                              : "bg-gray-200 dark:bg-gray-700"
                          )}
                          style={{
                            left: `calc(${
                              (index * 100) / (steps.length - 1)
                            }% + 1rem)`,
                            top: "1.6rem",
                          }}
                        ></div>
                      )}
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
