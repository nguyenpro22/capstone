"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  format,
  parseISO,
  isBefore,
  startOfDay,
  addDays,
  isSameDay,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
  Clock3,
  CalendarClock,
  User,
  Loader2,
  RefreshCcw,
  ClipboardList,
  X,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Milestone,
  CalendarIcon as CalendarIconFull,
  Info,
  ArrowRightCircle,
  Building2,
  MessageSquare,
  FileText,
  Stethoscope,
  MapPin,
} from "lucide-react";
import {
  useGetBookingByBookingIdQuery,
  useLazyGetAvalableTimesQuery,
  useUpdateBookingMutation,
} from "@/features/booking/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { Progress } from "@/components/ui/progress";
import type { AppointmentDetail, Booking } from "@/features/booking/types";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isToday,
  getDay,
} from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLazyGetBusyTimesQuery } from "@/features/customer-schedule/api";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useLazyGetDoctorByServiceIdQuery } from "@/features/services/api";
import { Doctor } from "@/features/services/types";

interface BookingDetailDialogProps {
  booking: Booking;
  children?: React.ReactNode;
}

export interface BusyTime {
  start: string;
  end: string;
}

export interface AvailableSlot {
  startTime: string;
  endTime: string;
}

export interface Shift {
  startTime: string;
  endTime: string;
}

