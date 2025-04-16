"use client";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
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
        return "bg-amber-50";
      case "Buổi chiều":
        return "bg-blue-50";
      case "Buổi tối":
        return "bg-purple-50";
      default:
        return "bg-gray-50";
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
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-white hover:bg-primary/10 text-foreground"
            )}
            onClick={() => onTimeSelect(time)}
          >
            {/* <Clock className="h-3.5 w-3.5 mr-1.5" /> */}
            <span className="font-medium">{formatTimeRange(time)}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
