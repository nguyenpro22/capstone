"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { SelectClinicStep } from "./steps/select-clinic-step";
import { SelectDoctorDateStep } from "./steps/select-doctor-date-step";
import { SelectServiceStep } from "./steps/select-service-step";
import { BookingSummaryStep } from "./steps/booking-summary-step";
import { BookingSuccess } from "./steps/booking-success-step"; // Import the new component
import { BookingData, Doctor } from "../types/booking";
import { createBookingRequest } from "../utils/booking-utils";
import { BookingService } from "../utils/booking-service";
import { useCreateBookingMutation } from "@/features/booking/api";
import { Clinic, ServiceDetail } from "@/features/services/types";
import { TokenData } from "@/utils";

interface BookingFlowProps {
  service: ServiceDetail;
  onClose: () => void;
  userData?: TokenData;
  clinic?: Clinic | null; // Optional clinic prop
  doctor?: Doctor | null; // Optional doctor prop
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

  const steps = [
    { title: "Chọn cơ sở", component: SelectClinicStep },
    { title: "Chọn bác sĩ & ngày", component: SelectDoctorDateStep },
    { title: "Chọn dịch vụ", component: SelectServiceStep },
    { title: "Xác nhận thông tin", component: BookingSummaryStep },
    { title: "Hoàn tất", component: BookingSuccess }, // Add the success step
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

  // Auto-select highest rated doctor if skipDoctorSelection is true
  useEffect(() => {
    if (
      bookingData.skipDoctorSelection &&
      highestRatedDoctor &&
      !bookingData.doctor
    ) {
      updateBookingData({ doctor: highestRatedDoctor });
    }
  }, [bookingData.skipDoctorSelection, highestRatedDoctor]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 2) {
      // Changed from steps.length - 1
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
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [bookingData, steps.length]);

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
          <SelectServiceStep
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-3xl my-8 max-h-[90vh]">
        <Card className="border-primary/10 shadow-lg">
          <CardContent className="p-0 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-primary/5 p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {currentStep === steps.length - 1
                    ? "Đặt lịch thành công"
                    : "Đặt lịch dịch vụ"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <span className="sr-only">Đóng</span>
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
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index < currentStep
                            ? "bg-primary text-white"
                            : index === currentStep
                            ? "bg-primary/80 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index < currentStep ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div
                        className={`text-xs text-center ${
                          index <= currentStep
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </div>
                      {index < steps.length - 2 && (
                        <div
                          className={`h-0.5 absolute w-[calc(${
                            100 / (steps.length - 1)
                          }%-2rem)] ${
                            index < currentStep ? "bg-primary" : "bg-muted"
                          }`}
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
            <div className="p-6 overflow-y-auto">{renderStepContent()}</div>

            {/* Footer - modified for success step */}
            <div className="p-4 border-t bg-muted/30 flex justify-between">
              {currentStep > 0 && currentStep < steps.length - 1 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Quay lại
                </Button>
              ) : currentStep === 0 ? (
                <Button variant="outline" onClick={onClose}>
                  Hủy
                </Button>
              ) : (
                <div></div> // Empty div for spacing on success step
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className="flex items-center gap-1"
                >
                  {currentStep < steps.length - 2 ? (
                    <>
                      Tiếp tục
                      <ChevronRight className="h-4 w-4" />
                    </>
                  ) : isSubmitting ? (
                    "Đang xử lý..."
                  ) : (
                    "Hoàn tất đặt lịch"
                  )}
                </Button>
              ) : (
                <Button onClick={onClose} className="ml-auto">
                  Đóng
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
