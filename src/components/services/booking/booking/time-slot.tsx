"use client";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimeDisplay } from "../utils/booking-utils";

interface TimeSlotProps {
  time: string;
  isSelected: boolean;
  onSelect: (time: string) => void;
}

export function TimeSlot({ time, isSelected, onSelect }: TimeSlotProps) {
  // Format the display time (e.g., "14:30" -> "2:30 PM")
  const displayTime = formatTimeDisplay(time);

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "flex items-center justify-center h-10 px-3",
        isSelected
          ? "bg-purple-600 hover:bg-purple-700 text-white"
          : "border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
      )}
      onClick={() => onSelect(time)}
    >
      <Clock className="h-3.5 w-3.5 mr-1.5" />
      {displayTime}
    </Button>
  );
}
