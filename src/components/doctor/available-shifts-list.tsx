"use client";

import { useState, useEffect } from "react";
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  addDays,
  startOfToday,
} from "date-fns";
import { vi } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Info,
  Calendar,
  Clock,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetClinicShiftSchedulesQuery } from "@/features/doctor/api";
import type { ClinicShiftSchedule } from "@/features/doctor/types";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShiftDetailsModal } from "./shift-details-modal";
import { DateRangePicker } from "./date-range-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAccessToken, GetDataByToken, TokenData } from "@/utils";

interface AvailableShiftsListProps {
  selectedShifts: ClinicShiftSchedule[];
  onSelectShift: (shift: ClinicShiftSchedule) => void;
}

export function AvailableShiftsList({
  selectedShifts,
  onSelectShift,
}: AvailableShiftsListProps) {
  const t = useTranslations("registerSchedule");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState<
    "all" | "morning" | "afternoon" | "evening"
  >("all");
  const [dateFilter, setDateFilter] = useState<
    "today" | "tomorrow" | "week" | "month" | "custom"
  >("today");
  const token = getAccessToken() as string;
  const { clinicId } = GetDataByToken(token) as TokenData;
  const [selectedShiftForDetails, setSelectedShiftForDetails] =
    useState<ClinicShiftSchedule | null>(null);
  const [customDateRange, setCustomDateRange] = useState<string>("");

  // Cập nhật hàm getDateRange để loại bỏ giới hạn 31 ngày cho tùy chọn custom
  const getDateRange = () => {
    const today = startOfToday();

    switch (dateFilter) {
      case "today":
        return `${format(today, "yyyy-MM-dd")} to ${format(
          today,
          "yyyy-MM-dd"
        )}`;
      case "tomorrow":
        const tomorrow = addDays(today, 1);
        return `${format(tomorrow, "yyyy-MM-dd")} to ${format(
          tomorrow,
          "yyyy-MM-dd"
        )}`;
      case "week":
        return `${format(today, "yyyy-MM-dd")} to ${format(
          addDays(today, 7),
          "yyyy-MM-dd"
        )}`;
      case "month":
        return `${format(today, "yyyy-MM-dd")} to ${format(
          addDays(today, 30),
          "yyyy-MM-dd"
        )}`;
      case "custom":
        // Không áp dụng giới hạn 31 ngày cho tùy chọn custom
        if (customDateRange) {
          return customDateRange;
        }
        return `${format(today, "yyyy-MM-dd")} to ${format(
          addDays(today, 30),
          "yyyy-MM-dd"
        )}`;
      default:
        return `${format(today, "yyyy-MM-dd")} to ${format(
          today,
          "yyyy-MM-dd"
        )}`;
    }
  };

  const dateRange = getDateRange();

  // Fetch available shifts
  const { data, isLoading } = useGetClinicShiftSchedulesQuery({
    clinicId: clinicId || "",
    searchTerm: dateRange,
    pageSize: 100,
  });

  // Loại bỏ việc fetch registered shifts
  const allShifts = data?.value?.items || [];

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

  // Filter shifts based on search and filters
  const filteredShifts = allShifts.filter((shift) => {
    // Time filtering
    if (timeFilter !== "all") {
      const hour = Number.parseInt(shift.startTime.split(":")[0], 10);
      if (timeFilter === "morning" && (hour < 6 || hour >= 12)) return false;
      if (timeFilter === "afternoon" && (hour < 12 || hour >= 17)) return false;
      if (timeFilter === "evening" && (hour < 17 || hour >= 23)) return false;
    }

    // Search term filtering (date or time)
    if (searchTerm) {
      const formattedDate = format(parseISO(shift.date), "EEEE, MMMM d");
      const formattedTime = `${format(
        parseISO(`2000-01-01T${shift.startTime}`),
        "h:mm a"
      )} - ${format(parseISO(`2000-01-01T${shift.endTime}`), "h:mm a")}`;

      return (
        formattedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formattedTime.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return true;
  });

  // Group shifts by date
  const groupedShifts = filteredShifts.reduce((acc, shift) => {
    const date = shift.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(shift);
    return acc;
  }, {} as Record<string, ClinicShiftSchedule[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedShifts).sort((a, b) => {
    return parseISO(a).getTime() - parseISO(b).getTime();
  });

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

  // Select all non-overlapping shifts for a date
  const selectAllShiftsForDate = (date: string) => {
    const dateShifts = groupedShifts[date] || [];

    // First, collect all shifts that don't overlap with registered shifts
    const validShifts: ClinicShiftSchedule[] = [];
    const invalidShifts: ClinicShiftSchedule[] = [];

    dateShifts.forEach((shift) => {
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

  // Deselect all shifts for a date
  const deselectAllShiftsForDate = (date: string) => {
    const dateShifts = groupedShifts[date] || [];
    dateShifts.forEach((shift) => {
      if (isShiftSelected(shift)) {
        handleShiftSelect(shift);
      }
    });
  };

  // Check if all shifts for a date are selected
  const areAllShiftsSelectedForDate = (date: string) => {
    const dateShifts = groupedShifts[date] || [];
    return (
      dateShifts.length > 0 &&
      dateShifts.every((shift) => isShiftSelected(shift))
    );
  };

  // Check if some shifts for a date are selected
  const areSomeShiftsSelectedForDate = (date: string) => {
    const dateShifts = groupedShifts[date] || [];
    return (
      dateShifts.some((shift) => isShiftSelected(shift)) &&
      !areAllShiftsSelectedForDate(date)
    );
  };

  // Set today as default filter on component mount
  useEffect(() => {
    setDateFilter("today");
  }, []);

  if (isLoading) {
    return <ListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Thiết kế lại UI bộ lọc */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={t("searchShifts")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-slate-200 dark:border-slate-700 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                {t("dateFilter")}
              </label>
              <Select
                value={dateFilter}
                onValueChange={(value) => setDateFilter(value as any)}
              >
                <SelectTrigger className="w-full border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder={t("selectDateFilter")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">{t("today")}</SelectItem>
                  <SelectItem value="tomorrow">{t("tomorrow")}</SelectItem>
                  <SelectItem value="week">{t("nextWeek")}</SelectItem>
                  <SelectItem value="month">{t("nextMonth")}</SelectItem>
                  <SelectItem value="custom">{t("customDateRange")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-500" />
                {t("timeFilter")}
              </label>
              <Select
                value={timeFilter}
                onValueChange={(value) => setTimeFilter(value as any)}
              >
                <SelectTrigger className="w-full border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder={t("selectTimeFilter")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allTimes")}</SelectItem>
                  <SelectItem value="morning">{t("morning")}</SelectItem>
                  <SelectItem value="afternoon">{t("afternoon")}</SelectItem>
                  <SelectItem value="evening">{t("evening")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {dateFilter === "custom" && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <DateRangePicker
                onDateRangeChange={(range) => setCustomDateRange(range)}
                className="w-full"
                // Không áp dụng giới hạn ngày cho tùy chọn custom
                maxRangeInDays={undefined}
              />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredShifts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
              <Calendar className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">
              {t("noShiftsFound")}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {t("tryAdjustingFilters")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {sortedDates.map((date) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
              >
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl">
                      <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        {isToday(parseISO(date))
                          ? t("today")
                          : isTomorrow(parseISO(date))
                          ? t("tomorrow")
                          : format(parseISO(date), "EEEE, MMMM d", {
                              locale: vi,
                            })}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {format(parseISO(date), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                      {groupedShifts[date].length} {t("shifts")}
                    </Badge>
                    <Checkbox
                      checked={areAllShiftsSelectedForDate(date)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          selectAllShiftsForDate(date);
                        } else {
                          deselectAllShiftsForDate(date);
                        }
                      }}
                      className={cn(
                        "h-5 w-5 border-indigo-300 dark:border-indigo-700",
                        areSomeShiftsSelectedForDate(date) &&
                          "data-[state=indeterminate]:bg-indigo-600 data-[state=indeterminate]:border-indigo-600"
                      )}
                    />
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {groupedShifts[date].map((shift) => {
                    const isOverlap = isOverlapping(shift);
                    const isOverlapSelected = overlapsWithSelected(shift);
                    const isDisabled = isOverlap || isOverlapSelected;

                    return (
                      <div
                        key={shift.workingScheduleId}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-all",
                          isShiftSelected(shift)
                            ? "bg-indigo-50 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-700"
                            : isDisabled
                            ? "bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 opacity-70"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700"
                        )}
                      >
                        <div className="flex items-center gap-3">
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
                          <div>
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
                            {isDisabled && (
                              <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                                {isOverlap
                                  ? t("overlapsWithRegistered")
                                  : t("overlapsWithSelected")}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openShiftDetails(shift)}
                            className="h-8 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                          >
                            <Info className="h-3.5 w-3.5 mr-1" />
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
                                    disabled={
                                      !isShiftSelected(shift) && isDisabled
                                    }
                                    className={cn(
                                      "h-8 text-xs",
                                      isShiftSelected(shift)
                                        ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                        : isDisabled
                                        ? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                                        : "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    )}
                                  >
                                    {isShiftSelected(shift) ? (
                                      <>
                                        <X className="h-3.5 w-3.5 mr-1" />
                                        {t("remove")}
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                        {t("select")}
                                      </>
                                    )}
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
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-grow" />
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 w-full sm:w-[150px]" />
            <Skeleton className="h-10 w-full sm:w-[150px]" />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="space-y-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
            >
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-11 w-11 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>

              <div className="p-4 space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, j) => (
                    <Skeleton key={j} className="h-16 rounded-lg" />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
