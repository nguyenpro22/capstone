"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlotGridProps {
  isLoading: boolean;
  availableTimeSlots: string[];
  selectedTime: string | undefined;
  onTimeSelect: (time: string) => void;
}

export function TimeSlotGrid({
  isLoading,
  availableTimeSlots,
  selectedTime,
  onTimeSelect,
}: TimeSlotGridProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <Loader2 className="h-10 w-10 mx-auto text-purple-500 dark:text-purple-400 animate-spin mb-2" />
        <p className="text-gray-500 dark:text-indigo-300/70 text-sm">
          Đang tải khung giờ trống...
        </p>
      </div>
    );
  }

  // If no available slots after calculations, show a message
  if (availableTimeSlots.length === 0) {
    return (
      <div className="p-4 text-center">
        <Clock className="h-10 w-10 mx-auto text-gray-300 dark:text-indigo-700 mb-2" />
        <p className="text-gray-500 dark:text-indigo-300/70 text-sm">
          Không có khung giờ trống cho ngày này. Vui lòng chọn ngày khác.
        </p>
      </div>
    );
  }

  // Helper function to convert time string to minutes
  const parseTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const morningSlots = availableTimeSlots.filter(
    (time) => parseTimeToMinutes(time) < 12 * 60
  );
  const afternoonSlots = availableTimeSlots.filter(
    (time) => parseTimeToMinutes(time) >= 12 * 60
  );

  return (
    <div className="space-y-3">
      {morningSlots.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-gray-600 dark:text-indigo-300 mb-1.5">
            Buổi sáng
          </h5>
          <div className="grid grid-cols-4 gap-1">
            {morningSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={cn(
                  "h-8 w-full text-xs px-1",
                  selectedTime === time
                    ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                    : "border-gray-200 dark:border-indigo-800/30 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                )}
                onClick={() => onTimeSelect(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {afternoonSlots.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-gray-600 dark:text-indigo-300 mb-1.5">
            Buổi chiều
          </h5>
          <div className="grid grid-cols-4 gap-1">
            {afternoonSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={cn(
                  "h-8 w-full text-xs px-1",
                  selectedTime === time
                    ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                    : "border-gray-200 dark:border-indigo-800/30 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                )}
                onClick={() => onTimeSelect(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedTime && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-indigo-800/30">
          <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm">
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            <span className="font-medium">Bạn đã chọn: {selectedTime}</span>
          </div>
        </div>
      )}
    </div>
  );
}
