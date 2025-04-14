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
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Milestone,
  CalendarIcon as CalendarIconFull,
  Info,
  ArrowRightCircle,
} from "lucide-react";
import {
  useGetBookingByBookingIdQuery,
  useUpdateBookingMutation,
} from "@/features/booking/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { Progress } from "@/components/ui/progress";
import type { Booking } from "@/features/booking/types";
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

interface BookingDetailDialogProps {
  booking: Booking;
  children: React.ReactNode;
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

  const [showCalendarView, setShowCalendarView] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Reschedule state
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [rescheduleBooking, { isLoading: isRescheduling }] =
    useUpdateBookingMutation();

  // Available time slots (in a real app, these would come from an API)
  const availableTimeSlots = [
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

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && booking.id) {
      console.log(`Booking dialog opened for booking ID: ${booking.id}`);
    }
  }, [isOpen, booking.id]);

  // Reset reschedule form when dialog opens
  useEffect(() => {
    if (isRescheduleDialogOpen) {
      // Set default date to the next day after the original booking
      const originalDate = getOriginalBookingDate();
      setSelectedDate(addDays(originalDate, 1));
      setSelectedTime(undefined);
    }
  }, [isRescheduleDialogOpen]);

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
    if (!selectedDate || !selectedTime || !booking.id) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ngày và giờ cho lịch hẹn mới",
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
      const originalTimeInMinutes = parseTimeToMinutes(originalTime);

      if (timeInMinutes <= originalTimeInMinutes) {
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
      }).unwrap();

      // Close the reschedule dialog
      setIsRescheduleDialogOpen(false);

      // Show success toast with more prominent styling
      toast({
        title: "Đặt lại lịch thành công",
        description: `Lịch hẹn của bạn đã được đặt lại vào ngày ${formattedDate} lúc ${selectedTime}`,
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
  const isRescheduleButtonDisabled = () => {
    // Disable if no date or time is selected
    if (!selectedDate || !selectedTime) return true;

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

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    console.log("Selected date:", date);
    setSelectedDate(date);
  };

  // Handle reschedule button click
  const handleRescheduleClick = () => {
    // Close the detail dialog
    setIsOpen(false);
    // Open the reschedule dialog
    setIsRescheduleDialogOpen(true);
  };

  // Render time slot buttons in grid layout for better UI
  const renderTimeSlots = () => {
    const morningSlots = availableTimeSlots.filter(
      (time) => parseTimeToMinutes(time) < 12 * 60
    );
    const afternoonSlots = availableTimeSlots.filter(
      (time) => parseTimeToMinutes(time) >= 12 * 60
    );

    return (
      <div className="space-y-4">
        <div>
          <h5 className="text-sm font-medium text-gray-600 dark:text-indigo-300 mb-2">
            Buổi sáng
          </h5>
          <div className="grid grid-cols-4 gap-2">
            {morningSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={cn(
                  "h-10 w-full",
                  selectedTime === time
                    ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                    : "border-gray-200 dark:border-indigo-800/30 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/30",
                  isTimeDisabled(time) &&
                    "opacity-50 cursor-not-allowed dark:opacity-40 pointer-events-none"
                )}
                disabled={isTimeDisabled(time)}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-sm font-medium text-gray-600 dark:text-indigo-300 mb-2">
            Buổi chiều
          </h5>
          <div className="grid grid-cols-4 gap-2">
            {afternoonSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={cn(
                  "h-10 w-full",
                  selectedTime === time
                    ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                    : "border-gray-200 dark:border-indigo-800/30 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/30",
                  isTimeDisabled(time) &&
                    "opacity-50 cursor-not-allowed dark:opacity-40 pointer-events-none"
                )}
                disabled={isTimeDisabled(time)}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[1000px] md:max-w-[1200px] lg:max-w-[1300px] p-0 border-0 shadow-xl rounded-lg dark:bg-indigo-950 dark:border dark:border-indigo-800/30 max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <div className="absolute top-3 right-3 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full bg-black/10 hover:bg-black/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4 text-white" />
                <span className="sr-only">Đóng</span>
              </Button>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 h-24 flex items-center p-6">
              <div className="w-full relative z-10">
                <DialogTitle className="text-xl font-bold text-white flex items-center gap-2 mb-2">
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
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6">
                {/* Left column - Basic information */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 dark:text-indigo-200">
                    {displayBooking.service?.name || booking.serviceName}
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

                    {displayBooking.procedureHistory &&
                      displayBooking.procedureHistory.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800/30">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-purple-700 dark:text-purple-300">
                              Bước {booking.stepIndex} /{" "}
                              {displayBooking.procedureHistory.length}
                            </span>
                            <span className="text-purple-700 dark:text-purple-300">
                              {Math.round(
                                (booking.stepIndex /
                                  displayBooking.procedureHistory.length) *
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
                            className="h-2.5 mt-2 bg-purple-200 dark:bg-purple-800/30"
                          />
                        </div>
                      )}
                  </div>

                  <div className="bg-gray-50 dark:bg-indigo-900/30 rounded-lg p-4 mb-4 shadow-sm border border-gray-100 dark:border-indigo-800/20">
                    <div className="flex justify-between items-center mb-2">
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
                      <span className="text-sm text-gray-500 dark:text-indigo-300/70">
                        {getStatusProgress(displayBooking.status)}%
                      </span>
                    </div>
                    <Progress
                      value={getStatusProgress(displayBooking.status)}
                      className="h-2.5 bg-gray-200 dark:bg-indigo-900/50"
                    />
                  </div>

                  {/* Doctor and clinic info in a compact row */}
                  <div className="flex gap-4 mb-4">
                    {/* Doctor information with image */}
                    {displayBooking.doctor && (
                      <div className="flex-1 border border-gray-100 dark:border-indigo-800/30 dark:bg-indigo-950/40 rounded-lg p-4 shadow-sm transition-all hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800/40">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-purple-100 dark:border-purple-800/30 shadow-sm">
                            <AvatarImage
                              src={
                                displayBooking.doctor.imageUrl ||
                                `/placeholder.svg?height=48&width=48` ||
                                "/placeholder.svg"
                              }
                              alt={displayBooking.doctor.name}
                            />
                            <AvatarFallback className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-medium">
                              {displayBooking.doctor.name
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-0.5">
                              Bác sĩ
                            </p>
                            <p className="font-medium text-base dark:text-indigo-200">
                              {displayBooking.doctor.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Clinic information */}
                    {displayBooking.clinic && (
                      <div className="flex-1 border border-gray-100 dark:border-indigo-800/30 dark:bg-indigo-950/40 rounded-lg p-4 shadow-sm transition-all hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800/40">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-500/20 dark:bg-purple-500/10 rounded-full p-2 flex-shrink-0 shadow-sm">
                            <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-0.5">
                              Phòng khám
                            </p>
                            <p className="font-medium text-base dark:text-indigo-200">
                              {displayBooking.clinic.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Basic booking information */}
                  <div className="bg-white dark:bg-indigo-950/40 rounded-lg p-4 mb-4 shadow-sm border border-gray-100 dark:border-indigo-800/20">
                    <h4 className="font-medium text-base text-gray-800 dark:text-indigo-200 mb-3 flex items-center">
                      <ClipboardList className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                      Thông tin lịch hẹn
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-lg">
                        <div className="bg-purple-500/20 dark:bg-purple-500/20 rounded-full p-2 mr-3 flex-shrink-0">
                          <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-0.5">
                            Khách hàng
                          </p>
                          <p className="font-medium text-base dark:text-indigo-200">
                            {displayBooking.customerName || "Không xác định"}
                          </p>
                        </div>
                      </div>

                      {displayBooking.date && (
                        <div className="flex items-start bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-lg">
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
                                "dd/MM/yyyy",
                                {
                                  locale: vi,
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {displayBooking.startTime && displayBooking.endTime && (
                        <div className="flex items-start bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-lg">
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

                      <div className="flex items-start bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-lg">
                        <div className="bg-purple-500/20 dark:bg-purple-500/20 rounded-full p-2 mr-3 flex-shrink-0">
                          <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-0.5">
                            Dịch vụ
                          </p>
                          <p className="font-medium text-base dark:text-indigo-200">
                            {displayBooking.service?.name ||
                              booking.serviceName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {displayBooking.doctorNote && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-4 border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
                      <div className="flex items-start">
                        <div className="bg-indigo-500/20 dark:bg-indigo-500/20 rounded-full p-2 mr-3 flex-shrink-0">
                          <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">
                            Ghi chú của bác sĩ
                          </p>
                          <p className="text-base mt-1.5 text-gray-700 dark:text-indigo-200 bg-white/50 dark:bg-indigo-950/30 p-3 rounded-md border border-indigo-100/70 dark:border-indigo-800/20">
                            {displayBooking.doctorNote}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex space-x-3 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1 border-purple-200 dark:border-indigo-800/30 dark:bg-indigo-950/60 dark:text-indigo-200 dark:hover:bg-indigo-900/60 h-12 text-base rounded-xl transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-5 w-5 mr-2" />
                      Đóng
                    </Button>

                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600/90 hover:to-indigo-600/90 text-white font-medium shadow-sm h-12 text-base rounded-xl transition-all duration-200"
                      onClick={handleRescheduleClick}
                    >
                      <CalendarClock className="h-5 w-5 mr-2" />
                      Đặt lại lịch
                    </Button>
                  </div>
                </div>

                {/* Right column - Calendar and timeline */}
                <div>
                  {/* Service image if available */}
                  {displayBooking.service?.imageUrls && (
                    <div className="mb-4 overflow-hidden rounded-lg border border-gray-100 dark:border-indigo-800/30 shadow-sm">
                      <Image
                        src={
                          displayBooking.service.imageUrls[0] ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={
                          displayBooking.service?.name || booking.serviceName
                        }
                        className="w-full h-40 object-cover"
                        width={400}
                        height={160}
                      />
                    </div>
                  )}

                  {/* Calendar view */}
                  <div className="mb-4 bg-white dark:bg-indigo-950/40 rounded-lg shadow-sm border border-gray-100 dark:border-indigo-800/20 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-900/20 dark:to-indigo-900/20 p-3 border-b border-gray-100 dark:border-indigo-800/20">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-base dark:text-indigo-200 flex items-center">
                          <CalendarClock className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                          Lịch hẹn
                        </h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={prevMonth}
                            className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 h-8 w-8 p-0 rounded-full"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={nextMonth}
                            className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 h-8 w-8 p-0 rounded-full"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-medium text-base dark:text-indigo-200 text-center mt-1">
                        {format(currentMonth, "MMMM yyyy", { locale: vi })}
                      </h3>
                    </div>

                    <div className="p-4">
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
                        {generateCalendarDays().map((day, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-10 flex items-center justify-center rounded-md text-sm transition-colors",
                              !day && "text-gray-300 dark:text-indigo-800",
                              day &&
                                isToday(day) &&
                                !isSameDay(
                                  day,
                                  parseISO(displayBooking.date)
                                ) &&
                                "bg-purple-500/20 dark:bg-purple-500/10 font-medium text-purple-700 dark:text-purple-400",
                              day &&
                                displayBooking?.date &&
                                isSameDay(day, parseISO(displayBooking.date)) &&
                                "bg-purple-600 dark:bg-purple-500 text-white font-bold"
                            )}
                          >
                            {day ? day.getDate() : ""}
                          </div>
                        ))}
                      </div>

                      {displayBooking?.date && (
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-indigo-800/20">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-indigo-300">
                              Ngày khám hiện tại:
                            </span>
                            <div
                              className={`px-3 py-1.5 rounded-full ${getStatusColor(
                                displayBooking.status
                              )} text-white text-xs flex items-center gap-2`}
                            >
                              <CalendarIcon className="h-4 w-4" />
                              {format(
                                parseISO(displayBooking.date),
                                "dd/MM/yyyy",
                                {
                                  locale: vi,
                                }
                              )}
                              {displayBooking.startTime &&
                                ` - ${formatTime(displayBooking.startTime)}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Treatment timeline */}
                  {displayBooking.procedureHistory &&
                    displayBooking.procedureHistory.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-base mb-3 flex items-center dark:text-indigo-200">
                          <CalendarRange className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                          Quy trình điều trị
                        </h4>

                        <div className="relative pb-1 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-700 scrollbar-track-transparent">
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
                    )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isRescheduleDialogOpen}
        onOpenChange={setIsRescheduleDialogOpen}
      >
        <DialogContent className="sm:max-w-[1200px] md:max-w-[1350px] lg:max-w-[1500px] p-0 border-0 shadow-xl rounded-xl dark:bg-indigo-950/95 dark:border dark:border-indigo-800/30 max-h-[90vh] overflow-y-auto">
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

            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700/90 dark:to-indigo-700/90 p-7 rounded-t-xl">
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-3">
                <CalendarIconFull className="h-8 w-8" />
                Đặt lại lịch hẹn
              </DialogTitle>
              <p className="text-white text-opacity-90 text-lg">
                Chọn ngày và giờ mới cho lịch hẹn của bạn
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                <div className="bg-white/50 dark:bg-indigo-900/10 p-6 rounded-xl border border-gray-100 dark:border-indigo-800/20 shadow-sm">
                  <h4 className="font-medium text-lg text-gray-800 dark:text-indigo-200 mb-5 flex items-center">
                    <ArrowRightCircle className="h-6 w-6 mr-3 text-purple-600 dark:text-purple-400" />
                    Chọn ngày mới
                  </h4>

                  {/* Custom calendar implementation */}
                  <div className="bg-white dark:bg-indigo-950/60 rounded-xl border border-gray-200 dark:border-indigo-800/30 p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevMonth}
                        className="h-8 w-8 p-0 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-full"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>

                      <h3 className="font-medium text-base dark:text-indigo-200">
                        {format(currentMonth, "MMMM yyyy", { locale: vi })}
                      </h3>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextMonth}
                        className="h-8 w-8 p-0 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-full"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                        <div
                          key={day}
                          className="text-center font-medium text-gray-600 dark:text-indigo-300 text-xs py-1"
                        >
                          {day}
                        </div>
                      ))}
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
                              "h-10 flex items-center justify-center rounded-md text-sm transition-colors duration-200",
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
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-purple-200 dark:border-indigo-800/30 dark:bg-indigo-950/60 dark:text-indigo-200 dark:hover:bg-indigo-900/60 h-14 text-lg rounded-xl"
                    onClick={() => setIsRescheduleDialogOpen(false)}
                  >
                    <X className="h-5 w-5 mr-2" />
                    Hủy
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600/90 hover:to-indigo-600/90 text-white font-medium shadow-md h-14 text-lg rounded-xl transition-all duration-200"
                    onClick={handleReschedule}
                    disabled={isRescheduleButtonDisabled()}
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
