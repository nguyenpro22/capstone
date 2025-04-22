"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, isToday, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CalendarPickerProps {
  currentMonth: Date;
  selectedDate: Date | undefined;
  calendarDays: (Date | null)[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateSelect: (date: Date) => void;
  isDateDisabled: (date: Date) => boolean;
}

export function CalendarPicker({
  currentMonth,
  selectedDate,
  calendarDays,
  onPrevMonth,
  onNextMonth,
  onDateSelect,
  isDateDisabled,
}: CalendarPickerProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevMonth}
          className="h-7 w-7 p-0 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Button>

        <h3 className="font-medium text-sm dark:text-indigo-200">
          {format(currentMonth, "MMMM yyyy", { locale: vi })}
        </h3>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNextMonth}
          className="h-7 w-7 p-0 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-gray-600 dark:text-indigo-300 text-[10px] py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          // Check if this day is disabled
          const isDisabled = day ? isDateDisabled(day) : true;

          // Check if this day is the selected date
          const isSelected =
            day && selectedDate ? isSameDay(day, selectedDate) : false;

          // Check if this day is today
          const isDayToday = day ? isToday(day) : false;

          return (
            <div
              key={i}
              className={cn(
                "h-7 flex items-center justify-center rounded-md text-xs transition-colors duration-200",
                !day && "text-gray-300 dark:text-indigo-800",
                day &&
                  !isDisabled &&
                  !isSelected &&
                  "hover:bg-purple-100 dark:hover:bg-indigo-900/40 cursor-pointer",
                day &&
                  isDayToday &&
                  !isSelected &&
                  "bg-purple-500/20 dark:bg-purple-500/10 font-bold text-purple-700 dark:text-purple-400",
                day &&
                  isSelected &&
                  "bg-purple-600 dark:bg-purple-500 text-white font-bold shadow-sm",
                day &&
                  isDisabled &&
                  "text-gray-400 dark:text-indigo-800 cursor-not-allowed opacity-50"
              )}
              onClick={() => day && !isDisabled && onDateSelect(day)}
            >
              {day ? day.getDate() : ""}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-2 border border-indigo-100 dark:border-indigo-800/30">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1.5 text-indigo-600 dark:text-indigo-400" />
            <p className="text-indigo-700 dark:text-indigo-300 font-medium text-xs">
              {format(selectedDate, "EEEE, dd/MM/yyyy", {
                locale: vi,
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
