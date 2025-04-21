"use client";

import type React from "react";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isToday,
  addWeeks,
  subWeeks,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  LayoutGrid,
  LayoutList,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type {
  DoctorWorkingSchedule,
  WorkingSchedule,
} from "@/features/doctor/types";

interface CalendarViewProps {
  shifts: DoctorWorkingSchedule[];
  isLoading: boolean;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onSelectShift: (shift: DoctorWorkingSchedule) => void;
  onSelectAppointment: (appointment: WorkingSchedule) => void;
}

export function CalendarView({
  shifts,
  isLoading,
  selectedDate,
  onSelectDate,
  onSelectShift,
  onSelectAppointment,
}: CalendarViewProps) {
  const t = useTranslations("doctor");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week">("month");

  // Group shifts by date
  const shiftsByDate = shifts.reduce((acc, shift) => {
    const dateStr = shift.date;
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(shift);
    return acc;
  }, {} as Record<string, DoctorWorkingSchedule[]>);

  // Navigation functions
  const navigate = (direction: "prev" | "next") => {
    if (view === "month") {
      setCurrentDate(
        direction === "prev"
          ? subMonths(currentDate, 1)
          : addMonths(currentDate, 1)
      );
    } else {
      setCurrentDate(
        direction === "prev"
          ? subWeeks(currentDate, 1)
          : addWeeks(currentDate, 1)
      );
    }
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
    onSelectDate(new Date());
  };

  // Get formatted title based on view
  const getViewTitle = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    } else {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });

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

  // Generate month view
  const generateMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Generate weeks
    const weeks = [];
    let day = startDate;

    while (day <= endDate) {
      const week = [];

      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dateStr = format(currentDay, "yyyy-MM-dd");
        const dayShifts = shiftsByDate[dateStr] || [];
        const isCurrentMonth = isSameMonth(currentDay, currentDate);
        const isCurrentDay = isToday(currentDay);
        const isSelected = selectedDate
          ? isSameDay(currentDay, selectedDate)
          : false;

        // Count total appointments for this day
        const totalAppointments = dayShifts.reduce(
          (count, shift) => count + shift.workingSchedules.length,
          0
        );

        week.push(
          <div
            key={dateStr}
            className={cn(
              "min-h-[120px] p-0 relative group transition-all duration-200 border-b border-r last:border-r-0 border-purple-100 dark:border-purple-900/50",
              !isCurrentMonth && "bg-purple-50/50 dark:bg-purple-950/30",
              isCurrentDay && "bg-purple-100/50 dark:bg-purple-900/20",
              isSelected &&
                "ring-2 ring-purple-500 dark:ring-purple-400 ring-inset z-10",
              i === 6 && "bg-purple-50/80 dark:bg-purple-950/40", // Weekend styling
              i === 5 && "bg-purple-50/80 dark:bg-purple-950/40" // Weekend styling
            )}
            onClick={() => onSelectDate(currentDay)}
          >
            <div className="flex justify-between items-center p-2">
              <span
                className={cn(
                  "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                  isCurrentDay && "bg-purple-600 text-white",
                  !isCurrentDay &&
                    isCurrentMonth &&
                    "hover:bg-purple-100 dark:hover:bg-purple-800/50",
                  !isCurrentMonth && "text-purple-400 dark:text-purple-600",
                  i >= 5 && "text-purple-500 dark:text-purple-400" // Weekend text color
                )}
              >
                {format(currentDay, "d")}
              </span>
              {totalAppointments > 0 && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs rounded-full px-2 py-0 h-5 font-normal border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                    !isCurrentMonth && "opacity-60"
                  )}
                >
                  {totalAppointments}
                </Badge>
              )}
            </div>

            <div className="px-2 pb-1">
              {dayShifts.slice(0, 2).map((shift) => (
                <ShiftItem
                  key={shift.id}
                  shift={shift}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectShift(shift);
                  }}
                  compact
                />
              ))}
              {dayShifts.length > 2 && (
                <div
                  className="text-xs mt-1 text-purple-600 dark:text-purple-400 font-medium cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDate(currentDay);
                  }}
                >
                  +{dayShifts.length - 2} {t("calendar.moreShifts")}
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
      <Card className="overflow-hidden border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-950 shadow-sm">
        <div className="grid grid-cols-7 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40">
          {dayNames.map((name, index) => (
            <div
              key={name}
              className={cn(
                "text-center text-sm font-medium py-3 border-b border-purple-200 dark:border-purple-800",
                index >= 5
                  ? "text-purple-500 dark:text-purple-400"
                  : "text-purple-600 dark:text-purple-300"
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

  // Generate week view
  const generateWeekView = () => {
    // Generate week days
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays: Date[] = [];

    let day = weekStart;
    while (day <= weekEnd) {
      weekDays.push(day);
      day = addDays(day, 1);
    }

    // Time slots from 8 AM to 9 PM
    const timeSlots = Array.from({ length: 14 }, (_, i) => i + 8);

    return (
      <Card className="overflow-hidden border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-950 shadow-sm">
        <div className="grid grid-cols-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40">
          <div className="p-3 text-center font-medium text-purple-600 dark:text-purple-300 border-r border-b border-purple-200 dark:border-purple-800">
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
                  "p-3 text-center border-r border-b last:border-r-0 border-purple-200 dark:border-purple-800 cursor-pointer transition-colors",
                  isToday(day) && "bg-purple-50 dark:bg-purple-900/20",
                  isSelected &&
                    "bg-purple-100 dark:bg-purple-800/30 ring-1 ring-inset ring-purple-500",
                  index >= 5 && "bg-purple-50/80 dark:bg-purple-950/40" // Weekend styling
                )}
                onClick={() => onSelectDate(day)}
              >
                <div
                  className={cn(
                    "text-sm",
                    index >= 5
                      ? "text-purple-500 dark:text-purple-400"
                      : "text-purple-500 dark:text-purple-400"
                  )}
                >
                  {format(day, "EEE")}
                </div>
                <div
                  className={cn(
                    "text-base font-medium",
                    isSelected
                      ? "text-purple-600 dark:text-purple-400"
                      : isToday(day)
                      ? "text-purple-500 dark:text-purple-400"
                      : index >= 5
                      ? "text-purple-600 dark:text-purple-300"
                      : "text-purple-700 dark:text-purple-200"
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
              className="grid grid-cols-8 border-b last:border-b-0 border-purple-200 dark:border-purple-800"
            >
              <div className="py-3 px-4 text-right text-sm text-purple-500 dark:text-purple-400 border-r border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50">
                {format(new Date(2000, 1, 1, hour), "h a")}
              </div>

              {weekDays.map((day, index) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const dayShifts = shiftsByDate[dateStr] || [];
                const isSelected = selectedDate
                  ? isSameDay(day, selectedDate)
                  : false;

                // Find appointments for this hour
                const hourAppointments: {
                  shift: DoctorWorkingSchedule;
                  appointment: WorkingSchedule;
                }[] = [];

                dayShifts.forEach((shift) => {
                  shift.workingSchedules.forEach((appointment) => {
                    const appointmentHour = Number.parseInt(
                      appointment.startTime.split(":")[0]
                    );
                    if (appointmentHour === hour) {
                      hourAppointments.push({ shift, appointment });
                    }
                  });
                });

                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "p-1 min-h-[80px] border-r last:border-r-0 border-purple-200 dark:border-purple-800 relative group",
                      isToday(day) && "bg-purple-50 dark:bg-purple-900/20",
                      isSelected && "bg-purple-100/50 dark:bg-purple-800/20",
                      hour % 2 === 0 && "bg-purple-50/50 dark:bg-purple-950/30",
                      index >= 5 && "bg-purple-50/80 dark:bg-purple-950/40" // Weekend styling
                    )}
                    onClick={() => onSelectDate(day)}
                  >
                    {hourAppointments.map(({ shift, appointment }) => (
                      <AppointmentItem
                        key={appointment.workingScheduleId}
                        shift={shift}
                        appointment={appointment}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectShift(shift);
                          onSelectAppointment(appointment);
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

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="border-b border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 py-4 px-6 flex-shrink-0 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white dark:from-purple-700 dark:to-indigo-700 p-2.5 rounded-lg shadow-sm">
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
              className="h-9 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-600 dark:hover:text-purple-400"
            >
              {t("calendar.today")}
            </Button>

            <div className="flex items-center rounded-md border border-purple-200 dark:border-purple-800 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-r-none text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-600 dark:hover:text-purple-400"
                onClick={() => navigate("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="h-9 w-px bg-purple-200 dark:bg-purple-800" />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-l-none text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-600 dark:hover:text-purple-400"
                onClick={() => navigate("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "month" | "week")}
        className="flex flex-col flex-1 min-h-0 overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 flex-shrink-0">
          <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            <span>{t("calendar.schedule")}</span>
          </h3>
          <TabsList className="bg-purple-100 dark:bg-purple-900/50 p-1 rounded-lg">
            <TabsTrigger
              value="month"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm rounded-md gap-1.5"
            >
              <LayoutGrid className="h-4 w-4" />
              <span>{t("calendar.month")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm rounded-md gap-1.5"
            >
              <LayoutList className="h-4 w-4" />
              <span>{t("calendar.week")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-4 min-h-0 overflow-hidden">
          <TabsContent
            value="month"
            className="h-full overflow-auto mt-0 relative"
          >
            {generateMonthView()}
          </TabsContent>

          <TabsContent
            value="week"
            className="h-full overflow-auto mt-0 relative"
          >
            {generateWeekView()}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

interface ShiftItemProps {
  shift: DoctorWorkingSchedule;
  onClick: (e: React.MouseEvent) => void;
  compact?: boolean;
}

function ShiftItem({ shift, onClick, compact = false }: ShiftItemProps) {
  const t = useTranslations("doctor");
  const appointmentCount = shift.workingSchedules.length;

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="text-left text-xs py-1 px-1.5 my-0.5 rounded-md cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-1.5 group"
      >
        <StatusDot status={getShiftStatus(shift)} />
        <div className="font-medium truncate flex-1 text-slate-700 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-300">
          {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
        </div>
        <div className="text-xs text-purple-500 dark:text-purple-400">
          {appointmentCount}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onClick}
            className="text-left text-xs p-2 rounded-md border border-purple-200 dark:border-purple-700 group cursor-pointer hover:shadow-md transition-all bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700 my-1"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium truncate flex-1 text-slate-700 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-400">
                {shift.doctorName}
              </div>
              <StatusDot status={getShiftStatus(shift)} />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
            </div>
            <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">
              {appointmentCount} {t("calendar.appointments")}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="p-3 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 max-w-[250px] z-50"
        >
          <div className="space-y-2">
            <div className="font-medium text-sm">{shift.doctorName}</div>
            <div className="text-xs flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
              {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              {appointmentCount} {t("calendar.appointments")}
            </div>
            <StatusBadge status={getShiftStatus(shift)} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface AppointmentItemProps {
  shift: DoctorWorkingSchedule;
  appointment: WorkingSchedule;
  onClick: (e: React.MouseEvent) => void;
  showTime?: boolean;
}

function AppointmentItem({
  shift,
  appointment,
  onClick,
  showTime = false,
}: AppointmentItemProps) {
  const t = useTranslations("doctor");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onClick}
            className="text-left text-xs p-2 rounded-md border border-purple-200 dark:border-purple-700 group cursor-pointer hover:shadow-md transition-all bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700 my-1"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium truncate flex-1 text-slate-700 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-400">
                {appointment.customerName}
              </div>
              <StatusDot status={appointment.status} />
            </div>
            {showTime && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(appointment.startTime)} -{" "}
                {formatTime(appointment.endTime)}
              </div>
            )}
            <div className="text-xs text-purple-500 dark:text-purple-400 mt-1 truncate">
              {appointment.serviceName}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="p-3 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 max-w-[250px] z-50"
        >
          <div className="space-y-2">
            <div className="font-medium text-sm flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
              {appointment.customerName}
            </div>
            <div className="text-xs flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
              {formatTime(appointment.startTime)} -{" "}
              {formatTime(appointment.endTime)}
            </div>
            <div className="text-xs">{appointment.serviceName}</div>
            <div className="text-xs">
              {t("appointment.step")}: {appointment.stepIndex}
            </div>
            <StatusBadge status={appointment.status} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function StatusDot({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "confirmed":
        return "bg-emerald-500 ring-emerald-200 dark:ring-emerald-900/30";
      case "pending":
        return "bg-amber-500 ring-amber-200 dark:ring-amber-900/30";
      case "in progress":
        return "bg-purple-500 ring-purple-200 dark:ring-purple-900/30";
      case "completed":
        return "bg-indigo-500 ring-indigo-200 dark:ring-indigo-900/30";
      case "cancelled":
      case "uncompleted":
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
  const t = useTranslations("doctor");

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "in progress":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "completed":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      case "cancelled":
      case "uncompleted":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const statusKey = status.toLowerCase().replace(/\s+/g, "");
  return (
    <Badge className={`font-medium text-xs ${getStatusStyles(status)} border`}>
      {t(`appointment.status.${statusKey}`)}
    </Badge>
  );
}

function CalendarSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="flex-grow grid grid-cols-7 gap-1">
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-10" />
          ))}

        {Array(35)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={`day-${i}`} className="h-24" />
          ))}
      </div>
    </div>
  );
}

// Helper functions
function formatTime(timeString: string): string {
  if (!timeString) return "";

  // Handle format like "08:30:00"
  const parts = timeString.split(":");
  if (parts.length >= 2) {
    const hour = Number.parseInt(parts[0]);
    const minute = parts[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  }

  return timeString;
}

function getShiftStatus(shift: DoctorWorkingSchedule): string {
  // Determine shift status based on appointments
  if (shift.workingSchedules.length === 0) return "empty";

  const statuses = shift.workingSchedules.map((ws) => ws.status.toLowerCase());

  if (statuses.every((s) => s === "completed")) return "completed";
  if (statuses.some((s) => s === "in progress")) return "inprogress";
  if (statuses.some((s) => s === "confirmed")) return "confirmed";
  if (statuses.every((s) => s === "pending")) return "pending";

  return "mixed";
}
