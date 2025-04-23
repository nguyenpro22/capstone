"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon as CalendarIconFull, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  format,
  parseISO,
  isBefore,
  startOfDay,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { StepIndicator } from "./step-indicator";
import { DoctorSelectionStep } from "./doctor-selection-step";
import { DateTimeSelectionStep } from "./date-time-selection-step";
import { ConfirmationStep } from "./confirmation-step";
import type { AppointmentDetail, Booking } from "@/features/booking/types";
import type { Doctor } from "@/features/services/types";
import { BusyTime } from "@/features/customer-schedule/types";
import { AvailableSlot } from "@/features/working-schedule/types";

interface RescheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  displayBooking: AppointmentDetail;
  doctors: Doctor[];
  onReschedule: (date: string, time: string, doctorId: string) => Promise<void>;
  isRescheduling: boolean;
  fetchDoctors: () => Promise<void>;
  fetchAvailableTimes: (
    doctorId: string,
    date: string
  ) => Promise<{
    busyTimes: BusyTime[];
    doctorAvailableTimes: AvailableSlot[];
  }>;
  onSuccess: () => void;
}

export function RescheduleDialog({
  isOpen,
  onClose,
  booking,
  displayBooking,
  doctors,
  onReschedule,
  isRescheduling,
  fetchDoctors,
  fetchAvailableTimes,
  onSuccess,
}: RescheduleDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [busyTimes, setBusyTimes] = useState<BusyTime[]>([]);
  const [doctorAvailableTimes, setDoctorAvailableTimes] = useState<
    AvailableSlot[]
  >([]);

  // Remove the useToast hook
  // const { toast } = useToast()

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedDoctor(null);
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      fetchDoctors();
    }
  }, [isOpen]);

  // Reset selected time when date changes
  useEffect(() => {
    setSelectedTime(undefined);
  }, [selectedDate]);

  // Get the original booking date for comparison
  const getOriginalBookingDate = () => {
    if (displayBooking?.date) {
      return parseISO(displayBooking.date);
    } else if (booking.date) {
      return parseISO(booking.date);
    }
    return new Date();
  };

  // Get the original booking time for comparison
  const getOriginalBookingTime = () => {
    return displayBooking?.startTime || booking.start || "00:00";
  };

  // Check if a date is disabled (before or equal to the original booking date)
  const isDateDisabled = (date: Date) => {
    const originalDate = getOriginalBookingDate();
    return isBefore(date, startOfDay(originalDate));
  };

  // Parse time string to hours and minutes
  const parseTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = monthStart;
    const endDate = monthEnd;

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const startDay = getDay(startDate);

    // Create array for empty cells before the first day
    const emptyDays = Array.from({ length: startDay }, (_, i) => null);

    return [...emptyDays, ...days];
  };

  // Handle date selection
  const handleDateSelect = async (date: Date) => {
    if (!selectedDoctor) return;

    try {
      setSelectedDate(date);
      setSelectedTime(undefined);
      setIsLoadingTimeSlots(true);

      const dateFormatted = format(date, "yyyy-MM-dd");

      // Fetch available times
      const { busyTimes, doctorAvailableTimes } = await fetchAvailableTimes(
        selectedDoctor.id,
        dateFormatted
      );

      // Store the fetched data
      setBusyTimes(busyTimes);
      setDoctorAvailableTimes(doctorAvailableTimes);

      // Calculate available time slots based on all constraints
      calculateAvailableTimeSlots(busyTimes, doctorAvailableTimes);
    } catch (error) {
      console.error("Error fetching availability data:", error);
      toast.error("Không thể tải thông tin lịch trống. Vui lòng thử lại sau.");
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  // Calculate available time slots
  const calculateAvailableTimeSlots = (
    customerBusyTimes: BusyTime[],
    doctorAvailableTimes: AvailableSlot[]
  ) => {
    // If no doctor available times, return empty array
    if (doctorAvailableTimes.length === 0) {
      setAvailableTimeSlots([]);
      return;
    }

    // Generate all possible time slots from doctor's available times
    let availableSlots: string[] = [];

    doctorAvailableTimes.forEach((availableTime) => {
      const startMinutes = parseTimeToMinutes(availableTime.startTime);
      const endMinutes = parseTimeToMinutes(availableTime.endTime);

      // Generate 30-minute slots within this available time range
      for (
        let slotStart = startMinutes;
        slotStart < endMinutes;
        slotStart += 30
      ) {
        // Format the time as HH:MM
        const hours = Math.floor(slotStart / 60);
        const minutes = slotStart % 60;
        const timeSlot = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;

        // Add to available slots if not already included
        if (!availableSlots.includes(timeSlot)) {
          availableSlots.push(timeSlot);
        }
      }
    });

    // Sort the time slots chronologically
    availableSlots.sort();

    // Filter out customer busy times
    if (customerBusyTimes.length > 0) {
      customerBusyTimes.forEach((busyTime) => {
        const busyStartMinutes = parseTimeToMinutes(busyTime.start);
        const busyEndMinutes = parseTimeToMinutes(busyTime.end);

        availableSlots = availableSlots.filter((slot) => {
          const slotMinutes = parseTimeToMinutes(slot);
          const slotEndMinutes = slotMinutes + 30; // Assuming 30-minute slots

          // Keep slot if it doesn't overlap with busy time
          return !(
            (slotMinutes >= busyStartMinutes && slotMinutes < busyEndMinutes) ||
            (slotEndMinutes > busyStartMinutes &&
              slotEndMinutes <= busyEndMinutes) ||
            (slotMinutes <= busyStartMinutes &&
              slotEndMinutes >= busyEndMinutes)
          );
        });
      });
    }

    // Apply original booking time constraints
    const originalDate = getOriginalBookingDate();
    if (selectedDate && isSameDay(selectedDate, originalDate)) {
      const originalTime = getOriginalBookingTime();
      const originalTimeMinutes = parseTimeToMinutes(originalTime);

      availableSlots = availableSlots.filter((slot) => {
        const slotMinutes = parseTimeToMinutes(slot);
        return slotMinutes > originalTimeMinutes;
      });
    }

    // Update state with calculated available slots
    setAvailableTimeSlots(availableSlots);
  };

  // Handle reschedule submission
  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      toast.error("Vui lòng chọn bác sĩ, ngày và giờ cho lịch hẹn mới");
      return;
    }

    // Additional validation to ensure the selected date and time are valid
    const originalDate = getOriginalBookingDate();
    const originalTime = getOriginalBookingTime();

    if (isBefore(selectedDate, startOfDay(originalDate))) {
      toast.error("Không thể đặt lịch vào ngày trước ngày hẹn hiện tại");
      return;
    }

    // if (isSameDay(selectedDate, originalDate)) {
    //   const timeInMinutes = parseTimeToMinutes(selectedTime);
    //   const originalTimeMinutes = parseTimeToMinutes(originalTime);

    //   if (timeInMinutes <= originalTimeMinutes) {
    //     toast.error(
    //       "Không thể đặt lịch vào thời gian trước hoặc trùng với thời gian hiện tại"
    //     );
    //     return;
    //   }
    // }

    try {
      // Format date as DD/MM/YYYY
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      await onReschedule(formattedDate, selectedTime, selectedDoctor.id);

      // Close the dialog
      onClose();

      // Show success toast
      // toast.success(
      //   `Lịch hẹn của bạn đã được đặt lại với bác sĩ ${selectedDoctor.fullName} vào ngày ${formattedDate} lúc ${selectedTime}`
      // );

      // Trigger success callback
      onSuccess();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi đặt lại lịch. Vui lòng thử lại sau.");
    }
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <DoctorSelectionStep
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            onDoctorSelect={setSelectedDoctor}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <DateTimeSelectionStep
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            calendarDays={generateCalendarDays()}
            availableTimeSlots={availableTimeSlots}
            isLoadingTimeSlots={isLoadingTimeSlots}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onDateSelect={handleDateSelect}
            onTimeSelect={setSelectedTime}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            isDateDisabled={isDateDisabled}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            displayBooking={displayBooking}
            selectedDate={selectedDate!}
            selectedTime={selectedTime!}
            selectedDoctor={selectedDoctor!}
            onBack={() => setStep(2)}
            onConfirm={handleReschedule}
            isRescheduling={isRescheduling}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="[&>button]:hidden sm:max-w-[550px] md:max-w-[700px] lg:max-w-[850px] p-0 border-0 shadow-xl rounded-lg dark:bg-indigo-950/95 dark:border dark:border-indigo-800/30 max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/10 hover:bg-black/20"
              onClick={onClose}
            >
              <X className="h-3.5 w-3.5 text-white" />
              <span className="sr-only">Đóng</span>
            </Button>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700/90 dark:to-indigo-700/90 p-4 rounded-t-lg">
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <CalendarIconFull className="h-5 w-5" />
              Đặt lại lịch hẹn
            </DialogTitle>
            <p className="text-white text-opacity-90 text-sm">
              Chọn bác sĩ, ngày và giờ mới cho lịch hẹn của bạn
            </p>
          </div>

          {/* Step indicators */}
          <StepIndicator currentStep={step} totalSteps={3} />

          {/* Step content */}
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