export function BookingDetailDialog({
  booking,
  children,
}: BookingDetailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: bookingDetail,
    isLoading,
    isError,
    refetch,
  } = useGetBookingByBookingIdQuery(
    isOpen && booking?.id ? { id: booking.id } : skipToken
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState("overview");
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [busyTimes, setBusyTimes] = useState<BusyTime[]>([]);
  const [doctorAvailableTimes, setDoctorAvailableTimes] = useState<
    AvailableSlot[]
  >([]);

  const [clinicShifts, setClinicShifts] = useState<Shift[]>([]);
  const [fetchDoctors] = useLazyGetDoctorByServiceIdQuery();
  const [getDoctorAvailableTime] = useLazyGetAvalableTimesQuery();
  // Add this mock implementation for getClinicShifts
  const getClinicShifts = async ({ date }: { date: string }) => {
    return {
      unwrap: () => Promise.resolve({ value: [] }),
    };
  };
  // Reschedule state
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [rescheduleBooking, { isLoading: isRescheduling }] =
    useUpdateBookingMutation();
  const [getBusyTime] = useLazyGetBusyTimesQuery();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && booking.id) {
      console.log(`Booking dialog opened for booking ID: ${booking.id}`);
    }
  }, [isOpen, booking.id]);

  // Reset reschedule form when dialog opens
  useEffect(() => {
    const loadDoctors = async () => {
      console.log("Loading doctors effect triggered");

      if (isRescheduleDialogOpen) {
        console.log("Reschedule dialog is open");

        if (bookingDetail?.value?.service?.id) {
          console.log("Service ID found:", bookingDetail.value.service.id);
          try {
            // Set default date to the next day after the original booking
            const originalDate = getOriginalBookingDate();
            setSelectedDate(addDays(originalDate, 1));
            setSelectedTime(undefined);

            // Fetch doctors for the service
            console.log(
              "Fetching doctors for service:",
              bookingDetail.value.service.id
            );
            const response = await fetchDoctors(
              bookingDetail.value.service.id
            ).unwrap();
            console.log("Doctors response:", response);
            if (response.value?.doctorServices) {
              const doctorList = response.value.doctorServices.map(
                (doctorService) => doctorService.doctor
              );
              console.log("Doctor list:", doctorList);
              setDoctors(doctorList);
            } else {
              console.log("No doctor services found in response:", response);
            }
          } catch (error) {
            console.error("Error loading doctors:", error);
            toast({
              title: "Lỗi",
              description:
                "Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.",
              variant: "destructive",
            });
          }
        } else {
          console.log("No service ID found in booking detail:", bookingDetail);
        }
      }
    };

    loadDoctors();
  }, [isRescheduleDialogOpen, bookingDetail, fetchDoctors, toast]);

  // Reset selected time when date changes
  useEffect(() => {
    // Clear selected time when date changes to avoid invalid combinations
    setSelectedTime(undefined);
  }, [selectedDate]);

  // Use the API data if available, otherwise use the prop
  const displayBooking = bookingDetail?.value;

  // Format time
  const formatTime = (time: string | null | undefined) => {
    if (!time) return "N/A";
    return time.substring(0, 5);
  };

  // Parse time string to hours and minutes
  const parseTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Get status badge
  const getStatusBadge = (status: string | undefined) => {
    if (!status)
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0 dark:bg-gray-800 dark:text-gray-300 text-sm px-3 py-1">
          Không xác định
        </Badge>
      );

    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40 text-sm px-3 py-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 dark:bg-green-400"></span>
              Hoàn thành
            </div>
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/40 text-sm px-3 py-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>
              Chờ xử lý
            </div>
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40 text-sm px-3 py-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>
              Đang xử lý
            </div>
          </Badge>
        );
      case "Uncompleted":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40 text-sm px-3 py-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 dark:bg-red-400"></span>
              Chưa hoàn thành
            </div>
          </Badge>
        );
      case "Waiting Approval":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-0 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40 text-sm px-3 py-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500 dark:bg-purple-400"></span>
              Chờ duyệt
            </div>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0 dark:bg-gray-800 dark:text-gray-300 text-sm px-3 py-1">
            {status}
          </Badge>
        );
    }
  };

  // Get status progress
  const getStatusProgress = (status: string | undefined) => {
    if (!status) return 0;

    switch (status) {
      case "Completed":
        return 100;
      case "In Progress":
        return 50;
      case "Pending":
        return 25;
      case "Waiting Approval":
        return 15;
      case "Uncompleted":
        return 0;
      default:
        return 0;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string | undefined) => {
    if (!status)
      return (
        <AlertCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
      );

    switch (status) {
      case "Completed":
        return (
          <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400" />
        );
      case "Pending":
        return (
          <AlertCircle className="h-6 w-6 text-amber-500 dark:text-amber-400" />
        );
      case "In Progress":
        return <Clock3 className="h-6 w-6 text-blue-500 dark:text-blue-400" />;
      case "Uncompleted":
        return (
          <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
        );
      case "Waiting Approval":
        return (
          <Clock3 className="h-6 w-6 text-purple-500 dark:text-purple-400" />
        );
      default:
        return (
          <AlertCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        );
    }
  };

  // Get status color
  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-500 dark:bg-gray-400";

    switch (status) {
      case "Completed":
        return "bg-green-500 dark:bg-green-400";
      case "Pending":
        return "bg-amber-500 dark:bg-amber-400";
      case "In Progress":
        return "bg-blue-500 dark:bg-blue-400";
      case "Uncompleted":
        return "bg-red-500 dark:bg-red-400";
      case "Waiting Approval":
        return "bg-purple-500 dark:bg-purple-400";
      default:
        return "bg-gray-500 dark:bg-gray-400";
    }
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

  // Check if a procedure is the current step
  const isCurrentStep = (stepIndex: number) => {
    return stepIndex === booking.stepIndex;
  };

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

  // Check if a time is disabled (if same day as original booking, disable earlier times)
  const isTimeDisabled = (time: string) => {
    // If no date is selected, disable all times
    if (!selectedDate) return true;

    const originalDate = getOriginalBookingDate();
    const originalTime = getOriginalBookingTime();

    // If selected date is before the original date, disable all times
    if (isBefore(selectedDate, startOfDay(originalDate))) {
      return true;
    }

    // If selected date is the same as original date, disable times earlier than or equal to original time
    if (isSameDay(selectedDate, originalDate)) {
      // Convert times to minutes for proper numerical comparison
      const timeInMinutes = parseTimeToMinutes(time);
      const originalTimeInMinutes = parseTimeToMinutes(originalTime);

      return timeInMinutes <= originalTimeInMinutes;
    }

    // If selected date is after original date, all times are valid
    return false;
  };

  // Handle reschedule submission
  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime || !booking.id || !selectedDoctor) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn bác sĩ, ngày và giờ cho lịch hẹn mới",
        variant: "destructive",
      });
      return;
    }

    // Additional validation to ensure the selected date and time are valid
    const originalDate = getOriginalBookingDate();
    const originalTime = getOriginalBookingTime();

    if (isBefore(selectedDate, startOfDay(originalDate))) {
      toast({
        title: "Lỗi",
        description: "Không thể đặt lịch vào ngày trước ngày hẹn hiện tại",
        variant: "destructive",
      });
      return;
    }

    if (isSameDay(selectedDate, originalDate)) {
      const timeInMinutes = parseTimeToMinutes(selectedTime);
      const originalTimeMinutes = parseTimeToMinutes(originalTime);

      if (timeInMinutes <= originalTimeMinutes) {
        toast({
          title: "Lỗi",
          description:
            "Không thể đặt lịch vào thời gian trước hoặc trùng với thời gian hiện tại",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      // Format date as DD/MM/YYYY
      const formattedDate = format(selectedDate, "dd/MM/yyyy");

      await rescheduleBooking({
        customerScheduleId: booking.id,
        date: formattedDate,
        startTime: selectedTime,
        // doctorId: selectedDoctor.id,
      }).unwrap();

      // Close the reschedule dialog
      setIsRescheduleDialogOpen(false);

      // Show success toast with more prominent styling
      toast({
        title: "Đặt lại lịch thành công",
        description: `Lịch hẹn của bạn đã được đặt lại với bác sĩ ${selectedDoctor.fullName} vào ngày ${formattedDate} lúc ${selectedTime}`,
        variant: "default",
        className:
          "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800/30",
      });

      // Refresh the booking details to show updated information
      refetch();
    } catch (error) {
      toast({
        title: "Đặt lại lịch thất bại",
        description: "Đã xảy ra lỗi khi đặt lại lịch. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  // Check if the reschedule button should be disabled
  const isRescheduleSubmitButtonDisabled = () => {
    // Disable if no doctor, date or time is selected
    if (!selectedDoctor || !selectedDate || !selectedTime) return true;

    // Disable if rescheduling is in progress
    if (isRescheduling) return true;

    // Disable if selected date is before the original date
    const originalDate = getOriginalBookingDate();
    if (isBefore(selectedDate, startOfDay(originalDate))) {
      return true;
    }

    // Disable if selected date is the same as original date and time is not later
    if (isSameDay(selectedDate, originalDate)) {
      const originalTime = getOriginalBookingTime();
      const timeInMinutes = parseTimeToMinutes(selectedTime);
      const originalTimeInMinutes = parseTimeToMinutes(originalTime);

      if (timeInMinutes <= originalTimeInMinutes) {
        return true;
      }
    }

    return false;
  };

  // Check if the reschedule button should be disabled
  const isRescheduleButtonDisabled = (displayBooking: AppointmentDetail) => {
    // Disable if rescheduling is in progress
    if (isRescheduling) return true;

    // Check if the appointment has already passed
    const current = Date.now();
    const schedule = displayBooking.date;
    const time = displayBooking.endTime;

    return current > new Date(`${schedule}T${time}`).getTime();
  };

  // Handle date selection
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date || !selectedDoctor) return;

    try {
      setSelectedDate(date);
      setSelectedTime(undefined);

      const dateFormatted = format(date, "yyyy-MM-dd");

      // Fetch busy times for the customer
      const busyTimeResponse = await getBusyTime({
        customerId: user?.userId as string,
        date: dateFormatted,
      }).unwrap();
      // Fetch doctor available times
      const doctorAvailableTimeResponse = await getDoctorAvailableTime({
        serviceIdOrCustomerScheduleId: bookingDetail?.value?.service?.id || "",
        date: dateFormatted,
        doctorId: selectedDoctor.id,
        clinicId: bookingDetail?.value.clinic.id as string,
      }).unwrap();

      // Fetch clinic shifts for the selected date
      const clinicShiftResponse = await getClinicShifts({
        date: dateFormatted,
      }).unwrap();

      // Store the fetched data
      setBusyTimes(busyTimeResponse.value || []);
      setClinicShifts(clinicShiftResponse.value || []);
      setDoctorAvailableTimes(doctorAvailableTimeResponse.value || []);

      // Calculate available time slots based on all constraints
      calculateAvailableTimeSlots(
        busyTimeResponse.value || [],
        doctorAvailableTimeResponse.value || [],
        clinicShiftResponse.value || []
      );
    } catch (error) {
      console.error("Error fetching availability data:", error);
      toast({
        title: "Lỗi",
        description:
          "Không thể tải thông tin lịch trống. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  // Add this new function to calculate available time slots
  const calculateAvailableTimeSlots = (
    customerBusyTimes: BusyTime[],
    doctorAvailableTimes: AvailableSlot[],
    clinicShifts: Shift[]
  ) => {
    // Default time slots (30-minute intervals from 8:00 to 17:30)
    const defaultTimeSlots = [
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
    ];

    // 1. Start with clinic shifts - if no shifts, use default time slots
    let availableSlots: string[] = [];

    if (clinicShifts.length > 0) {
      // Generate time slots based on clinic shifts
      clinicShifts.forEach((shift) => {
        const startMinutes = parseTimeToMinutes(shift.startTime);
        const endMinutes = parseTimeToMinutes(shift.endTime);

        // Generate 30-minute slots within each shift
        for (let time = startMinutes; time < endMinutes; time += 30) {
          const hours = Math.floor(time / 60);
          const minutes = time % 60;
          const timeString = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;
          availableSlots.push(timeString);
        }
      });
    } else {
      // If no clinic shifts, use default time slots
      availableSlots = [...defaultTimeSlots];
    }

    // 2. Filter out customer busy times
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
          (slotMinutes <= busyStartMinutes && slotEndMinutes >= busyEndMinutes)
        );
      });
    });

    // 3. Keep only slots that are within doctor's available times
    if (doctorAvailableTimes.length > 0) {
      const filteredSlots = [];

      for (const slot of availableSlots) {
        const slotMinutes = parseTimeToMinutes(slot);
        const slotEndMinutes = slotMinutes + 30; // Assuming 30-minute slots

        // Check if this slot is within any of the doctor's available times
        const isAvailable = doctorAvailableTimes.some((availableTime) => {
          const availStartMinutes = parseTimeToMinutes(availableTime.startTime);
          const availEndMinutes = parseTimeToMinutes(availableTime.endTime);

          return (
            slotMinutes >= availStartMinutes &&
            slotEndMinutes <= availEndMinutes
          );
        });

        if (isAvailable) {
          filteredSlots.push(slot);
        }
      }

      availableSlots = filteredSlots;
    }

    // 4. Apply original booking time constraints
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

  // Handle reschedule button click
  const handleRescheduleClick = () => {
    // Close the detail dialog
    setIsOpen(false);

    // Make sure booking details are loaded
    if (!bookingDetail?.value) {
      console.log("Fetching booking details before opening reschedule dialog");
      refetch().then(() => {
        // Open the reschedule dialog after details are loaded
        setIsRescheduleDialogOpen(true);
      });
    } else {
      // Open the reschedule dialog
      setIsRescheduleDialogOpen(true);
    }
  };

  // Render time slot buttons in grid layout for better UI
  const renderTimeSlots = () => {
    // If no available slots after calculations, show a message
    if (availableTimeSlots.length === 0) {
      return (
        <div className="p-6 text-center">
          <Clock className="h-12 w-12 mx-auto text-gray-300 dark:text-indigo-700 mb-2" />
          <p className="text-gray-500 dark:text-indigo-300/70">
            Không có khung giờ trống cho ngày này. Vui lòng chọn ngày khác.
          </p>
        </div>
      );
    }

    const morningSlots = availableTimeSlots.filter(
      (time) => parseTimeToMinutes(time) < 12 * 60
    );
    const afternoonSlots = availableTimeSlots.filter(
      (time) => parseTimeToMinutes(time) >= 12 * 60
    );

    return (
      <div className="space-y-4">
        {morningSlots.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-600 dark:text-indigo-300 mb-2">
              Buổi sáng
            </h5>
            <div className="grid grid-cols-3 gap-1.5">
              {morningSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={cn(
                    "h-9 w-full text-sm",
                    selectedTime === time
                      ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                      : "border-gray-200 dark:border-indigo-800/30 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                  )}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {afternoonSlots.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-600 dark:text-indigo-300 mb-2">
              Buổi chiều
            </h5>
            <div className="grid grid-cols-3 gap-1.5">
              {afternoonSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={cn(
                    "h-9 w-full text-sm",
                    selectedTime === time
                      ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                      : "border-gray-200 dark:border-indigo-800/30 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                  )}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="[&>button]:hidden sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] p-0 border-0 shadow-xl rounded-lg dark:bg-indigo-950 dark:border dark:border-indigo-800/30 max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <div className="absolute top-3 right-3 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full bg-black/10 hover:bg-black/20"
                onClick={() => setIsRescheduleDialogOpen(false)}
              >
                <X className="h-4 w-4 text-white" />
                <span className="sr-only">Đóng</span>
              </Button>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 h-20 flex items-center p-5">
              <div className="w-full relative z-10">
                <DialogTitle className="text-lg font-bold text-white flex items-center gap-2 mb-1.5">
                  <CalendarClock className="h-6 w-6" />
                  Chi tiết lịch hẹn
                </DialogTitle>
                <div className="flex justify-between items-center">
                  <p className="text-white text-opacity-90 text-base">
                    Mã lịch hẹn: {booking.id.substring(0, 8)}...
                  </p>
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="bg-white dark:bg-indigo-950/80 border-b border-gray-200 dark:border-indigo-800/30 px-6">
                <TabsList className="h-14 bg-transparent gap-4">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 dark:data-[state=active]:border-purple-400 rounded-none px-2 h-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Tổng quan
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 dark:data-[state=active]:border-purple-400 rounded-none px-2 h-full"
                  >
                    <CalendarRange className="h-4 w-4 mr-2" />
                    Quy trình
                  </TabsTrigger>
                  <TabsTrigger
                    value="doctor"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 dark:data-[state=active]:border-purple-400 rounded-none px-2 h-full"
                  >
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Bác sĩ & Phòng khám
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 dark:data-[state=active]:border-purple-400 rounded-none px-2 h-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ghi chú
                  </TabsTrigger>
                </TabsList>
              </div>

              {isLoading ? (
                <div className="p-6 flex justify-center items-center h-64">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500 dark:text-purple-400" />
                    <p className="text-sm text-gray-500 dark:text-indigo-300/70">
                      Đang tải thông tin...
                    </p>
                  </div>
                </div>
              ) : isError ? (
                <div className="p-6 flex flex-col justify-center items-center h-64">
                  <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400 mb-4" />
                  <p className="text-center text-base text-red-500 dark:text-red-400 font-medium">
                    Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="mt-4 border-purple-200 dark:border-indigo-800/30 dark:bg-indigo-950/60 dark:text-indigo-200 dark:hover:bg-indigo-900/60"
                    onClick={() => refetch()}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Thử lại
                  </Button>
                </div>
              ) : !displayBooking ? (
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 dark:text-indigo-200">
                        {booking.serviceName}
                      </h3>

                      {/* Current Step Card - Highlighted */}
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-lg p-5 mb-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-purple-500/20 dark:bg-purple-500/30 rounded-full p-2 flex-shrink-0">
                            <Milestone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-base text-purple-700 dark:text-purple-300 font-medium">
                              Bước hiện tại
                            </p>
                            <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                              {booking.stepIndex}: {booking.name}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-indigo-900/30 rounded-lg p-4 mb-4 shadow-sm border border-gray-100 dark:border-indigo-800/20">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(booking.status)}
                            <span className="font-medium text-lg dark:text-indigo-200">
                              {booking.status.toString() === "Completed"
                                ? "Lịch hẹn đã hoàn thành"
                                : booking.status.toString() === "In Progress"
                                ? "Lịch hẹn đang được thực hiện"
                                : "Lịch hẹn đang chờ xác nhận"}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-indigo-300/70">
                            {getStatusProgress(booking.status)}%
                          </span>
                        </div>
                        <Progress
                          value={getStatusProgress(booking.status)}
                          className="h-2.5 bg-gray-200 dark:bg-indigo-900/50"
                        />
                      </div>

                      <div className="space-y-4 mt-4">
                        {booking.date && (
                          <div className="flex items-start">
                            <div className="bg-purple-500/20 dark:bg-purple-500/10 rounded-full p-2 mr-3 flex-shrink-0">
                              <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-indigo-300/70">
                                Ngày hẹn
                              </p>
                              <p className="font-medium text-base dark:text-indigo-200">
                                {format(
                                  parseISO(booking.date),
                                  "EEEE, dd/MM/yyyy",
                                  {
                                    locale: vi,
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                        {booking.start && booking.end && (
                          <div className="flex items-start">
                            <div className="bg-purple-500/20 dark:bg-purple-500/10 rounded-full p-2 mr-3 flex-shrink-0">
                              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-indigo-300/70">
                                Thời gian
                              </p>
                              <p className="font-medium text-base dark:text-indigo-200">
                                {formatTime(booking.start)} -{" "}
                                {formatTime(booking.end)}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start">
                          <div className="bg-purple-500/20 dark:bg-purple-500/10 rounded-full p-2 mr-3 flex-shrink-0">
                            <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-indigo-300/70">
                              Dịch vụ
                            </p>
                            <p className="font-medium text-base dark:text-indigo-200">
                              {booking.serviceName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-gray-50 dark:bg-indigo-900/20 rounded-lg p-5 h-full flex flex-col justify-center items-center">
                        <CalendarClock className="h-16 w-16 text-purple-400 dark:text-purple-500 mb-4 opacity-50" />
                        <p className="text-base text-center text-gray-500 dark:text-indigo-300/70 mb-5">
                          Tải thông tin chi tiết để xem lịch hẹn đầy đủ
                        </p>
                        <Button
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600/90 hover:to-indigo-600/90 text-white font-medium shadow-sm text-base h-10"
                          onClick={() => refetch()}
                        >
                          <RefreshCcw className="h-5 w-5 mr-2" />
                          Tải thông tin chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-0">
                  <TabsContent value="overview" className="p-5 m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left column - Basic information */}
                      <div className="space-y-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                            <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="font-semibold text-xl dark:text-indigo-200">
                            {displayBooking.service?.name ||
                              booking.serviceName}
                          </h3>
                        </div>

                        {/* Status Card */}
                        <div className="bg-white dark:bg-indigo-950/40 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-indigo-800/20">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(displayBooking.status)}
                              <span className="font-medium text-lg dark:text-indigo-200">
                                {displayBooking.status === "Completed"
                                  ? "Lịch hẹn đã hoàn thành"
                                  : displayBooking.status === "In Progress"
                                  ? "Lịch hẹn đang được thực hiện"
                                  : "Lịch hẹn đang chờ xác nhận"}
                              </span>
                            </div>
                            <Badge
                              className={`${
                                displayBooking.status === "Completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : displayBooking.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                              } px-3 py-1`}
                            >
                              {displayBooking.status === "Completed"
                                ? "Hoàn thành"
                                : displayBooking.status === "In Progress"
                                ? "Đang thực hiện"
                                : "Chờ xác nhận"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-indigo-300/80">
                              Tiến độ
                            </span>
                            <span className="text-sm font-medium dark:text-indigo-300">
                              {getStatusProgress(displayBooking.status)}%
                            </span>
                          </div>
                          <Progress
                            value={getStatusProgress(displayBooking.status)}
                            className="h-2.5 bg-gray-100 dark:bg-indigo-900/50"
                          />
                        </div>

                        {/* Current Step Card - Highlighted */}
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-5 shadow-sm">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="bg-purple-500/20 dark:bg-purple-500/30 rounded-full p-2.5 flex-shrink-0 mt-1">
                              <Milestone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-base text-purple-700 dark:text-purple-300 font-medium mb-1">
                                Bước hiện tại
                              </p>
                              <h4 className="text-xl font-semibold text-purple-800 dark:text-purple-200">
                                Bước {booking.stepIndex}: {booking.name}
                              </h4>
                            </div>
                          </div>

                          {displayBooking.procedureHistory &&
                            displayBooking.procedureHistory.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-purple-200/70 dark:border-purple-800/30">
                                <div className="flex items-center justify-between text-sm mb-2">
                                  <span className="font-medium text-purple-700 dark:text-purple-300">
                                    Bước {booking.stepIndex} /{" "}
                                    {displayBooking.procedureHistory.length}
                                  </span>
                                  <span className="font-medium text-purple-700 dark:text-purple-300">
                                    {Math.round(
                                      (booking.stepIndex /
                                        displayBooking.procedureHistory
                                          .length) *
                                        100
                                    )}
                                    % hoàn thành
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (booking.stepIndex /
                                      displayBooking.procedureHistory.length) *
                                    100
                                  }
                                  className="h-3 mt-2 bg-purple-200/70 dark:bg-purple-800/30"
                                />
                              </div>
                            )}
                        </div>

                        {/* Action buttons - Improved layout */}
                        <div className="flex space-x-4 mt-6">
                          <Button
                            variant="outline"
                            className="flex-1 border-gray-200 hover:border-gray-300 dark:border-indigo-800/30 dark:bg-indigo-950/60 dark:text-indigo-200 dark:hover:bg-indigo-900/60 h-12 text-base rounded-xl transition-all duration-200"
                            onClick={() => setIsOpen(false)}
                          >
                            <X className="h-5 w-5 mr-2" />
                            Đóng
                          </Button>

                          <Button
                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-md h-12 text-base rounded-xl transition-all duration-200"
                            onClick={handleRescheduleClick}
                            disabled={isRescheduleButtonDisabled(
                              displayBooking
                            )}
                          >
                            <CalendarClock className="h-5 w-5 mr-2" />
                            Đặt lại lịch
                          </Button>
                        </div>
                      </div>

                      {/* Right column - Calendar and service info */}
                      <div className="space-y-5">
                        {/* Service image if available */}
                        {displayBooking.service?.imageUrls &&
                          displayBooking.service.imageUrls.length > 0 && (
                            <div className="mb-4 overflow-hidden rounded-xl border border-gray-100 dark:border-indigo-800/30 shadow-sm">
                              <Image
                                src={
                                  displayBooking.service.imageUrls[0] ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={
                                  displayBooking.service?.name ||
                                  booking.serviceName
                                }
                                className="w-full h-48 object-cover"
                                width={500}
                                height={240}
                              />
                            </div>
                          )}

                        {/* Basic booking information */}
                        <div className="bg-white dark:bg-indigo-950/40 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-indigo-800/20">
                          <h4 className="font-medium text-base text-gray-800 dark:text-indigo-200 mb-4 flex items-center">
                            <ClipboardList className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                            Thông tin chi tiết
                          </h4>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-indigo-900/20 transition-colors hover:bg-purple-50/70 dark:hover:bg-purple-900/10">
                              <div className="bg-purple-500/20 dark:bg-purple-500/20 rounded-full p-2 mr-3 flex-shrink-0">
                                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-0.5">
                                  Khách hàng
                                </p>
                                <p className="font-medium text-base dark:text-indigo-200">
                                  {displayBooking.customerName ||
                                    "Không xác định"}
                                </p>
                              </div>
                            </div>

                            {displayBooking.date && (
                              <div className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-indigo-900/20 transition-colors hover:bg-purple-50/70 dark:hover:bg-purple-900/10">
                                <div className="bg-purple-500/20 dark:bg-purple-500/20 rounded-full p-2 mr-3 flex-shrink-0">
                                  <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-0.5">
                                    Ngày hẹn
                                  </p>
                                  <p className="font-medium text-base dark:text-indigo-200">
                                    {format(
                                      parseISO(displayBooking.date),
                                      "EEEE, dd/MM/yyyy",
                                      {
                                        locale: vi,
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                            )}

                            {displayBooking.startTime &&
                              displayBooking.endTime && (
                                <div className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-indigo-900/20 transition-colors hover:bg-purple-50/70 dark:hover:bg-purple-900/10">
                                  <div className="bg-purple-500/20 dark:bg-purple-500/20 rounded-full p-2 mr-3 flex-shrink-0">
                                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-0.5">
                                      Thời gian
                                    </p>
                                    <p className="font-medium text-base dark:text-indigo-200">
                                      {formatTime(displayBooking.startTime)} -{" "}
                                      {formatTime(displayBooking.endTime)}
                                    </p>
                                  </div>
                                </div>
                              )}

                            <div className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-indigo-900/20 transition-colors hover:bg-purple-50/70 dark:hover:bg-purple-900/10">
                              <div className="bg-purple-500/20 dark:bg-purple-500/20 rounded-full p-2 mr-3 flex-shrink-0">
                                <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-0.5">
                                  Địa điểm
                                </p>
                                <p className="font-medium text-base dark:text-indigo-200">
                                  {displayBooking.clinic.name ||
                                    "Tại cửa hàng chính"}
                                </p>
                              </div>
                            </div>

                            {displayBooking.doctorNote && (
                              <div className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-indigo-900/20 transition-colors hover:bg-purple-50/70 dark:hover:bg-purple-900/10">
                                <div className="bg-purple-500/20 dark:bg-purple-500/20 rounded-full p-2 mr-3 flex-shrink-0">
                                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-0.5">
                                    Ghi chú
                                  </p>
                                  <p className="font-medium text-base dark:text-indigo-200">
                                    {displayBooking.doctorNote}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="p-5 m-0">
                    {displayBooking.procedureHistory &&
                    displayBooking.procedureHistory.length > 0 ? (
                      <div className="max-w-3xl mx-auto">
                        <h3 className="font-semibold text-lg mb-5 flex items-center dark:text-indigo-200">
                          <CalendarRange className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                          Quy trình điều trị
                        </h3>

                        <div className="relative pb-1 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-700 scrollbar-track-transparent">
                          {/* Timeline connector */}
                          <div className="absolute left-[18px] top-6 bottom-0 w-0.5 bg-purple-200 dark:bg-purple-900/40"></div>

                          <div className="space-y-4">
                            {displayBooking.procedureHistory.map(
                              (procedure, index) => {
                                const current = isCurrentStep(
                                  Number(procedure.stepIndex)
                                );
                                return (
                                  <div
                                    key={`${procedure.stepIndex}-${index}`}
                                    className={cn(
                                      "rounded-lg p-4 relative overflow-hidden shadow-sm border ml-9 transition-all duration-200",
                                      current
                                        ? "border-purple-300 dark:border-purple-700/50 bg-purple-50/80 dark:bg-purple-900/30"
                                        : "border-gray-100 dark:border-indigo-800/30 dark:bg-indigo-950/40 hover:border-purple-200 dark:hover:border-purple-700/30"
                                    )}
                                  >
                                    {/* Step indicator circle */}
                                    <div
                                      className={cn(
                                        "absolute left-[-28px] top-4 w-9 h-9 rounded-full flex items-center justify-center z-10 shadow-sm",
                                        current
                                          ? "bg-purple-200 dark:bg-purple-800/60 border border-purple-400 dark:border-purple-600"
                                          : "bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700"
                                      )}
                                    >
                                      <span
                                        className={cn(
                                          "text-sm font-bold",
                                          current
                                            ? "text-purple-700 dark:text-purple-300"
                                            : "text-purple-700 dark:text-purple-300"
                                        )}
                                      >
                                        {procedure.stepIndex}
                                      </span>
                                    </div>

                                    {/* Current step indicator */}
                                    {current && (
                                      <div className="absolute right-2 top-2">
                                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-0 dark:bg-purple-800/40 dark:text-purple-200 px-2 py-0.5 h-5 text-xs">
                                          <div className="flex items-center gap-1">
                                            <ArrowRight className="h-3 w-3" />
                                            Hiện tại
                                          </div>
                                        </Badge>
                                      </div>
                                    )}

                                    {/* Status indicator */}
                                    <div
                                      className={cn(
                                        "absolute top-0 left-0 w-1.5 h-full",
                                        current
                                          ? "bg-purple-500 dark:bg-purple-400"
                                          : getStatusColor(procedure.status)
                                      )}
                                    ></div>

                                    <div className="pl-2">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h5
                                            className={cn(
                                              "font-medium text-base",
                                              current
                                                ? "text-purple-800 dark:text-purple-200"
                                                : "text-gray-800 dark:text-indigo-200"
                                            )}
                                          >
                                            {procedure.name}
                                          </h5>
                                          {procedure.dateCompleted && (
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                              Hoàn thành:{" "}
                                              {format(
                                                parseISO(
                                                  procedure.dateCompleted
                                                ),
                                                "dd/MM/yyyy",
                                                { locale: vi }
                                              )}
                                              {procedure.timeCompleted &&
                                                ` ${formatTime(
                                                  procedure.timeCompleted
                                                )}`}
                                            </p>
                                          )}
                                        </div>
                                        <div>
                                          {getStatusBadge(procedure.status)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <CalendarRange className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Chưa có thông tin quy trình
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
                          Thông tin quy trình điều trị sẽ được cập nhật khi bạn
                          bắt đầu dịch vụ.
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="doctor" className="p-5 m-0">
                    <div className="max-w-4xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Doctor information */}
                        {displayBooking.doctor ? (
                          <div className="bg-white dark:bg-indigo-950/40 rounded-xl shadow-sm border border-gray-100 dark:border-indigo-800/20 p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center dark:text-indigo-200">
                              <Stethoscope className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                              Thông tin bác sĩ
                            </h3>

                            <div className="flex items-center mb-6">
                              <Avatar className="h-16 w-16 border-2 border-purple-100 dark:border-purple-800/30 shadow-sm mr-4">
                                <AvatarImage
                                  src={
                                    displayBooking.doctor.imageUrl ||
                                    `/placeholder.svg?height=64&width=64` ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg"
                                  }
                                  alt={displayBooking.doctor.name}
                                />
                                <AvatarFallback className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-lg font-medium">
                                  {displayBooking.doctor.name
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-lg dark:text-indigo-200">
                                  {displayBooking.doctor.name}
                                </h4>
                                <p className="text-gray-500 dark:text-indigo-300/70">
                                  Bác sĩ phụ trách
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 dark:bg-indigo-900/20 rounded-xl p-6 flex flex-col items-center justify-center">
                            <Stethoscope className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Chưa có thông tin bác sĩ
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center">
                              Thông tin bác sĩ sẽ được cập nhật khi lịch hẹn
                              được xác nhận.
                            </p>
                          </div>
                        )}

                        {/* Clinic information */}
                        {displayBooking.clinic ? (
                          <div className="bg-white dark:bg-indigo-950/40 rounded-xl shadow-sm border border-gray-100 dark:border-indigo-800/20 p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center dark:text-indigo-200">
                              <Building2 className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                              Thông tin phòng khám
                            </h3>

                            <div className="flex items-center mb-6">
                              {displayBooking.clinic.imageUrl && (
                                <div className="h-16 w-16 rounded-lg overflow-hidden border-2 border-purple-100 dark:border-purple-800/30 shadow-sm mr-4">
                                  <Image
                                    src={
                                      displayBooking.clinic.imageUrl ||
                                      `/placeholder.svg?height=64&width=64` ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt={displayBooking.clinic.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium text-lg dark:text-indigo-200">
                                  {displayBooking.clinic.name}
                                </h4>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 dark:bg-indigo-900/20 rounded-xl p-6 flex flex-col items-center justify-center">
                            <Building2 className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Chưa có thông tin phòng khám
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center">
                              Thông tin phòng khám sẽ được cập nhật khi lịch hẹn
                              được xác nhận.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="p-5 m-0">
                    <div className="max-w-3xl mx-auto">
                      <h3 className="font-semibold text-lg mb-5 flex items-center dark:text-indigo-200">
                        <MessageSquare className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                        Ghi chú và hướng dẫn
                      </h3>

                      {displayBooking.doctorNote ? (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl mb-6 border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
                          <div className="flex items-start">
                            <div className="bg-indigo-500/20 dark:bg-indigo-500/20 rounded-full p-2 mr-3 flex-shrink-0">
                              <Stethoscope className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-base text-indigo-600 dark:text-indigo-300 font-medium mb-3">
                                Ghi chú của bác sĩ
                              </p>
                              <div className="text-base text-gray-700 dark:text-indigo-200 bg-white/50 dark:bg-indigo-950/30 p-4 rounded-lg border border-indigo-100/70 dark:border-indigo-800/20">
                                {displayBooking.doctorNote}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 dark:bg-indigo-900/20 rounded-xl p-6 flex flex-col items-center justify-center mb-6">
                          <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Chưa có ghi chú
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-center">
                            Bác sĩ sẽ thêm ghi chú sau khi khám.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              )}
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isRescheduleDialogOpen}
        onOpenChange={setIsRescheduleDialogOpen}
      >
        <DialogContent className="[&>button]:hidden sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] p-0 border-0 shadow-xl rounded-xl dark:bg-indigo-950/95 dark:border dark:border-indigo-800/30 max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <div className="absolute top-3 right-3 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full bg-black/10 hover:bg-black/20"
                onClick={() => setIsRescheduleDialogOpen(false)}
              >
                <X className="h-4 w-4 text-white" />
                <span className="sr-only">Đóng</span>
              </Button>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700/90 dark:to-indigo-700/90 p-5 rounded-t-xl">
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                <CalendarIconFull className="h-6 w-6" />
                Đặt lại lịch hẹn
              </DialogTitle>
              <p className="text-white text-opacity-90 text-base">
                Chọn ngày và giờ mới cho lịch hẹn của bạn
              </p>
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left column - Current booking and warning */}
              <div>
                {/* Warning message */}
                <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 flex items-start gap-4 shadow-sm">
                  <div className="flex-shrink-0 mt-0.5">
                    <Info className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-amber-800 dark:text-amber-300 mb-2">
                      Lưu ý quan trọng
                    </h4>
                    <p className="text-base text-amber-700 dark:text-amber-300/90">
                      Bạn chỉ có thể đặt lịch vào ngày/giờ trễ hơn so với lịch
                      hẹn hiện tại.
                    </p>
                  </div>
                </div>

                {/* Current booking info */}
                {displayBooking && (
                  <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-5 shadow-sm">
                    <h4 className="font-medium text-lg text-purple-800 dark:text-purple-200 mb-4 flex items-center">
                      <CalendarClock className="h-6 w-6 mr-2.5 text-purple-600 dark:text-purple-400" />
                      Lịch hẹn hiện tại
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center text-base">
                        <CalendarIcon className="h-6 w-6 mr-3.5 text-purple-500 dark:text-purple-400" />
                        <span className="text-purple-700 dark:text-purple-300 font-medium text-base">
                          {format(
                            parseISO(displayBooking.date),
                            "EEEE, dd/MM/yyyy",
                            { locale: vi }
                          )}
                        </span>
                      </div>
                      {displayBooking.startTime && (
                        <div className="flex items-center text-base">
                          <Clock className="h-6 w-6 mr-3.5 text-purple-500 dark:text-purple-400" />
                          <span className="text-purple-700 dark:text-purple-300 font-medium text-base">
                            {formatTime(displayBooking.startTime)}
                            {displayBooking.endTime &&
                              ` - ${formatTime(displayBooking.endTime)}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Time selection UI - Improved to use buttons instead of dropdown */}
                <div className="mb-8">
                  <h4 className="font-medium text-lg text-gray-800 dark:text-indigo-200 mb-4 flex items-center">
                    <Clock className="h-6 w-6 mr-3 text-purple-600 dark:text-purple-400" />
                    Chọn giờ mới
                  </h4>

                  {selectedDate ? (
                    <div className="bg-white dark:bg-indigo-950/30 rounded-xl border border-gray-200 dark:border-indigo-800/30 p-5 shadow-sm">
                      {renderTimeSlots()}

                      {selectedTime && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-indigo-800/30">
                          <div className="flex items-center text-purple-600 dark:text-purple-400">
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            <span className="font-medium">
                              Bạn đã chọn: {selectedTime}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-indigo-900/20 rounded-xl border border-gray-200 dark:border-indigo-800/30 p-6 text-center">
                      <Clock className="h-12 w-12 mx-auto text-gray-300 dark:text-indigo-700 mb-2" />
                      <p className="text-gray-500 dark:text-indigo-300/70">
                        Vui lòng chọn ngày trước khi chọn giờ
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column - Information and Confirmation */}
              <div className="bg-white/50 dark:bg-indigo-900/10 p-6 rounded-xl border border-gray-100 dark:border-indigo-800/20 shadow-sm">
                {/* Information about new appointment */}
                <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl p-4">
                  <h4 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">
                    Thông tin đặt lịch mới
                  </h4>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-indigo-700 dark:text-indigo-300">
                        {format(selectedDate ?? new Date(), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-indigo-700 dark:text-indigo-300">
                        {selectedTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-indigo-900/10 p-6 rounded-xl border border-gray-100 dark:border-indigo-800/20 shadow-sm mb-5">
                  <h4 className="font-medium text-lg text-gray-800 dark:text-indigo-200 mb-5 flex items-center">
                    <Stethoscope className="h-6 w-6 mr-3 text-purple-600 dark:text-purple-400" />
                    Chọn bác sĩ
                  </h4>

                  {doctors.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {doctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className={cn(
                            "flex items-center p-3 rounded-lg border transition-all cursor-pointer",
                            selectedDoctor?.id === doctor.id
                              ? "bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700"
                              : "bg-white dark:bg-indigo-950/40 border-gray-200 dark:border-indigo-800/30 hover:border-purple-200 dark:hover:border-purple-800/50"
                          )}
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          <Avatar className="h-12 w-12 mr-3">
                            <AvatarImage
                              src={
                                doctor.profilePictureUrl || "/placeholder.svg"
                              }
                              alt={doctor.fullName}
                            />
                            <AvatarFallback className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                              {doctor.fullName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium dark:text-indigo-200">
                              {doctor.fullName}
                            </p>
                            {doctor.doctorCertificates &&
                              doctor.doctorCertificates.length > 0 && (
                                <p className="text-sm text-gray-500 dark:text-indigo-300/70">
                                  {doctor.doctorCertificates[0].certificateName}
                                </p>
                              )}
                          </div>
                          {selectedDoctor?.id === doctor.id && (
                            <CheckCircle2 className="ml-auto h-5 w-5 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center">
                      <Stethoscope className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Không tìm thấy bác sĩ cho dịch vụ này
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-white/50 dark:bg-indigo-900/10 p-6 rounded-xl border border-gray-100 dark:border-indigo-800/20 shadow-sm">
                  <h4 className="font-medium text-lg text-gray-800 dark:text-indigo-200 mb-5 flex items-center">
                    <ArrowRightCircle className="h-6 w-6 mr-3 text-purple-600 dark:text-purple-400" />
                    Chọn ngày mới
                  </h4>

                  {/* Custom calendar implementation */}
                  <div className="bg-white dark:bg-indigo-950/60 rounded-xl border border-gray-200 dark:border-indigo-800/30 p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevMonth}
                        className="h-8 w-8 p-0 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-full"
                        disabled={!selectedDoctor}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>

                      <h3 className="font-medium text-sm dark:text-indigo-200">
                        {format(currentMonth, "MMMM yyyy", { locale: vi })}
                      </h3>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextMonth}
                        className="h-8 w-8 p-0 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-full"
                        disabled={!selectedDoctor}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>

                    {!selectedDoctor ? (
                      <div className="bg-gray-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center my-4">
                        <CalendarIcon className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Vui lòng chọn bác sĩ trước khi chọn ngày
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(
                            (day) => (
                              <div
                                key={day}
                                className="text-center font-medium text-gray-600 dark:text-indigo-300 text-xs py-1"
                              >
                                {day}
                              </div>
                            )
                          )}
                        </div>

                        <div className="grid grid-cols-7 gap-1.5">
                          {generateCalendarDays().map((day, i) => {
                            // Check if this day is disabled
                            const isDisabled = day ? isDateDisabled(day) : true;

                            // Check if this day is the selected date
                            const isSelected =
                              day && selectedDate
                                ? isSameDay(day, selectedDate)
                                : false;

                            // Check if this day is today
                            const isDayToday = day ? isToday(day) : false;

                            return (
                              <div
                                key={i}
                                className={cn(
                                  "h-8 flex items-center justify-center rounded-md text-xs transition-colors duration-200",
                                  !day && "text-gray-300 dark:text-indigo-800",
                                  day &&
                                    !isDisabled &&
                                    !isSelected &&
                                    "hover:bg-purple-100 dark:hover:bg-indigo-900/40 cursor-pointer",
                                  day &&
                                    isDayToday &&
                                    !isSelected &&
                                    "bg-purple-500/20 dark:bg-purple-500/10 font-bold text-purple-700 dark:text-purple-400",
                                  day &&
                                    isSelected &&
                                    "bg-purple-600 dark:bg-purple-500 text-white font-bold shadow-sm",
                                  day &&
                                    isDisabled &&
                                    "text-gray-400 dark:text-indigo-800 cursor-not-allowed opacity-50"
                                )}
                                onClick={() =>
                                  day && !isDisabled && handleDateSelect(day)
                                }
                              >
                                {day ? day.getDate() : ""}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {selectedDate && (
                    <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-100 dark:border-indigo-800/30">
                      <div className="flex items-center">
                        <CalendarIconFull className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                        <p className="text-indigo-700 dark:text-indigo-300 font-medium">
                          {format(selectedDate, "EEEE, dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Action buttons */}
                <div className="flex space-x-4 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1 border-purple-200 dark:border-indigo-800/30 dark:bg-indigo-950/60 dark:text-indigo-200 dark:hover:bg-indigo-900/60 h-11 text-base rounded-xl"
                    onClick={() => setIsRescheduleDialogOpen(false)}
                  >
                    <X className="h-5 w-5 mr-2" />
                    Hủy
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600/90 hover:to-indigo-600/90 text-white font-medium shadow-md h-11 text-base rounded-xl transition-all duration-200"
                    onClick={handleReschedule}
                    disabled={isRescheduleSubmitButtonDisabled()}
                  >
                    {isRescheduling ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CalendarClock className="h-6 w-6 mr-2" />
                        Xác nhận đặt lịch
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
