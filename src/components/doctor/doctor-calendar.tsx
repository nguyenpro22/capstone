"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  addDays,
  startOfWeek,
  endOfWeek,
  parseISO,
  isToday,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  CalendarIcon as CalendarIconOutline,
  Clock,
  User,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { AppointmentDetails } from "./appointment-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DoctorWorkingSchedule } from "@/features/doctor/types";
import { useGetDoctorSchedulesQuery } from "@/features/doctor/api";
import { useTranslations } from "next-intl";
import { AppointmentSidebar } from "./appointment-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DoctorCalendar() {
  const t = useTranslations("doctor");
  const [date, setDate] = useState<Date>(new Date());

  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorWorkingSchedule | null>(null);
  const [view, setView] = useState<"month" | "week">("month");
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Format date for API query - expand range for week view
  const queryStartDate =
    view === "month"
      ? format(startOfMonth(date), "yyyy-MM-dd")
      : format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");

  const queryEndDate =
    view === "month"
      ? format(endOfMonth(date), "yyyy-MM-dd")
      : format(endOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");

  // Fetch doctor schedules for the selected period
  const { data, isLoading } = useGetDoctorSchedulesQuery({
    pageSize: 100,
    searchTerm: `${queryStartDate} to ${queryEndDate}`,
  });

  const schedules = data?.value?.items || [];

  // Group appointments by date
  const appointmentsByDate = schedules.reduce((acc, appointment) => {
    const date = appointment.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, DoctorWorkingSchedule[]>);

  // Generate week days for week view
  useEffect(() => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start from Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });

    const days = [];
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    setWeekDays(days);
  }, [date]);

  // Navigation functions
  const navigate = (direction: "prev" | "next") => {
    if (view === "month") {
      setDate(direction === "prev" ? subMonths(date, 1) : addMonths(date, 1));
    } else {
      setDate(direction === "prev" ? subWeeks(date, 1) : addWeeks(date, 1));
    }
  };

  // Go to today
  const goToToday = () => {
    setDate(new Date());
    setSelectedDate(new Date());
  };

  // Handle appointment selection
  const handleAppointmentClick = (appointment: DoctorWorkingSchedule) => {
    setSelectedAppointment(appointment);
  };

  // Close appointment details modal
  const handleCloseDetails = () => {
    setSelectedAppointment(null);
  };

  // Get formatted title based on view
  const getViewTitle = () => {
    if (view === "month") {
      return format(date, "MMMM yyyy");
    } else {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = endOfWeek(date, { weekStartsOn: 1 });

      if (format(start, "MMM") === format(end, "MMM")) {
        return `${format(start, "d")} - ${format(end, "d")} ${format(
          end,
          "MMMM yyyy"
        )}`;
      } else {
        return `${format(start, "d MMM")} - ${format(end, "d MMM yyyy")}`;
      }
    }
  };

  // Generate calendar days for month view
  const generateMonthView = () => {
    const firstDayOfMonth = startOfMonth(date);
    const lastDayOfMonth = endOfMonth(date);
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Generate weeks
    const weeks = [];
    let day = startDate;

    while (day <= endDate) {
      const week = [];

      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dateStr = format(currentDay, "yyyy-MM-dd");
        const dayAppointments = appointmentsByDate[dateStr] || [];
        const isCurrentMonth = isSameMonth(currentDay, date);
        const isCurrentDay = isToday(currentDay);
        const isSelected = selectedDate
          ? isSameDay(currentDay, selectedDate)
          : false;

        week.push(
          <div
            key={dateStr}
            className={cn(
              "min-h-[120px] p-0 relative group transition-all duration-200 border-b border-r last:border-r-0 border-slate-200 dark:border-slate-800",
              !isCurrentMonth && "bg-slate-50/50 dark:bg-slate-900/30",
              isCurrentDay && "bg-blue-50 dark:bg-blue-900/20",
              isSelected &&
                "ring-2 ring-blue-500 dark:ring-blue-400 ring-inset z-10",
              i === 6 && "bg-slate-50/80 dark:bg-slate-900/40", // Weekend styling
              i === 5 && "bg-slate-50/80 dark:bg-slate-900/40" // Weekend styling
            )}
            onClick={() => setSelectedDate(currentDay)}
          >
            <div className="flex justify-between items-center p-2">
              <span
                className={cn(
                  "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                  isCurrentDay && "bg-blue-500 text-white",
                  !isCurrentDay &&
                    isCurrentMonth &&
                    "hover:bg-slate-100 dark:hover:bg-slate-800",
                  !isCurrentMonth && "text-slate-400 dark:text-slate-600",
                  i >= 5 && "text-slate-500 dark:text-slate-400" // Weekend text color
                )}
              >
                {format(currentDay, "d")}
              </span>
              {dayAppointments.length > 0 && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs rounded-full px-2 py-0 h-5 font-normal border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                    !isCurrentMonth && "opacity-60"
                  )}
                >
                  {dayAppointments.length}
                </Badge>
              )}
            </div>

            <div className="px-2 pb-1">
              {dayAppointments.slice(0, 2).map((appointment) => (
                <AppointmentItem
                  key={appointment.workingScheduleId}
                  appointment={appointment}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAppointmentClick(appointment);
                  }}
                  compact
                />
              ))}
              {dayAppointments.length > 2 && (
                <div
                  className="text-xs mt-1 text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate(currentDay);
                  }}
                >
                  +{dayAppointments.length - 2} more
                </div>
              )}
            </div>
          </div>
        );

        day = addDays(day, 1);
      }

      weeks.push(
        <div
          key={format(week[0].key as string, "yyyy-MM-dd")}
          className="grid grid-cols-7"
        >
          {week}
        </div>
      );
    }

    return (
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
        <div className="grid grid-cols-7 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
          {dayNames.map((name, index) => (
            <div
              key={name}
              className={cn(
                "text-center text-sm font-medium py-3 border-b border-slate-200 dark:border-slate-800",
                index >= 5
                  ? "text-slate-500 dark:text-slate-400"
                  : "text-slate-600 dark:text-slate-300"
              )}
            >
              {name}
            </div>
          ))}
        </div>
        <CardContent className="p-0">{weeks}</CardContent>
      </Card>
    );
  };

  // Generate time slots for week view
  const generateWeekView = () => {
    // Time slots from 8 AM to 9 PM
    const timeSlots = Array.from({ length: 14 }, (_, i) => i + 8);

    return (
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
        <div className="grid grid-cols-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
          <div className="p-3 text-center font-medium text-slate-600 dark:text-slate-300 border-r border-b border-slate-200 dark:border-slate-800">
            <Clock className="h-4 w-4 mx-auto mb-1 opacity-70" />
            <span className="text-xs">Time</span>
          </div>
          {weekDays.map((day, index) => {
            const isSelected = selectedDate
              ? isSameDay(day, selectedDate)
              : false;
            return (
              <div
                key={day.toString()}
                className={cn(
                  "p-3 text-center border-r border-b last:border-r-0 border-slate-200 dark:border-slate-800 cursor-pointer transition-colors",
                  isToday(day) && "bg-blue-50 dark:bg-blue-900/20",
                  isSelected &&
                    "bg-blue-100 dark:bg-blue-800/30 ring-1 ring-inset ring-blue-500",
                  index >= 5 && "bg-slate-50/80 dark:bg-slate-900/40" // Weekend styling
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div
                  className={cn(
                    "text-sm",
                    index >= 5
                      ? "text-slate-500 dark:text-slate-400"
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {format(day, "EEE")}
                </div>
                <div
                  className={cn(
                    "text-base font-medium",
                    isSelected
                      ? "text-blue-600 dark:text-blue-400"
                      : isToday(day)
                      ? "text-blue-500 dark:text-blue-400"
                      : index >= 5
                      ? "text-slate-600 dark:text-slate-300"
                      : "text-slate-700 dark:text-slate-200"
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>

        <CardContent className="p-0">
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 border-b last:border-b-0 border-slate-200 dark:border-slate-800"
            >
              <div className="py-3 px-4 text-right text-sm text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                {format(new Date(2000, 1, 1, hour), "h a")}
              </div>

              {weekDays.map((day, index) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const appointments = appointmentsByDate[dateStr] || [];
                const isSelected = selectedDate
                  ? isSameDay(day, selectedDate)
                  : false;

                // Filter appointments for this hour
                const hourAppointments = appointments.filter((appointment) => {
                  const startHour = Number.parseInt(
                    appointment.startTime.split(":")[0]
                  );
                  return startHour === hour;
                });

                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "p-1 min-h-[80px] border-r last:border-r-0 border-slate-200 dark:border-slate-800 relative group",
                      isToday(day) && "bg-blue-50 dark:bg-blue-900/20",
                      isSelected && "bg-blue-100/50 dark:bg-blue-800/20",
                      hour % 2 === 0 && "bg-slate-50/50 dark:bg-slate-900/30",
                      index >= 5 && "bg-slate-50/80 dark:bg-slate-900/40" // Weekend styling
                    )}
                    onClick={() => setSelectedDate(day)}
                  >
                    {hourAppointments.map((appointment) => (
                      <AppointmentItem
                        key={appointment.workingScheduleId}
                        appointment={appointment}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAppointmentClick(appointment);
                        }}
                        showTime
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // Set initial selected date when view changes
  useEffect(() => {
    // If no date is selected or changing views, select today or the first day of the current view
    if (!selectedDate) {
      const today = new Date();
      if (isSameMonth(today, date)) {
        setSelectedDate(today);
      } else {
        // If current month doesn't include today, select the first day of the month
        setSelectedDate(startOfMonth(date));
      }
    }
  }, [view, date, selectedDate]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 flex-shrink-0 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white dark:from-blue-600 dark:to-indigo-600 p-2.5 rounded-lg shadow-sm">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              {getViewTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="h-9 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {t("calendar.today")}
            </Button>

            <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-r-none text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => navigate("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="h-9 w-px bg-slate-200 dark:bg-slate-800" />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-l-none text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => navigate("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden p-6 gap-6">
        <div className="flex-grow flex flex-col overflow-hidden">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "month" | "week")}
            className="flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <CalendarIconOutline className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <span>Schedule</span>
              </h3>
              <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <TabsTrigger
                  value="month"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-md gap-1.5"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>{t("calendar.month")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-md gap-1.5"
                >
                  <LayoutList className="h-4 w-4" />
                  <span>{t("calendar.week")}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-grow overflow-hidden">
              <TabsContent value="month" className="h-full overflow-auto mt-0">
                {generateMonthView()}
              </TabsContent>

              <TabsContent value="week" className="h-full overflow-auto mt-0">
                {generateWeekView()}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {selectedDate && (
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 overflow-hidden">
            <Card className="h-full border-slate-200 dark:border-slate-800 shadow-sm">
              <CardContent className="p-4 h-full overflow-auto">
                <AppointmentSidebar
                  selectedDate={selectedDate}
                  appointmentsByDate={appointmentsByDate}
                  handleAppointmentClick={handleAppointmentClick}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 dark:bg-slate-900/50 z-10 backdrop-blur-sm">
          <Card className="p-6 flex flex-col items-center gap-4 max-w-md w-full">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[160px]" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 w-full">
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-md" />
                ))}
            </div>
            <div className="grid gap-2 w-full">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
            </div>
          </Card>
        </div>
      )}

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}

interface AppointmentItemProps {
  appointment: DoctorWorkingSchedule;
  onClick: (e: React.SyntheticEvent) => void;
  showTime?: boolean;
  compact?: boolean;
}

function AppointmentItem({
  appointment,
  onClick,
  showTime = false,
  compact = false,
}: AppointmentItemProps) {
  if (compact) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick(e);
        }}
        className="text-left text-xs py-1 px-1.5 my-0.5 rounded-md cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-1.5 group"
      >
        <StatusDot status={appointment.status} />
        <div className="font-medium truncate flex-1 text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
          {appointment.customerName}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClick(e);
            }}
            className="text-left text-xs p-2 rounded-md border border-slate-200 dark:border-slate-700 group cursor-pointer hover:shadow-md transition-all bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 my-1"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium truncate flex-1 text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                {appointment.customerName}
              </div>
              <StatusDot status={appointment.status} />
            </div>
            {showTime && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(
                  parseISO(`2000-01-01T${appointment.startTime}`),
                  "h:mm a"
                )}{" "}
                -
                {format(
                  parseISO(`2000-01-01T${appointment.endTime}`),
                  "h:mm a"
                )}
              </div>
            )}
            {appointment.serviceName && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                {appointment.serviceName}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="p-3">
          <div className="space-y-2">
            <div className="font-medium text-sm flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
              {appointment.customerName}
            </div>
            <div className="text-xs flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
              {format(
                parseISO(`2000-01-01T${appointment.startTime}`),
                "h:mm a"
              )}{" "}
              -{format(parseISO(`2000-01-01T${appointment.endTime}`), "h:mm a")}
            </div>
            <div className="text-xs">{appointment.serviceName}</div>
            <StatusBadge status={appointment.status} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function StatusDot({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500 ring-amber-200 dark:ring-amber-900/30";
      case "IN_PROGRESS":
        return "bg-blue-500 ring-blue-200 dark:ring-blue-900/30";
      case "COMPLETED":
        return "bg-emerald-500 ring-emerald-200 dark:ring-emerald-900/30";
      case "UNCOMPLETED":
        return "bg-rose-500 ring-rose-200 dark:ring-rose-900/30";
      default:
        return "bg-slate-500 ring-slate-200 dark:ring-slate-800";
    }
  };

  return (
    <div
      className={`h-2.5 w-2.5 rounded-full ring-2 ring-offset-1 dark:ring-offset-slate-900 ${getStatusColor(
        status
      )}`}
    />
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "UNCOMPLETED":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <Badge className={`font-medium text-xs ${getStatusStyles(status)} border`}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
