"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

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

  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-medium mb-3">{title}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              className="flex items-center justify-center"
              onClick={() => onTimeSelect(time)}
            >
              <Clock className="h-3 w-3 mr-1" />
              {formatTimeRange(time)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
