"use client";

import type React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  className?: string;
  disabledDates?: Date[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthYearFormat = new Intl.DateTimeFormat("default", {
  month: "long",
  year: "numeric",
});
const dayFormat = new Intl.DateTimeFormat("default", { day: "numeric" });

const CustomCalendar: React.FC<CalendarProps> = ({
  className,
  disabledDates = [],
  selectedDate,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentMonth(
      (prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1)
    );
  };

  const handleDateSelect = (
    day: number,
    isPrevMonth = false,
    isNextMonth = false
  ) => {
    let year = currentMonth.getFullYear();
    let month = currentMonth.getMonth();

    if (isPrevMonth) {
      month -= 1;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
    } else if (isNextMonth) {
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
    }

    const selected = new Date(year, month, day);
    onDateSelect?.(selected);
  };

  const isDateDisabled = (
    day: number,
    isPrevMonth = false,
    isNextMonth = false
  ): boolean => {
    let year = currentMonth.getFullYear();
    let month = currentMonth.getMonth();

    if (isPrevMonth) {
      month -= 1;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
    } else if (isNextMonth) {
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
    }

    const dateToCheck = new Date(year, month, day);
    return disabledDates.some(
      (disabledDate) =>
        disabledDate.getFullYear() === dateToCheck.getFullYear() &&
        disabledDate.getMonth() === dateToCheck.getMonth() &&
        disabledDate.getDate() === dateToCheck.getDate()
    );
  };

  const isDateSelected = (
    day: number,
    isPrevMonth = false,
    isNextMonth = false
  ): boolean => {
    if (!selectedDate) return false;

    let year = currentMonth.getFullYear();
    let month = currentMonth.getMonth();

    if (isPrevMonth) {
      month -= 1;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
    } else if (isNextMonth) {
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
    }

    const dateToCheck = new Date(year, month, day);

    return (
      selectedDate.getFullYear() === dateToCheck.getFullYear() &&
      selectedDate.getMonth() === dateToCheck.getMonth() &&
      selectedDate.getDate() === dateToCheck.getDate()
    );
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateToCheck = new Date(year, month, day);

    return (
      today.getFullYear() === dateToCheck.getFullYear() &&
      today.getMonth() === dateToCheck.getMonth() &&
      today.getDate() === dateToCheck.getDate()
    );
  };

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)
  const prevMonthLastDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    0
  ).getDate();

  const nextMonthFirstDays =
    42 - (firstDayOfWeek + daysInMonth) > 0
      ? 42 - (firstDayOfWeek + daysInMonth)
      : 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="p-3 rounded-lg bg-white border shadow-sm dark:bg-indigo-950/60 dark:border-indigo-800/30">
        {/* Header with month/year and navigation */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-indigo-900/40 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4 text-gray-500 dark:text-indigo-300" />
          </button>
          <h2 className="text-sm font-medium dark:text-indigo-200">
            {monthYearFormat.format(currentMonth)}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-indigo-900/40 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-indigo-300" />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 mb-1">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-xs text-gray-500 dark:text-indigo-300/70 font-medium py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Previous month days */}
          {Array.from({ length: firstDayOfWeek }).map((_, index) => {
            const day = prevMonthLastDay - firstDayOfWeek + index + 1;
            const isPrevMonthDayDisabled = isDateDisabled(day, true);

            return (
              <button
                key={`prev-${index}`}
                onClick={() => handleDateSelect(day, true)}
                disabled={isPrevMonthDayDisabled}
                className={cn(
                  "h-7 w-full rounded-md text-center text-xs transition-colors",
                  "text-gray-400 dark:text-indigo-500/50",
                  isPrevMonthDayDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 dark:hover:bg-indigo-900/40",
                  isDateSelected(day, true) &&
                    "bg-purple-600 text-white hover:bg-purple-600 dark:bg-purple-500 dark:hover:bg-purple-500"
                )}
              >
                {day}
              </button>
            );
          })}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const isCurrentDayDisabled = isDateDisabled(day);

            return (
              <button
                key={`current-${index}`}
                onClick={() => handleDateSelect(day)}
                disabled={isCurrentDayDisabled}
                className={cn(
                  "h-7 w-full rounded-md text-center text-xs dark:text-indigo-200 transition-colors",
                  isToday(day) &&
                    !isDateSelected(day) &&
                    "font-bold text-purple-600 dark:text-purple-400",
                  isCurrentDayDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 dark:hover:bg-indigo-900/40",
                  isDateSelected(day) &&
                    "bg-purple-600 text-white hover:bg-purple-600 dark:bg-purple-500 dark:hover:bg-purple-500 font-normal"
                )}
              >
                {day}
              </button>
            );
          })}

          {/* Next month days */}
          {Array.from({ length: nextMonthFirstDays }).map((_, index) => {
            const day = index + 1;
            const isNextMonthDayDisabled = isDateDisabled(day, false, true);

            return (
              <button
                key={`next-${index}`}
                onClick={() => handleDateSelect(day, false, true)}
                disabled={isNextMonthDayDisabled}
                className={cn(
                  "h-7 w-full rounded-md text-center text-xs transition-colors",
                  "text-gray-400 dark:text-indigo-500/50",
                  isNextMonthDayDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 dark:hover:bg-indigo-900/40",
                  isDateSelected(day, false, true) &&
                    "bg-purple-600 text-white hover:bg-purple-600 dark:bg-purple-500 dark:hover:bg-purple-500"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
