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
import {
  useGetClinicShiftSchedulesQuery,
  useGetDoctorSchedulesQuery,
} from "@/features/doctor/api";
import type { ClinicShiftSchedule } from "@/features/doctor/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ShiftDetailsModal } from "./shift-details-modal";
import { getAccessToken, GetDataByToken, TokenData } from "@/utils";

interface AvailableShiftsCalendarProps {
  selectedShifts: ClinicShiftSchedule[];
  onSelectShift: (shift: ClinicShiftSchedule) => void;
}

export function AvailableShiftsCalendar({
  selectedShifts,
  onSelectShift,
}: AvailableShiftsCalendarProps) {
  const t = useTranslations("registerSchedule");
  const [currentDate, setCurrentDate] = useState(new Date());

  const token = getAccessToken() as string;
  const { clinicId } = GetDataByToken(token) as TokenData;
  const [selectedShiftForDetails, setSelectedShiftForDetails] =
    useState<ClinicShiftSchedule | null>(null);

  // Format date range for API query
  const startDate = format(startOfMonth(currentDate), "yyyy-MM-dd");
  const endDate = format(endOfMonth(currentDate), "yyyy-MM-dd");

  // Fetch available shifts
  const { data, isLoading } = useGetClinicShiftSchedulesQuery(
    {
      clinicId: clinicId || "c0b7058f-8e72-4dee-8742-0df6206d1843",
      searchTerm: `${startDate} to ${endDate}`,
      pageSize: 100,
    },
    { skip: !clinicId }
  );

  const shifts = data?.value?.items || [];

  // Group shifts by date
  const shiftsByDate = shifts.reduce((acc, shift) => {
    const date = shift.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(shift);
    return acc;
  }, {} as Record<string, ClinicShiftSchedule[]>);

  // Navigation functions
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToCurrentMonth = () => setCurrentDate(new Date());

  // Check if a shift is selected
  const isShiftSelected = (shift: ClinicShiftSchedule) => {
    return selectedShifts.some(
      (s) => s.workingScheduleId === shift.workingScheduleId
    );
  };

  const handleShiftSelect = (shift: ClinicShiftSchedule) => {
    onSelectShift(shift);
    const isSelected = isShiftSelected(shift);
    if (isSelected) {
      toast.info(t("shiftRemoved"), {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } else {
      toast.success(t("shiftAdded"), {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  const openShiftDetails = (shift: ClinicShiftSchedule) => {
    setSelectedShiftForDetails(shift);
  };

  // Generate calendar days
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const days = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
      const dayShifts = shiftsByDate[dateStr] || [];
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
            {dayShifts.length > 0 && (
              <Badge
                variant="outline"
                className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50"
              >
                {dayShifts.length}
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            {dayShifts.slice(0, 3).map((shift) => (
              <ShiftItem
                key={shift.workingScheduleId}
                shift={shift}
                isSelected={isShiftSelected(shift)}
                onSelect={() => handleShiftSelect(shift)}
                onViewDetails={() => openShiftDetails(shift)}
              />
            ))}
            {dayShifts.length > 3 && (
              <button
                onClick={() => {
                  // Show first unselected shift details or first shift if all are selected
                  const unselectedShift =
                    dayShifts.find((s) => !isShiftSelected(s)) || dayShifts[0];
                  openShiftDetails(unselectedShift);
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                +{dayShifts.length - 3} more
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

      <ShiftDetailsModal
        shift={selectedShiftForDetails}
        isOpen={!!selectedShiftForDetails}
        onClose={() => setSelectedShiftForDetails(null)}
        onSelect={handleShiftSelect}
        isSelected={
          selectedShiftForDetails
            ? isShiftSelected(selectedShiftForDetails)
            : false
        }
      />
    </div>
  );
}

interface ShiftItemProps {
  shift: ClinicShiftSchedule;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
}

function ShiftItem({
  shift,
  isSelected,
  onSelect,
  onViewDetails,
}: ShiftItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onSelect}
            className={cn(
              "w-full text-left text-xs p-1 rounded-md transition-all group",
              "flex items-center gap-1",
              isSelected
                ? "bg-indigo-100 text-indigo-800 border border-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-700 shadow-sm"
                : "bg-slate-100 hover:bg-indigo-50 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300"
            )}
          >
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {format(parseISO(`2000-01-01T${shift.startTime}`), "HH:mm")} -
              {format(parseISO(`2000-01-01T${shift.endTime}`), "HH:mm")}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-500 dark:text-indigo-400"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
        >
          <div className="text-xs">
            <div className="font-medium">
              {format(parseISO(shift.date), "EEEE, MMMM d, yyyy")}
            </div>
            <div className="mt-1">
              {format(parseISO(`2000-01-01T${shift.startTime}`), "h:mm a")} -
              {format(parseISO(`2000-01-01T${shift.endTime}`), "h:mm a")}
            </div>
            <div className="mt-1 text-indigo-600 dark:text-indigo-400">
              Click to {isSelected ? "unselect" : "select"}
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
