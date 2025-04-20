"use client";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parseISO,
  isSameMonth,
  isToday,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDoctorSchedulesQuery } from "@/features/doctor/api";
import type { DoctorWorkingSchedule } from "@/features/doctor/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { AppointmentDetailsModal } from "./appointment-details-modal";

interface DoctorScheduleCalendarProps {
  onSelectAppointment?: (appointment: DoctorWorkingSchedule) => void;
}

export function DoctorScheduleCalendar({
  onSelectAppointment,
}: DoctorScheduleCalendarProps) {
  const t = useTranslations("registerSchedule");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorWorkingSchedule | null>(null);

  // Format date range for API query
  const startDate = format(startOfMonth(currentDate), "yyyy-MM-dd");
  const endDate = format(endOfMonth(currentDate), "yyyy-MM-dd");

  // Fetch doctor schedules
  const { data, isLoading } = useGetDoctorSchedulesQuery({
    searchTerm: `${startDate} to ${endDate}`,
    pageSize: 100,
  });

  const appointments = data?.value?.items || [];

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const date = appointment.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, DoctorWorkingSchedule[]>);

  // Navigation functions
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToCurrentMonth = () => setCurrentDate(new Date());

  const handleSelectAppointment = (appointment: DoctorWorkingSchedule) => {
    setSelectedAppointment(appointment);
    if (onSelectAppointment) {
      onSelectAppointment(appointment);
    }
  };

  // Get status color based on appointment status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500 dark:bg-green-600";
      case "in progress":
        return "bg-blue-500 dark:bg-blue-600";
      case "cancelled":
        return "bg-red-500 dark:bg-red-600";
      case "scheduled":
        return "bg-yellow-500 dark:bg-yellow-600";
      case "pending":
        return "bg-orange-500 dark:bg-orange-600";
      default:
        return "bg-slate-500 dark:bg-slate-600";
    }
  };

  // Generate calendar days
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const days = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });

    // Calculate the day of the week for the first day of the month (0-6)
    const firstDayOfMonth = monthStart.getDay();

    // Create empty cells for days before the first day of the month
    const blanks = Array(firstDayOfMonth)
      .fill(null)
      .map((_, i) => (
        <div
          key={`blank-${i}`}
          className="h-28 p-2 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
        />
      ));

    // Create cells for each day of the month
    const daysInMonth = days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayAppointments = appointmentsByDate[dateStr] || [];
      const isCurrentDay = isToday(day);

      return (
        <div
          key={dateStr}
          className={cn(
            "h-28 p-2 border border-slate-100 dark:border-slate-800 overflow-y-auto transition-colors",
            isCurrentDay &&
              "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50",
            !isSameMonth(day, currentDate) &&
              "bg-slate-50/50 dark:bg-slate-900/30 opacity-50"
          )}
        >
          <div className="flex justify-between items-center mb-1">
            <span
              className={cn(
                "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                isCurrentDay && "bg-indigo-600 text-white"
              )}
            >
              {format(day, "d")}
            </span>
            {dayAppointments.length > 0 && (
              <Badge
                variant="outline"
                className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50"
              >
                {dayAppointments.length}
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            {dayAppointments.slice(0, 2).map((appointment) => (
              <AppointmentItem
                key={appointment.workingScheduleId}
                appointment={appointment}
                onSelect={() => handleSelectAppointment(appointment)}
                statusColor={getStatusColor(appointment.status)}
              />
            ))}
            {dayAppointments.length > 2 && (
              <button
                onClick={() => {
                  // Show first appointment details
                  handleSelectAppointment(dayAppointments[0]);
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                +{dayAppointments.length - 2} more
              </button>
            )}
          </div>
        </div>
      );
    });

    return [...blanks, ...daysInMonth];
  };

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <AnimatePresence mode="wait">
          <motion.h3
            key={format(currentDate, "MMMM-yyyy")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xl font-semibold text-slate-800 dark:text-slate-200"
          >
            {format(currentDate, "MMMM yyyy")}
          </motion.h3>
        </AnimatePresence>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToCurrentMonth}
            className="h-9 text-sm border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            {t("today")}
          </Button>
          <div className="flex">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousMonth}
              className="h-9 w-9 rounded-r-none border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextMonth}
              className="h-9 w-9 rounded-l-none border-l-0 border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-7">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {renderCalendar()}
        </div>
      </div>

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}

interface AppointmentItemProps {
  appointment: DoctorWorkingSchedule;
  onSelect: () => void;
  statusColor: string;
}

function AppointmentItem({
  appointment,
  onSelect,
  statusColor,
}: AppointmentItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onSelect}
            className="w-full text-left text-xs p-1 rounded-md transition-all group
              flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 
              dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 
              dark:hover:text-indigo-300 shadow-sm"
          >
            <div
              className={`w-1.5 h-full min-h-[1.5rem] rounded-l-sm ${statusColor}`}
            ></div>
            <div className="flex-1 pl-1 truncate">
              <div className="font-medium truncate">
                {appointment.customerName}
              </div>
              <div className="flex items-center text-slate-500 dark:text-slate-400 text-[10px]">
                <Clock className="h-2.5 w-2.5 mr-0.5" />
                {format(
                  parseISO(`2000-01-01T${appointment.startTime}`),
                  "HH:mm"
                )}
                {" - "}
                {format(parseISO(`2000-01-01T${appointment.endTime}`), "HH:mm")}
              </div>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
        >
          <div className="text-xs">
            <div className="font-medium">{appointment.customerName}</div>
            <div className="mt-1">
              {format(
                parseISO(`2000-01-01T${appointment.startTime}`),
                "h:mm a"
              )}{" "}
              -{format(parseISO(`2000-01-01T${appointment.endTime}`), "h:mm a")}
            </div>
            <div className="mt-1">{appointment.serviceName}</div>
            <div className="mt-1">
              <Badge
                className={`${statusColor
                  .replace("bg-", "text-")
                  .replace("dark:bg-", "dark:text-")} bg-opacity-15`}
              >
                {appointment.status}
              </Badge>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-7">
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={`header-${i}`} className="h-10" />
            ))}

          {Array(35)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={`day-${i}`} className="h-28" />
            ))}
        </div>
      </div>
    </div>
  );
}
