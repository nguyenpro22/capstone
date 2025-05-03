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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("bookingDetailDialog");

  useEffect(() => {
    if (isOpen && booking.id) {
      console.log(`Booking dialog opened for booking ID: ${booking.id}`);
    }
  }, [isOpen, booking.id]);

  // Use the API data if available, otherwise use the prop
  const displayBooking = bookingDetail?.value;

  // Format time
  const formatTime = (time: string | null | undefined) => {
    if (!time) return t("notAvailable");
    return time.substring(0, 5);
  };

  // Get status badge
  const getStatusBadge = (status: string | undefined) => {
    if (!status)
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0 dark:bg-gray-800 dark:text-gray-300 text-sm px-3 py-1">
          {t("unknown")}
        </Badge>
      );

    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40 text-sm px-3 py-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 dark:bg-green-400"></span>
              {t("completed")}
            </div>
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/40 text-sm px-3 py-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>
              {t("pending")}
            </div>
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40 text-sm px-3 py-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>
              {t("inProgress")}
            </div>
          </Badge>
        );
      case "Uncompleted":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40 text-sm px-3 py-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 dark:bg-red-400"></span>
              {t("uncompleted")}
            </div>
          </Badge>
        );
      case "Waiting Approval":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-0 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40 text-sm px-3 py-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500 dark:bg-purple-400"></span>
              {t("waitingApproval")}
            </div>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0 dark:bg-gray-800 dark:text-gray-300 text-sm px-3 py-1">
            {t(status)}
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
      toast.error(t("fetchDoctorsError"));
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
      toast.error(t("rescheduleError"));
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
                <span className="sr-only">{t("close")}</span>
              </Button>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 h-20 flex items-center p-5">
              <div className="w-[90%] relative z-10">
                <DialogTitle className="text-lg font-bold text-white flex items-center gap-2 mb-1.5">
                  <CalendarClock className="h-6 w-6" />
                  {t("bookingDetail")}
                </DialogTitle>
                <div className="flex items-center">
                  <p className="text-white text-opacity-90 text-base">
                    {t("bookingId")}: {booking.id.substring(0, 8)}...
                  </p>
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
                    {t("overview")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 dark:data-[state=active]:border-purple-400 rounded-none px-2 h-full"
                  >
                    <CalendarRange className="h-4 w-4 mr-2" />
                    {t("timeline")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="doctor"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 dark:data-[state=active]:border-purple-400 rounded-none px-2 h-full"
                  >
                    <Stethoscope className="h-4 w-4 mr-2" />
                    {t("doctorAndClinic")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 dark:data-[state=active]:border-purple-400 rounded-none px-2 h-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t("notes")}
                  </TabsTrigger>
                </TabsList>
              </div>

              {isLoading ? (
                <div className="p-6 flex justify-center items-center h-64">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500 dark:text-purple-400" />
                    <p className="text-sm text-gray-500 dark:text-indigo-300/70">
                      {t("loading")}
                    </p>
                  </div>
                </div>
              ) : isError ? (
                <div className="p-6 flex flex-col justify-center items-center h-64">
                  <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400 mb-4" />
                  <p className="text-center text-base text-red-500 dark:text-red-400 font-medium">
                    {t("error")}
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="mt-4 border-purple-200 dark:border-indigo-800/30 dark:bg-indigo-950/60 dark:text-indigo-200 dark:hover:bg-indigo-900/60"
                    onClick={() => refetch()}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    {t("retry")}
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
                              {t("currentStep")}
                            </p>
                            <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                              {t("step")} {booking.stepIndex}: {booking.name}
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-indigo-900/30 rounded-lg p-4 mb-4 shadow-sm border border-gray-100 dark:border-indigo-800/20">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(booking.status)}
                            <span className="font-medium text-lg dark:text-indigo-200">
                              {getStatusBadge(booking.status)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-indigo-300/70">
                            {t("percentCompleted", {
                              percent: getStatusProgress(booking.status),
                            })}
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
                                {t("date")}
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
                                {t("time")}
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
                              {t("service")}
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
                          {t("loadDetails")}
                        </p>
                        <Button
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600/90 hover:to-indigo-600/90 text-white font-medium shadow-sm text-base h-10"
                          onClick={() => refetch()}
                        >
                          <RefreshCcw className="h-5 w-5 mr-2" />
                          {t("fetchDetails")}
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

                        {/* Current Step Card - Highlighted */}
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-5 shadow-sm">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="bg-purple-500/20 dark:bg-purple-500/30 rounded-full p-2.5 flex-shrink-0 mt-1">
                              <Milestone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-base text-purple-700 dark:text-purple-300 font-medium mb-1">
                                {t("currentStep")}
                              </p>
                              <h4 className="text-xl font-semibold text-purple-800 dark:text-purple-200">
                                {t("step")} {booking.stepIndex}: {booking.name}
                              </h4>
                            </div>
                          </div>

                          {displayBooking.procedureHistory &&
                            displayBooking.procedureHistory.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-purple-200/70 dark:border-purple-800/30">
                                <div className="flex items-center justify-between text-sm mb-2">
                                  <span className="font-medium text-purple-700 dark:text-purple-300">
                                    {t("stepOf", {
                                      current: booking.stepIndex,
                                      total:
                                        displayBooking.procedureHistory.length,
                                    })}
                                  </span>
                                  <span className="font-medium text-purple-700 dark:text-purple-300">
                                    {t("percentCompleted", {
                                      percent: Math.round(
                                        (booking.stepIndex /
                                          displayBooking.procedureHistory
                                            .length) *
                                          100
                                      ),
                                    })}
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
                            {t("close")}
                          </Button>

                          <Button
                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-md h-12 text-base rounded-xl transition-all duration-200"
                            onClick={handleRescheduleClick}
                            disabled={isRescheduleButtonDisabled(
                              displayBooking
                            )}
                          >
                            <CalendarClock className="h-5 w-5 mr-2" />
                            {t("reschedule")}
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
                            {t("details")}
                          </h4>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-indigo-900/20 transition-colors hover:bg-purple-50/70 dark:hover:bg-purple-900/10">
                              <div className="bg-purple-500/20 dark:bg-purple-500/20 rounded-full p-2 mr-3 flex-shrink-0">
                                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-0.5">
                                  {t("customer")}
                                </p>
                                <p className="font-medium text-base dark:text-indigo-200">
                                  {displayBooking.customerName || t("unknown")}
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
                                    {t("date")}
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
                                      {t("time")}
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
                                  {t("location")}
                                </p>
                                <p className="font-medium text-base dark:text-indigo-200">
                                  {displayBooking.clinic.name ||
                                    t("notAvailable")}
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
                                    {t("doctorNote")}
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

                  {/* Timeline Tab Content */}
                  <TabsContent value="timeline" className="p-5 m-0">
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                          <CalendarRange className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-xl dark:text-indigo-200">
                          {t("timeline")}
                        </h3>
                      </div>

                      {displayBooking.procedureHistory &&
                      displayBooking.procedureHistory.length > 0 ? (
                        <div className="relative">
                          {/* Progress line */}
                          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-indigo-800/30"></div>

                          {/* Steps */}
                          <div className="space-y-6">
                            {displayBooking.procedureHistory.map(
                              (step, index) => {
                                const isCompleted = step.status === "Completed";
                                const isCurrent =
                                  parseInt(step.stepIndex) ===
                                  booking.stepIndex;

                                return (
                                  <div
                                    key={index}
                                    className={`relative flex items-start p-4 rounded-xl border ${
                                      isCurrent
                                        ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30"
                                        : isCompleted
                                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30"
                                        : "bg-white dark:bg-indigo-950/40 border-gray-100 dark:border-indigo-800/20"
                                    }`}
                                  >
                                    <div
                                      className={`z-10 h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
                                        isCurrent
                                          ? "bg-purple-100 dark:bg-purple-800/30"
                                          : isCompleted
                                          ? "bg-green-100 dark:bg-green-800/30"
                                          : "bg-gray-100 dark:bg-indigo-900/30"
                                      }`}
                                    >
                                      {isCompleted ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                                      ) : isCurrent ? (
                                        <Milestone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                      ) : (
                                        <Clock3 className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                      )}
                                    </div>

                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <h4
                                          className={`font-medium text-lg ${
                                            isCurrent
                                              ? "text-purple-800 dark:text-purple-300"
                                              : isCompleted
                                              ? "text-green-800 dark:text-green-300"
                                              : "text-gray-800 dark:text-indigo-200"
                                          }`}
                                        >
                                          {t("step")} {step.stepIndex}:{" "}
                                          {step.procedureName || t("unknown")}
                                        </h4>
                                        <Badge
                                          className={`${
                                            isCompleted
                                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                              : isCurrent
                                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                          }`}
                                        >
                                          {isCompleted
                                            ? t("completed")
                                            : isCurrent
                                            ? t("inProgress")
                                            : t("pending")}
                                        </Badge>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                        <div className="flex items-center">
                                          <Clock className="h-4 w-4 text-gray-500 dark:text-indigo-400 mr-2" />
                                          <span className="text-sm text-gray-600 dark:text-indigo-300">
                                            {t("duration")}:{" "}
                                            {step.duration || 0} {t("minutes")}
                                          </span>
                                        </div>

                                        {step.dateCompleted && (
                                          <div className="flex items-center">
                                            <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-indigo-400 mr-2" />
                                            <span className="text-sm text-gray-600 dark:text-indigo-300">
                                              {t("completedAt")}:{" "}
                                              {format(
                                                parseISO(step.dateCompleted),
                                                "dd/MM/yyyy",
                                                { locale: vi }
                                              )}
                                            </span>
                                          </div>
                                        )}

                                        {step.timeCompleted && (
                                          <div className="flex items-center">
                                            <Clock3 className="h-4 w-4 text-gray-500 dark:text-indigo-400 mr-2" />
                                            <span className="text-sm text-gray-600 dark:text-indigo-300">
                                              {t("atTime")}:{" "}
                                              {formatTime(step.timeCompleted)}
                                            </span>
                                          </div>
                                        )}

                                        <div className="flex items-center">
                                          <Package className="h-4 w-4 text-gray-500 dark:text-indigo-400 mr-2" />
                                          <span className="text-sm text-gray-600 dark:text-indigo-300">
                                            {t("procedureType")}:{" "}
                                            {step.procedurePriceType ||
                                              t("standard")}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 dark:bg-indigo-900/20 rounded-xl p-8 text-center">
                          <CalendarRange className="h-12 w-12 text-gray-400 dark:text-indigo-500/50 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-indigo-300">
                            {t("noProcedure")}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Doctor & Clinic Tab Content */}
                  <TabsContent value="doctor" className="p-5 m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Doctor Information */}
                      <div className="space-y-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="font-semibold text-xl dark:text-indigo-200">
                            {t("doctorAndClinic")}
                          </h3>
                        </div>

                        <div className="bg-white dark:bg-indigo-950/40 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-indigo-800/20">
                          {displayBooking.doctor ? (
                            <div className="flex flex-col items-center text-center p-4">
                              <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4 border-2 border-purple-200 dark:border-purple-800/50">
                                <Image
                                  src={
                                    displayBooking.doctor.imageUrl ||
                                    "/placeholder.svg?height=96&width=96&query=doctor"
                                  }
                                  alt={displayBooking.doctor.name}
                                  className="object-cover"
                                  fill
                                />
                              </div>
                              <h4 className="font-semibold text-lg dark:text-indigo-200 mb-1">
                                {displayBooking.doctor.name}
                              </h4>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-center p-6">
                              <Stethoscope className="h-16 w-16 text-gray-300 dark:text-indigo-800/50 mb-4" />
                              <p className="text-gray-600 dark:text-indigo-300/70">
                                {t("noDoctorInfo")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Clinic Information */}
                      <div className="space-y-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="font-semibold text-xl dark:text-indigo-200">
                            {t("clinic")}
                          </h3>
                        </div>

                        <div className="bg-white dark:bg-indigo-950/40 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-indigo-800/20">
                          {displayBooking.clinic ? (
                            <div>
                              {displayBooking.clinic.imageUrl && (
                                <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
                                  <Image
                                    src={
                                      displayBooking.clinic.imageUrl ||
                                      "/placeholder.svg"
                                    }
                                    alt={displayBooking.clinic.name}
                                    className="w-full h-full object-cover"
                                    width={400}
                                    height={160}
                                  />
                                </div>
                              )}

                              <h4 className="font-semibold text-lg dark:text-indigo-200 mb-2">
                                {displayBooking.clinic.name}
                              </h4>

                              <div className="space-y-3 mt-4">
                                <div className="flex items-start">
                                  <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3 mt-0.5" />
                                  <div>
                                    <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">
                                      {t("clinicAddress")}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start">
                                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3 mt-0.5" />
                                  <div>
                                    <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">
                                      {t("clinicWorkingHours")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-center p-6">
                              <MapPin className="h-16 w-16 text-gray-300 dark:text-indigo-800/50 mb-4" />
                              <p className="text-gray-600 dark:text-indigo-300/70">
                                {t("noClinicInfo")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Notes Tab Content */}
                  <TabsContent value="notes" className="p-5 m-0">
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-xl dark:text-indigo-200">
                          {t("notes")}
                        </h3>
                      </div>

                      <div className="bg-white dark:bg-indigo-950/40 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-indigo-800/20">
                        {displayBooking.doctorNote ? (
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2 mr-3 flex-shrink-0">
                                <Stethoscope className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-base text-gray-800 dark:text-indigo-200 mb-1">
                                  {t("doctorNote")}
                                </h4>
                                <div className="p-4 bg-gray-50 dark:bg-indigo-900/20 rounded-lg border border-gray-100 dark:border-indigo-800/20">
                                  <p className="text-gray-700 dark:text-indigo-200 whitespace-pre-line">
                                    {displayBooking.doctorNote}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-indigo-800/20">
                              <h4 className="font-medium text-base text-gray-800 dark:text-indigo-200 mb-3">
                                {t("doctorInstructions")}
                              </h4>
                              <ul className="space-y-2">
                                <li className="flex items-start">
                                  <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2 mt-0.5">
                                    <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                                  </div>
                                  <span className="text-gray-700 dark:text-indigo-200">
                                    {t("takeMedicine")}
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2 mt-0.5">
                                    <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                                  </div>
                                  <span className="text-gray-700 dark:text-indigo-200">
                                    {t("avoidSpicy")}
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2 mt-0.5">
                                    <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                                  </div>
                                  <span className="text-gray-700 dark:text-indigo-200">
                                    {t("revisit")}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-center p-6">
                            <MessageSquare className="h-16 w-16 text-gray-300 dark:text-indigo-800/50 mb-4" />
                            <p className="text-gray-600 dark:text-indigo-300/70">
                              {t("noNotes")}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-indigo-300/50 mt-2">
                              {t("doctorWillAddNotes")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
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
