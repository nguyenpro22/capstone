"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  mode: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export function CustomCalendar({
  mode,
  selected,
  onSelect,
  disabled,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selected || new Date()
  );

  // Update current month when selected date changes
  useEffect(() => {
    if (selected) {
      setCurrentMonth(new Date(selected));
    }
  }, [selected]);

  // Get the first day of the month
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );

  // Get the last day of the month
  const lastDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Get the number of days in the month
  const daysInMonth = lastDayOfMonth.getDate();

  // Get the previous month's last days to fill the first row
  const prevMonthLastDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    0
  ).getDate();

  // Get the next month's first days to fill the last row
  const nextMonthFirstDays = 42 - (firstDayOfWeek + daysInMonth); // 42 = 6 rows * 7 days

  // Days of the week
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Format month and year
  const monthYearFormat = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Handle date selection
  const handleDateSelect = (
    day: number,
    isPrevMonth = false,
    isNextMonth = false
  ) => {
    let selectedDate: Date;

    if (isPrevMonth) {
      selectedDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        day
      );
    } else if (isNextMonth) {
      selectedDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        day
      );
    } else {
      selectedDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
    }

    if (disabled && disabled(selectedDate)) {
      return;
    }

    onSelect?.(selectedDate);
  };

  // Check if a date is selected
  const isDateSelected = (
    day: number,
    isPrevMonth = false,
    isNextMonth = false
  ) => {
    if (!selected) return false;

    let dateToCheck: Date;

    if (isPrevMonth) {
      dateToCheck = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        day
      );
    } else if (isNextMonth) {
      dateToCheck = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        day
      );
    } else {
      dateToCheck = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
    }

    return (
      selected.getDate() === dateToCheck.getDate() &&
      selected.getMonth() === dateToCheck.getMonth() &&
      selected.getFullYear() === dateToCheck.getFullYear()
    );
  };

  // Check if a date is disabled
  const isDateDisabled = (
    day: number,
    isPrevMonth = false,
    isNextMonth = false
  ) => {
    if (!disabled) return false;

    let dateToCheck: Date;

    if (isPrevMonth) {
      dateToCheck = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        day
      );
    } else if (isNextMonth) {
      dateToCheck = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        day
      );
    } else {
      dateToCheck = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
    }

    return disabled(dateToCheck);
  };

  // Check if a date is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="p-2 rounded-lg bg-white border shadow dark:bg-indigo-950/60 dark:border-indigo-800/30">
        {/* Header with month/year and navigation */}
        <div className="flex justify-between items-center mb-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-indigo-900/40"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-gray-500 dark:text-indigo-300" />
          </button>
          <h2 className="text-xs font-medium dark:text-indigo-200">
            {monthYearFormat.format(currentMonth)}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-indigo-900/40"
            aria-label="Next month"
          >
            <ChevronRight className="h-3.5 w-3.5 text-gray-500 dark:text-indigo-300" />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 mb-0.5">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] text-gray-500 dark:text-indigo-300/70 font-medium py-0.5"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0.5">
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
                  "h-6 w-full rounded-md text-center text-[10px]",
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
                  "h-6 w-full rounded-md text-center text-[10px] dark:text-indigo-200",
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
                  "h-6 w-full rounded-md text-center text-[10px]",
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
}
