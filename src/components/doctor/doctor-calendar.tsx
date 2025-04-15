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
import { ChevronLeft, ChevronRight, CalendarIcon, Plus } from "lucide-react";
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
  const goToToday = () => setDate(new Date());

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

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
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
              isCurrentDay && "bg-sky-50 dark:bg-sky-900/20",
              isSelected &&
                "ring-2 ring-sky-500 dark:ring-sky-400 ring-inset z-10",
              i === 6 && "bg-slate-50/80 dark:bg-slate-900/40", // Weekend styling
              i === 5 && "bg-slate-50/80 dark:bg-slate-900/40" // Weekend styling
            )}
            onClick={() => setSelectedDate(currentDay)}
          >
            <div className="flex justify-between items-center p-2">
              <span
                className={cn(
                  "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                  isCurrentDay && "bg-sky-500 text-white",
                  !isCurrentDay &&
                    isCurrentMonth &&
                    "hover:bg-slate-100 dark:hover:bg-slate-800",
                  !isCurrentMonth && "text-slate-400 dark:text-slate-600",
                  i >= 5 && "text-slate-500 dark:text-slate-400" // Weekend text color
                )}
              >
                {format(currentDay, "d")}
              </span>

              {isCurrentMonth && dayAppointments.length > 0 && (
                <Badge className="bg-sky-500/90 hover:bg-sky-600 text-white text-xs px-1.5 py-0 h-5 min-w-5 flex items-center justify-center rounded-full">
                  {dayAppointments.length}
                </Badge>
              )}
            </div>

            <div className="p-1 space-y-1 max-h-[80px] overflow-y-auto">
              {isCurrentMonth &&
                dayAppointments
                  .slice(0, 3)
                  .map((appointment) => (
                    <AppointmentItem
                      key={appointment.workingScheduleId}
                      appointment={appointment}
                      onClick={() => handleAppointmentClick(appointment)}
                    />
                  ))}

              {isCurrentMonth && dayAppointments.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs justify-center mt-1 py-0.5 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate(currentDay);
                  }}
                >
                  +{dayAppointments.length - 3} more
                </Button>
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
      <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="grid grid-cols-7 bg-slate-100 dark:bg-slate-900">
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
        <div>{weeks}</div>
      </div>
    );
  };

  // Generate time slots for week view
  const generateWeekView = () => {
    // Time slots from 8 AM to 9 PM
    const timeSlots = Array.from({ length: 14 }, (_, i) => i + 8);

    return (
      <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="grid grid-cols-8 bg-slate-100 dark:bg-slate-900">
          <div className="p-3 text-center font-medium text-slate-600 dark:text-slate-300 border-r border-b border-slate-200 dark:border-slate-800">
            Time
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
                  isToday(day) && "bg-sky-50 dark:bg-sky-900/20",
                  isSelected &&
                    "bg-sky-100 dark:bg-sky-800/30 ring-1 ring-inset ring-sky-500",
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
                      ? "text-sky-600 dark:text-sky-400"
                      : isToday(day)
                      ? "text-sky-500 dark:text-sky-400"
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

        <div>
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
                      isToday(day) && "bg-sky-50 dark:bg-sky-900/20",
                      isSelected && "bg-sky-100/50 dark:bg-sky-800/20",
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

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-sky-500 dark:text-slate-500 dark:hover:text-sky-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add new appointment logic
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
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
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300 p-2.5 rounded-full">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
              {getViewTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="h-9 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t("calendar.today")}
            </Button>

            <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-800">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-r-none text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => navigate("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="h-9 w-px bg-slate-200 dark:bg-slate-800" />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-l-none text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => navigate("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              size="sm"
              className="h-9 bg-sky-500 hover:bg-sky-600 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              New appointment
            </Button>
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
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">
                Schedule
              </h3>
              <TabsList className="bg-slate-100 dark:bg-slate-800 p-1">
                <TabsTrigger
                  value="month"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-sky-600 dark:data-[state=active]:text-sky-400 data-[state=active]:shadow-sm"
                >
                  {t("calendar.month")}
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-sky-600 dark:data-[state=active]:text-sky-400 data-[state=active]:shadow-sm"
                >
                  {t("calendar.week")}
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
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            {/* Replace the generateSidebar function call with the AppointmentSidebar component */}
            <AppointmentSidebar
              selectedDate={selectedDate}
              appointmentsByDate={appointmentsByDate}
              handleAppointmentClick={handleAppointmentClick}
            />
          </div>
        )}
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 dark:bg-slate-900/50 z-10 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 dark:border-slate-600 border-t-sky-500"></div>
            <span className="text-slate-700 dark:text-slate-300">
              Loading calendar...
            </span>
          </div>
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
}

function AppointmentItem({
  appointment,
  onClick,
  showTime = false,
}: AppointmentItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClick(e);
            }}
            className="text-left text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 group cursor-pointer hover:shadow-sm transition-all bg-white dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium truncate flex-1 text-slate-700 dark:text-slate-300">
                {appointment.customerName}
              </div>
              <StatusDot status={appointment.status} />
            </div>
            {showTime && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <div className="font-medium">{appointment.customerName}</div>
            <div className="text-xs">
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
        return "bg-amber-500";
      case "IN_PROGRESS":
        return "bg-sky-500";
      case "COMPLETED":
        return "bg-emerald-500";
      case "UNCOMPLETED":
        return "bg-rose-500";
      default:
        return "bg-slate-500";
    }
  };

  return <div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`} />;
}

function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
      case "IN_PROGRESS":
        return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "UNCOMPLETED":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <Badge className={`font-normal text-xs ${getStatusStyles(status)}`}>
      {status}
    </Badge>
  );
}
