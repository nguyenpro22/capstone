"use client";

import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  addWeeks,
} from "date-fns";
import { useShiftData } from "@/hooks/use-shift-data";
import { useTranslations } from "next-intl";
import type {
  DoctorWorkingSchedule,
  WorkingSchedule,
} from "@/features/doctor/types";
import { CalendarView } from "./calendar-view";
import { AppointmentSidebar } from "./appointment-sidebar";
import { AppointmentDetails } from "./appointment-details";
import { useLocale } from "next-intl";
import { useDateTimeFormat } from "@/hooks/use-datetime-format";

export default function CalendarPage() {
  const t = useTranslations("doctor");
  const locale = useLocale();
  const dateTimeFormat = useDateTimeFormat();

  // State for view type and current date
  const [viewType, setViewType] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedShift, setSelectedShift] =
    useState<DoctorWorkingSchedule | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<WorkingSchedule | null>(null);

  // Calculate date range based on view type
  const dateRange = useMemo(() => {
    if (viewType === "month") {
      return {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      };
    } else {
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      };
    }
  }, [currentDate, viewType]);

  // Fetch data with calculated date range
  const { shifts, isLoading } = useShiftData(dateRange.start, dateRange.end);

  // Handle navigation
  const handlePrevious = () => {
    setCurrentDate((prev) =>
      viewType === "month" ? addMonths(prev, -1) : addWeeks(prev, -1)
    );
  };

  const handleNext = () => {
    setCurrentDate((prev) =>
      viewType === "month" ? addMonths(prev, 1) : addWeeks(prev, 1)
    );
  };

  const handleViewTypeChange = (type: "month" | "week") => {
    setViewType(type);
    // Reset current date when changing view to avoid unexpected date ranges
    setCurrentDate(new Date());
  };

  // Get shifts for the selected date
  const shiftsForSelectedDate = selectedDate
    ? shifts.filter((shift) => {
        const shiftDate = new Date(shift.date);
        return shiftDate.toDateString() === selectedDate.toDateString();
      })
    : [];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-900/20 dark:to-indigo-900/30">
      <header className="bg-gradient-to-r from-purple-900/90 to-indigo-900/80 text-white p-4 shadow-md flex-shrink-0">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">{t("calendar.title")}</h1>
          {selectedDate && (
            <p className="text-purple-100">
              {dateTimeFormat.formatDate(selectedDate)}
            </p>
          )}
        </div>
      </header>

      <main className="flex flex-1 p-4 gap-4 overflow-hidden min-h-0">
        <div className="flex-1 rounded-xl shadow-lg bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/50 overflow-hidden">
          <CalendarView
            shifts={shifts}
            isLoading={isLoading}
            selectedDate={selectedDate}
            currentDate={currentDate}
            viewType={viewType}
            onSelectDate={setSelectedDate}
            onSelectShift={setSelectedShift}
            onSelectAppointment={setSelectedAppointment}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onViewTypeChange={handleViewTypeChange}
          />
        </div>

        {selectedDate && (
          <div className="w-full md:w-80 lg:w-96 rounded-xl shadow-lg bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/50 overflow-hidden flex-shrink-0">
            <AppointmentSidebar
              selectedDate={selectedDate}
              shifts={shiftsForSelectedDate}
              onSelectShift={setSelectedShift}
              onSelectAppointment={setSelectedAppointment}
            />
          </div>
        )}
      </main>

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          shift={selectedShift}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}
