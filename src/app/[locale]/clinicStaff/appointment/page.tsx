"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  useGetAppointmentsTotalQuery,
  useGetAppointmentsByDateQuery,
} from "@/features/booking/api";
import { useUpdateScheduleStatusMutation } from "@/features/customer-schedule/api";
import type {
  Appointment,
  AppointmentCounts,
  DailyData,
} from "@/features/booking/types";
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import ScheduleChangeForCustomerModal from "@/components/clinicStaff/customer-schedule/schedule-change-for-customer";

export default function AppointmentsPage() {
  const t = useTranslations("clinicStaffAppointment");

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmedAppointments, setConfirmedAppointments] = useState<string[]>(
    []
  );
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Format dates for API calls
  const monthFormatted = format(currentMonth, "MM-yyyy");
  const dateFormatted = format(selectedDate, "yyyy-MM-dd");

  // Fetch monthly appointment data
  const {
    data: monthlyData,
    isLoading: isLoadingMonthly,
    refetch: refetchMonthlyData,
  } = useGetAppointmentsTotalQuery(monthFormatted);

  // Fetch appointments for selected date
  const {
    data: dailyAppointments,
    isLoading: isLoadingDaily,
    refetch: refetchDailyAppointments,
  } = useGetAppointmentsByDateQuery(dateFormatted);

  // Create delayed refetch functions
  const delayedRefetchMonthlyData = useDelayedRefetch(refetchMonthlyData);
  const delayedRefetchDailyAppointments = useDelayedRefetch(
    refetchDailyAppointments
  );

  // Update schedule status mutation
  const [updateScheduleStatus, { isLoading: isUpdating }] =
    useUpdateScheduleStatusMutation();

  // Get days of current month for the calendar
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Set today as the selected date when component mounts
  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  // Calculate totals from API data
  const totalAppointments =
    monthlyData?.value?.days?.reduce(
      (sum: number, day: DailyData) => sum + day.counts.total,
      0
    ) || 0;

  const completedAppointments =
    monthlyData?.value?.days?.reduce(
      (sum: number, day: DailyData) => sum + day.counts.completed,
      0
    ) || 0;

  const pendingAppointments =
    monthlyData?.value?.days?.reduce(
      (sum: number, day: DailyData) => sum + day.counts.pending,
      0
    ) || 0;

  const inProgressAppointments =
    monthlyData?.value?.days?.reduce(
      (sum: number, day: DailyData) => sum + day.counts.inProgress,
      0
    ) || 0;

  const cancelledAppointments =
    monthlyData?.value?.days?.reduce(
      (sum: number, day: DailyData) => sum + day.counts.cancelled,
      0
    ) || 0;

  // Helper function to get counts for a specific day
  const getDayCounts = (date: Date): AppointmentCounts => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const dayData = monthlyData?.value?.days?.find(
      (day: DailyData) => day.date === formattedDate
    );

    return (
      dayData?.counts || {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        cancelled: 0,
      }
    );
  };

  // Get status counts for selected date
  const selectedDateCounts = getDayCounts(selectedDate);

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            {t("statusCompleted")}
          </Badge>
        );
      case "inprogress":
      case "in progress":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            {t("statusInProgress")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            {t("statusPending")}
          </Badge>
        );
      case "cancelled":
      case "canceled":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">
            {t("statusCancelled")}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "inprogress":
      case "in progress":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
      case "canceled":
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  // Handle confirm appointment
  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      setUpdatingId(appointmentId);
      await updateScheduleStatus({
        scheduleId: appointmentId,
        status: "In Progress",
      }).unwrap();

      toast.success(t("confirmSuccess"));

      // Add this appointment to the confirmed list
      setConfirmedAppointments((prev) => [...prev, appointmentId]);

      // Use delayed refetch for both data sources
      delayedRefetchDailyAppointments();
      delayedRefetchMonthlyData();
    } catch (error) {
      console.error("Failed to confirm appointment:", error);
      toast.error(t("confirmError"));
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle reschedule appointment
  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
  };

  // Handle reschedule success
  const handleRescheduleSuccess = () => {
    // Refetch data after successful reschedule
    delayedRefetchDailyAppointments();
    delayedRefetchMonthlyData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("pageTitle")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 dark:from-pink-900/20 dark:to-purple-900/20 dark:border-pink-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-pink-700">
              {t("totalAppointments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-700">
              {totalAppointments}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              {t("pendingAppointments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700">
              {pendingAppointments}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              {t("inProgressAppointments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {inProgressAppointments}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200 dark:from-green-900/20 dark:to-teal-900/20 dark:border-green-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              {t("completedAppointments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {completedAppointments}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 dark:from-red-900/20 dark:to-rose-900/20 dark:border-red-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              {t("cancelledAppointments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">
              {cancelledAppointments}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>{t("calendar")}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Header - Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {[
                t("sunday"),
                t("monday"),
                t("tuesday"),
                t("wednesday"),
                t("thursday"),
                t("friday"),
                t("saturday"),
              ].map((day) => (
                <div key={day} className="text-center font-medium text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the start of the month */}
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <div
                  key={`empty-start-${index}`}
                  className="h-24 p-1 bg-gray-50 dark:bg-gray-800/40 rounded-md"
                ></div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day) => {
                // Get counts for this day from API data
                const counts = getDayCounts(day);

                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "h-24 p-1 border rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer",
                      isSameDay(day, selectedDate) &&
                        "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
                      !isSameMonth(day, currentMonth) &&
                        "text-gray-300 dark:text-gray-600"
                    )}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="text-right text-sm font-medium">
                        {format(day, "d")}
                      </div>

                      {counts.total > 0 && (
                        <div className="mt-auto flex flex-wrap gap-1">
                          {counts.completed > 0 && (
                            <div className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                              {counts.completed} {t("completed")}
                            </div>
                          )}
                          {counts.inProgress > 0 && (
                            <div className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                              {counts.inProgress} {t("inProgress")}
                            </div>
                          )}
                          {counts.pending > 0 && (
                            <div className="text-xs px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full">
                              {counts.pending} {t("pending")}
                            </div>
                          )}
                          {counts.cancelled > 0 && (
                            <div className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 rounded-full">
                              {counts.cancelled} {t("cancelled")}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Empty cells for days after the end of the month */}
              {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
                <div
                  key={`empty-end-${index}`}
                  className="h-24 p-1 bg-gray-50 dark:bg-gray-800/40 rounded-md"
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointments for Selected Day - Modified for scrolling */}
        <Card className="flex flex-col h-[600px]">
          {/* Fixed Header */}
          <CardHeader className="flex flex-row items-center justify-between flex-none">
            <div>
              <CardTitle>{t("appointments")}</CardTitle>
              <CardDescription>
                {format(selectedDate, "MMMM d, yyyy")}
              </CardDescription>
            </div>
            <Button className="gap-2">
              <Plus size={16} />
              {t("add")}
            </Button>
          </CardHeader>

          {/* Scrollable Content */}
          <CardContent className="flex-grow overflow-y-auto">
            <div className="space-y-4">
              {isLoadingDaily ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t("loadingAppointments")}
                </div>
              ) : dailyAppointments?.value?.appointments?.length > 0 ? (
                dailyAppointments.value.appointments.map(
                  (appointment: Appointment) => (
                    <Card key={appointment.id} className="overflow-hidden">
                      <div
                        className={`h-1 ${
                          appointment.status.toLowerCase() === "completed"
                            ? "bg-green-500"
                            : appointment.status.toLowerCase() ===
                                "inprogress" ||
                              appointment.status.toLowerCase() === "in progress"
                            ? "bg-blue-500"
                            : appointment.status.toLowerCase() === "pending"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {appointment.customer.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">
                                {appointment.customer.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {appointment.service.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-medium">
                                {appointment.startTime}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t("duration")}: {appointment.duration}
                              </p>
                            </div>
                            <div>{getStatusIcon(appointment.status)}</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2 flex justify-between gap-2">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">{t("doctor")}:</span>{" "}
                          {appointment.doctor.name}
                        </div>
                        {appointment.status === "Pending" ? (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReschedule(appointment)}
                            >
                              {t("reschedule")}
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() =>
                                handleConfirmAppointment(appointment.id)
                              }
                              disabled={
                                (isUpdating && updatingId === appointment.id) ||
                                confirmedAppointments.includes(appointment.id)
                              }
                            >
                              {isUpdating && updatingId === appointment.id
                                ? t("confirming")
                                : confirmedAppointments.includes(appointment.id)
                                ? t("confirmed")
                                : t("confirm")}
                            </Button>
                          </div>
                        ) : (
                          <div>{getStatusBadge(appointment.status)}</div>
                        )}
                      </CardFooter>
                    </Card>
                  )
                )
              ) : (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-lg font-medium dark:text-gray-200">
                      {t("noAppointmentsForDay")}
                    </h3>

                    {/* Status summary for the selected date */}
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {selectedDateCounts.total > 0 ? (
                        <>
                          {selectedDateCounts.completed > 0 && (
                            <Badge className="bg-green-500">
                              {selectedDateCounts.completed}{" "}
                              {t("statusCompleted")}
                            </Badge>
                          )}
                          {selectedDateCounts.inProgress > 0 && (
                            <Badge className="bg-blue-500">
                              {selectedDateCounts.inProgress}{" "}
                              {t("statusInProgress")}
                            </Badge>
                          )}
                          {selectedDateCounts.pending > 0 && (
                            <Badge className="bg-yellow-500">
                              {selectedDateCounts.pending} {t("statusPending")}
                            </Badge>
                          )}
                          {selectedDateCounts.cancelled > 0 && (
                            <Badge className="bg-gray-500">
                              {selectedDateCounts.cancelled}{" "}
                              {t("statusCancelled")}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {t("noAppointmentsScheduled")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Plus size={14} />
                      {t("addAppointment")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reschedule Modal */}
      <ScheduleChangeForCustomerModal
        schedule={
          selectedAppointment
            ? {
                id: selectedAppointment.id,
                customerName: selectedAppointment.customer.name,
                doctorId: selectedAppointment.doctor.id,
                // Add other required properties for CustomerSchedule type
              }
            : null
        }
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        onSuccess={handleRescheduleSuccess}
      />
    </div>
  );
}
