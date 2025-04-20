"use client";

import { useState } from "react";
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  addDays,
  isBefore,
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
import { Calendar, Clock, Search, Filter, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetClinicShiftSchedulesQuery } from "@/features/doctor/api";
import type { ClinicShiftSchedule } from "@/features/doctor/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShiftDetailsModal } from "./shift-details-modal";
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
    "all" | "today" | "tomorrow" | "week" | "month"
  >("all");
  const token = getAccessToken() as string;
  const { clinicId } = GetDataByToken(token) as TokenData;
  const [selectedShiftForDetails, setSelectedShiftForDetails] =
    useState<ClinicShiftSchedule | null>(null);

  // Calculate date range based on filter
  const today = startOfToday();
  const getDateRange = () => {
    switch (dateFilter) {
      case "today":
        return `${format(today, "yyyy-MM-dd")}`;
      case "tomorrow":
        return `${format(addDays(today, 1), "yyyy-MM-dd")}`;
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
      default:
        return "";
    }
  };

  // Fetch available shifts
  const { data, isLoading } = useGetClinicShiftSchedulesQuery({
    clinicId: clinicId || "c0b7058f-8e72-4dee-8742-0df6206d1843",
    searchTerm: getDateRange(),
    pageSize: 100,
  });

  const allShifts = data?.value?.items || [];

  // Filter shifts based on search and filters
  const filteredShifts = allShifts.filter((shift) => {
    // Date filtering
    if (dateFilter === "today" && !isToday(parseISO(shift.date))) return false;
    if (dateFilter === "tomorrow" && !isTomorrow(parseISO(shift.date)))
      return false;
    if (
      dateFilter === "week" &&
      isBefore(parseISO(shift.date), addDays(today, 7)) === false
    )
      return false;
    if (
      dateFilter === "month" &&
      isBefore(parseISO(shift.date), addDays(today, 30)) === false
    )
      return false;

    // Time filtering
    const hour = Number.parseInt(shift.startTime.split(":")[0], 10);
    if (timeFilter === "morning" && (hour < 6 || hour >= 12)) return false;
    if (timeFilter === "afternoon" && (hour < 12 || hour >= 17)) return false;
    if (timeFilter === "evening" && (hour < 17 || hour >= 23)) return false;

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

  if (isLoading) {
    return <ListSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={t("searchShifts")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-slate-200 dark:border-slate-700 focus-visible:ring-indigo-500 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700">
              <Filter className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">
                Filters:
              </span>

              <Select
                value={dateFilter}
                onValueChange={(value) => setDateFilter(value as any)}
              >
                <SelectTrigger className="w-[130px] border-0 bg-transparent focus:ring-0 p-0 h-auto shadow-none">
                  <SelectValue placeholder={t("dateFilter")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allDates")}</SelectItem>
                  <SelectItem value="today">{t("today")}</SelectItem>
                  <SelectItem value="tomorrow">{t("tomorrow")}</SelectItem>
                  <SelectItem value="week">{t("nextWeek")}</SelectItem>
                  <SelectItem value="month">{t("nextMonth")}</SelectItem>
                </SelectContent>
              </Select>

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

              <Select
                value={timeFilter}
                onValueChange={(value) => setTimeFilter(value as any)}
              >
                <SelectTrigger className="w-[130px] border-0 bg-transparent focus:ring-0 p-0 h-auto shadow-none">
                  <SelectValue placeholder={t("timeFilter")} />
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
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredShifts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
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
            className="space-y-8"
          >
            {sortedDates.map((date) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
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
                  <Badge className="ml-auto bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {groupedShifts[date].length} {t("shifts")}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedShifts[date].map((shift) => (
                    <motion.div
                      key={shift.workingScheduleId}
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Card
                        className={cn(
                          "border transition-all overflow-hidden",
                          isShiftSelected(shift)
                            ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 shadow-md"
                            : "border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800/50"
                        )}
                      >
                        <CardContent className="p-0">
                          <div
                            className={cn(
                              "h-2",
                              isShiftSelected(shift)
                                ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                                : "bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
                            )}
                          ></div>
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={cn(
                                  "p-3 rounded-lg",
                                  isShiftSelected(shift)
                                    ? "bg-indigo-200 dark:bg-indigo-800/50"
                                    : "bg-slate-100 dark:bg-slate-800"
                                )}
                              >
                                <Clock
                                  className={cn(
                                    "h-5 w-5",
                                    isShiftSelected(shift)
                                      ? "text-indigo-700 dark:text-indigo-300"
                                      : "text-slate-500 dark:text-slate-400"
                                  )}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
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
                                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                  {format(
                                    parseISO(shift.date),
                                    "EEEE, MMMM d, yyyy",
                                    { locale: vi }
                                  )}
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openShiftDetails(shift)}
                                    className="h-8 text-xs border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                  >
                                    <Info className="h-3 w-3 mr-1" />
                                    {t("details")}
                                  </Button>
                                  <Checkbox
                                    checked={isShiftSelected(shift)}
                                    onCheckedChange={() =>
                                      handleShiftSelect(shift)
                                    }
                                    className="h-5 w-5 border-indigo-300 dark:border-indigo-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 dark:data-[state=checked]:bg-indigo-500 dark:data-[state=checked]:border-indigo-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
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
      />
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-full md:w-[300px]" />
        </div>
      </div>

      <div className="space-y-8">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16 ml-auto" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(3)
                  .fill(0)
                  .map((_, j) => (
                    <Skeleton key={j} className="h-32 rounded-lg" />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
