"use client";

import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRightIcon,
  Clock,
} from "lucide-react";
import { CalendarPicker } from "./calendar-picker";
import { TimeSlotGrid } from "./time-slot-grid";

interface DateTimeSelectionStepProps {
  currentMonth: Date;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  calendarDays: (Date | null)[];
  availableTimeSlots: string[];
  isLoadingTimeSlots: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onBack: () => void;
  onNext: () => void;
  isDateDisabled: (date: Date) => boolean;
}

export function DateTimeSelectionStep({
  currentMonth,
  selectedDate,
  selectedTime,
  calendarDays,
  availableTimeSlots,
  isLoadingTimeSlots,
  onPrevMonth,
  onNextMonth,
  onDateSelect,
  onTimeSelect,
  onBack,
  onNext,
  isDateDisabled,
}: DateTimeSelectionStepProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-indigo-200 mb-4 text-center">
        Bước 2: Chọn ngày và giờ
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calendar for date selection */}
        <div className="bg-white dark:bg-indigo-950/60 rounded-lg border border-gray-200 dark:border-indigo-800/30 p-3 shadow-sm">
          <h4 className="font-medium text-sm text-gray-800 dark:text-indigo-200 mb-3 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1.5 text-purple-600 dark:text-purple-400" />
            Chọn ngày
          </h4>

          <CalendarPicker
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            calendarDays={calendarDays}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            onDateSelect={onDateSelect}
            isDateDisabled={isDateDisabled}
          />
        </div>

        {/* Time slot selection */}
        <div className="bg-white dark:bg-indigo-950/60 rounded-lg border border-gray-200 dark:border-indigo-800/30 p-3 shadow-sm">
          <h4 className="font-medium text-sm text-gray-800 dark:text-indigo-200 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-purple-600 dark:text-purple-400" />
            Chọn giờ
          </h4>

          {selectedDate ? (
            <TimeSlotGrid
              isLoading={isLoadingTimeSlots}
              availableTimeSlots={availableTimeSlots}
              selectedTime={selectedTime}
              onTimeSelect={onTimeSelect}
            />
          ) : (
            <div className="p-4 text-center">
              <Clock className="h-10 w-10 mx-auto text-gray-300 dark:text-indigo-700 mb-2" />
              <p className="text-gray-500 dark:text-indigo-300/70 text-sm">
                Vui lòng chọn ngày trước khi chọn giờ
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          className="border-purple-200 dark:border-indigo-800/30 dark:bg-indigo-950/60 dark:text-indigo-200 dark:hover:bg-indigo-900/60 h-9 text-sm rounded-lg px-4"
          onClick={onBack}
        >
          <ChevronLeft className="mr-1.5 h-4 w-4" />
          Quay lại
        </Button>
        <Button
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600/90 hover:to-indigo-600/90 text-white font-medium shadow-sm h-9 text-sm rounded-lg transition-all duration-200 px-4"
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
        >
          Tiếp tục
          <ChevronRightIcon className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
