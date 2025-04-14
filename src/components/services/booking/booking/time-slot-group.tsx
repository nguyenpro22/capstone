"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeSlotGroupProps {
  title: string;
  timeSlots: string[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export function TimeSlotGroup({
  title,
  timeSlots,
  selectedTime,
  onTimeSelect,
}: TimeSlotGroupProps) {
  if (timeSlots.length === 0) return null;

  // Format time for display (e.g., "08:00" -> "8:00 - 9:00")
  const formatTimeRange = (timeSlot: string) => {
    const [hour] = timeSlot.split(":").map(Number);
    return `${hour}:00 - ${hour + 1}:00`;
  };

  // Get background color class based on title
  const getBackgroundClass = () => {
    switch (title) {
      case "Buổi sáng":
        return "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30";
      case "Buổi chiều":
        return "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30";
      case "Buổi tối":
        return "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/30";
      default:
        return "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/30";
    }
  };

  return (
    <div className={cn("rounded-lg p-3 border", getBackgroundClass())}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {timeSlots.map((time) => (
          <Button
            key={time}
            variant={selectedTime === time ? "default" : "outline"}
            className={cn(
              "flex items-center justify-center h-11 shadow-sm border-0",
              selectedTime === time
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600"
                : "bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
            )}
            onClick={() => onTimeSelect(time)}
          >
            <span className="font-medium">{formatTimeRange(time)}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
