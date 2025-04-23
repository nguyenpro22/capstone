"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
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
  Milestone,
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
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLazyGetBusyTimesQuery } from "@/features/customer-schedule/api";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useLazyGetDoctorByServiceIdQuery } from "@/features/services/api";
import type { Doctor } from "@/features/services/types";
import { RescheduleDialog } from "./reschedule/reschedule-dialog";

interface BookingDetailDialogProps {
  booking: Booking;
  children?: React.ReactNode;
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
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [fetchDoctors] = useLazyGetDoctorByServiceIdQuery();
  const [getDoctorAvailableTime] = useLazyGetAvalableTimesQuery();
  const [getBusyTime] = useLazyGetBusyTimesQuery();
  const [rescheduleBooking, { isLoading: isRescheduling }] =
    useUpdateBookingMutation();
  // Remove the useToast hook
  // const { toast } = useToast()

  useEffect(() => {
    if (isOpen && booking.id) {
      console.log(`Booking dialog opened for booking ID: ${booking.id}`);
    }
  }, [isOpen, booking.id]);

  // Use the API data if available, otherwise use the prop
  const displayBooking = bookingDetail?.value;

  // Format time
  const formatTime = (time: string | null | undefined) => {
    if (!time) return "N/A";
    return time.substring(0, 5);
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

  // Check if a procedure is the current step
  const isCurrentStep = (stepIndex: number) => {
    return stepIndex === booking.stepIndex;
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

  // Load doctors for the service
  const loadDoctors = async () => {
    if (!bookingDetail?.value?.service?.id) return;

    try {
      console.log(
        "Fetching doctors for service:",
        bookingDetail.value.service.id
      );
      const response = await fetchDoctors(
        bookingDetail.value.service.id
      ).unwrap();

      if (response.value?.doctorServices) {
        const doctorList = response.value.doctorServices.map(
          (doctorService) => doctorService.doctor
        );
        setDoctors(doctorList);
      }
    } catch (error) {
      console.error("Error loading doctors:", error);
      toast.error("Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.");
    }
  };

  // Fetch available times for a doctor on a specific date
  const fetchAvailableTimes = async (doctorId: string, date: string) => {
    try {
      // Fetch busy times for the customer
      const busyTimeResponse = await getBusyTime({
        customerId: user?.userId as string,
        date: date,
      }).unwrap();

      // Fetch doctor available times
      const doctorAvailableTimeResponse = await getDoctorAvailableTime({
        serviceIdOrCustomerScheduleId: bookingDetail?.value?.service?.id || "",
        date: date,
        doctorId: doctorId,
        clinicId: bookingDetail?.value?.clinic.id as string,
      }).unwrap();

      return {
        busyTimes: busyTimeResponse.value || [],
        doctorAvailableTimes: doctorAvailableTimeResponse.value || [],
      };
    } catch (error) {
      console.error("Error fetching availability data:", error);
      throw error;
    }
  };

  // Handle reschedule
  const handleReschedule = async (
    date: string,
    time: string,
    doctorId: string
  ) => {
    try {
      await rescheduleBooking({
        customerScheduleId: booking.id,
        date: date,
        startTime: time,
        // doctorId: doctorId, // Uncomment if API supports this
      }).unwrap();
    } catch (error) {
      console.error("Error rescheduling:", error);
      toast.error("Không thể hủy lịch hẹn. Vui lòng thử lại sau.");
    }
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
                onClick={() => setIsOpen(false)}
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

                  {/* Other tab contents remain the same */}
                  {/* ... */}
                </div>
              )}
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      {displayBooking && (
        <RescheduleDialog
          isOpen={isRescheduleDialogOpen}
          onClose={() => setIsRescheduleDialogOpen(false)}
          booking={booking}
          displayBooking={displayBooking}
          doctors={doctors}
          onReschedule={handleReschedule}
          isRescheduling={isRescheduling}
          fetchDoctors={loadDoctors}
          fetchAvailableTimes={fetchAvailableTimes}
          onSuccess={() => refetch()}
        />
      )}
    </>
  );
}
