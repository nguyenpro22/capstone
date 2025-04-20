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
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarIcon,
  Filter,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetClinicShiftSchedulesQuery } from "@/features/doctor/api";
import type { ClinicShiftSchedule } from "@/features/doctor/types";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ShiftDetailsModal } from "./shift-details-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<
    "all" | "morning" | "afternoon" | "evening"
  >("all");

  // Format date range for API query
  const startDate = format(startOfMonth(currentDate), "yyyy-MM-dd");
  const endDate = format(endOfMonth(currentDate), "yyyy-MM-dd");
  const dateRange = `${startDate} to ${endDate}`;

  // Fetch available shifts
  const { data, isLoading } = useGetClinicShiftSchedulesQuery({
    clinicId: clinicId || "",
    searchTerm: dateRange,
    pageSize: 500,
  });

  const shifts = data?.value?.items || [];

  // Thêm hàm isShiftOverlapping
  const isShiftOverlapping = (
    shift1: ClinicShiftSchedule,
    shift2: ClinicShiftSchedule[] | ClinicShiftSchedule
  ) => {
    const shifts2Array = Array.isArray(shift2) ? shift2 : [shift2];

    return shifts2Array.some((s2) => {
      // Nếu ngày khác nhau, không có sự trùng lặp
      if (shift1.date !== s2.date) return false;

      // Chuyển đổi thời gian thành phút để dễ so sánh
      const getMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const start1Minutes = getMinutes(shift1.startTime);
      const end1Minutes = getMinutes(shift1.endTime);
      const start2Minutes = getMinutes(s2.startTime);
      const end2Minutes = getMinutes(s2.endTime);

      // Kiểm tra sự trùng lặp
      return (
        (start1Minutes < end2Minutes && end1Minutes > start2Minutes) ||
        (start2Minutes < end1Minutes && end2Minutes > start1Minutes)
      );
    });
  };

  // Filter shifts based on time of day if filter is active
  const filteredShifts = shifts.filter((shift) => {
    if (timeFilter === "all") return true;

    const hour = Number.parseInt(shift.startTime.split(":")[0], 10);

    if (timeFilter === "morning" && hour >= 6 && hour < 12) return true;
    if (timeFilter === "afternoon" && hour >= 12 && hour < 17) return true;
    if (timeFilter === "evening" && (hour >= 17 || hour < 6)) return true;

    return false;
  });

  // Group shifts by date
  const shiftsByDate = filteredShifts.reduce((acc, shift) => {
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
  const goToToday = () => setCurrentDate(new Date());

  // Check if a shift is selected
  const isShiftSelected = (shift: ClinicShiftSchedule) => {
    return selectedShifts.some(
      (s) => s.workingScheduleId === shift.workingScheduleId
    );
  };

  // Cập nhật các hàm kiểm tra trùng lặp để không sử dụng registeredShifts
  // Check if a shift overlaps with registered shifts - giả định không có ca trùng lặp đã đăng ký
  const isOverlapping = (_shift: ClinicShiftSchedule) => {
    return false; // Không kiểm tra trùng lặp với ca đã đăng ký
  };

  // Check if a shift overlaps with currently selected shifts
  const overlapsWithSelected = (shift: ClinicShiftSchedule) => {
    return selectedShifts.some(
      (selectedShift) =>
        selectedShift.workingScheduleId !== shift.workingScheduleId &&
        isShiftOverlapping(shift, selectedShift)
    );
  };

  const handleShiftSelect = (shift: ClinicShiftSchedule) => {
    // If already selected, allow deselection
    if (isShiftSelected(shift)) {
      onSelectShift(shift);
      toast.info(t("shiftRemoved"), {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return;
    }

    // Check if shift overlaps with registered shifts
    if (isOverlapping(shift)) {
      toast.error(t("shiftOverlapsWithRegistered"), {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    // Check if shift overlaps with currently selected shifts
    if (overlapsWithSelected(shift)) {
      toast.error(t("shiftOverlapsWithSelected"), {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    // If no overlap, allow selection
    onSelectShift(shift);
    toast.success(t("shiftAdded"), {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  const openShiftDetails = (shift: ClinicShiftSchedule) => {
    setSelectedShiftForDetails(shift);
  };

  const openDayShifts = (date: string) => {
    setSelectedDay(date);
  };

  // Select all non-overlapping shifts for a day
  const selectAllShiftsForDay = (date: string) => {
    const dayShifts = shiftsByDate[date] || [];

    // First, collect all shifts that don't overlap with registered shifts
    const validShifts: ClinicShiftSchedule[] = [];
    const invalidShifts: ClinicShiftSchedule[] = [];

    dayShifts.forEach((shift) => {
      if (!isShiftSelected(shift)) {
        if (
          !isOverlapping(shift) &&
          !validShifts.some((s) => isShiftOverlapping(shift, s))
        ) {
          validShifts.push(shift);
        } else {
          invalidShifts.push(shift);
        }
      }
    });

    // Select all valid shifts
    validShifts.forEach((shift) => {
      onSelectShift(shift);
    });

    // Show notification about results
    if (validShifts.length > 0) {
      toast.success(t("shiftsAddedCount", { count: validShifts.length }), {
        position: "bottom-right",
        autoClose: 3000,
      });
    }

    if (invalidShifts.length > 0) {
      toast.warning(t("someShiftsOverlap", { count: invalidShifts.length }), {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // Generate calendar days for month view
  const renderMonthCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const days = eachDayOfInterval({
      start: monthStart,
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
      const dayShifts = shiftsByDate[dateStr] || [];
      const isCurrentDay = isToday(day);
      const hasShifts = dayShifts.length > 0;

      return (
        <div
          key={dateStr}
          onClick={hasShifts ? () => openDayShifts(dateStr) : undefined}
          className={cn(
            "h-28 p-4 border border-slate-100 dark:border-slate-800 transition-colors relative",
            isCurrentDay &&
              "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50",
            !isSameMonth(day, currentDate) &&
              "bg-slate-50/50 dark:bg-slate-900/30 opacity-50",
            hasShifts &&
              "cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center">
              <span
                className={cn(
                  "text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                  isCurrentDay && "bg-indigo-600 text-white"
                )}
              >
                {format(day, "d")}
              </span>
            </div>

            {hasShifts && (
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  {dayShifts.length}{" "}
                  {dayShifts.length === 1 ? t("shift") : t("shifts")}
                </div>
              </div>
            )}
          </div>

          {hasShifts && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-indigo-500/10 dark:bg-indigo-500/20">
              <div className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 text-xs font-medium shadow-md border border-indigo-100 dark:border-indigo-800/50">
                {t("viewShifts")}
              </div>
            </div>
          )}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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

        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300"
              >
                <Filter className="h-4 w-4 mr-1" />
                {t("filter")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">{t("timeOfDay")}</h4>
                <Select
                  value={timeFilter}
                  onValueChange={(value) => setTimeFilter(value as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("selectTime")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allTimes")}</SelectItem>
                    <SelectItem value="morning">{t("morning")}</SelectItem>
                    <SelectItem value="afternoon">{t("afternoon")}</SelectItem>
                    <SelectItem value="evening">{t("evening")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
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
          {renderMonthCalendar()}
        </div>
      </div>

      {/* Shift details modal */}
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
        isDisabled={
          selectedShiftForDetails
            ? isOverlapping(selectedShiftForDetails) ||
              overlapsWithSelected(selectedShiftForDetails)
            : false
        }
      />

      {/* Day shifts dialog */}
      <Dialog
        open={!!selectedDay}
        onOpenChange={(open) => !open && setSelectedDay(null)}
      >
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedDay &&
                t("shiftsForDate", {
                  date: format(parseISO(selectedDay), "EEEE, MMMM d, yyyy"),
                })}
            </DialogTitle>
          </DialogHeader>

          {selectedDay && (shiftsByDate[selectedDay] || []).length > 0 && (
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {(shiftsByDate[selectedDay] || []).length}{" "}
                {t("shiftsAvailable")}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectAllShiftsForDay(selectedDay)}
                className="h-8 text-xs"
              >
                {t("selectAll")}
              </Button>
            </div>
          )}

          <div className="max-h-[60vh] overflow-y-auto p-1 space-y-2">
            {selectedDay && (shiftsByDate[selectedDay] || []).length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                {t("noShiftsAvailable")}
              </div>
            ) : (
              selectedDay &&
              (shiftsByDate[selectedDay] || []).map((shift) => {
                const isOverlap = isOverlapping(shift);
                const isOverlapSelected = overlapsWithSelected(shift);
                const isDisabled = isOverlap || isOverlapSelected;

                return (
                  <div
                    key={shift.workingScheduleId}
                    className={cn(
                      "rounded-lg border p-3 transition-all",
                      isShiftSelected(shift)
                        ? "bg-indigo-50 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-700"
                        : isDisabled
                        ? "bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 opacity-70"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={cn(
                          "p-2 rounded-full",
                          isShiftSelected(shift)
                            ? "bg-indigo-100 dark:bg-indigo-800/50"
                            : isDisabled
                            ? "bg-slate-200 dark:bg-slate-700"
                            : "bg-slate-100 dark:bg-slate-800"
                        )}
                      >
                        {isDisabled ? (
                          <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                        ) : (
                          <Clock
                            className={cn(
                              "h-4 w-4",
                              isShiftSelected(shift)
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-slate-500 dark:text-slate-400"
                            )}
                          />
                        )}
                      </div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {format(
                          parseISO(`2000-01-01T${shift.startTime}`),
                          "h:mm a"
                        )}{" "}
                        -
                        {format(
                          parseISO(`2000-01-01T${shift.endTime}`),
                          "h:mm a"
                        )}
                      </div>
                    </div>

                    {isDisabled && !isShiftSelected(shift) && (
                      <div className="text-xs text-red-500 dark:text-red-400 ml-10 mb-2">
                        {isOverlap
                          ? t("overlapsWithRegistered")
                          : t("overlapsWithSelected")}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDay(null);
                          setTimeout(() => openShiftDetails(shift), 100);
                        }}
                        className="h-8 text-xs px-2 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                      >
                        {t("details")}
                      </Button>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShiftSelect(shift)}
                                disabled={!isShiftSelected(shift) && isDisabled}
                                className={cn(
                                  "h-8 text-xs",
                                  isShiftSelected(shift)
                                    ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                    : isDisabled
                                    ? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                                    : "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                )}
                              >
                                {isShiftSelected(shift)
                                  ? t("remove")
                                  : t("select")}
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {isDisabled && !isShiftSelected(shift) && (
                            <TooltipContent>
                              <p className="text-xs">
                                {isOverlap
                                  ? t("overlapsWithRegisteredTooltip")
                                  : t("overlapsWithSelectedTooltip")}
                              </p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
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
