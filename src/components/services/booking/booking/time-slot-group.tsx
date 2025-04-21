"use client";

import { TimeSlot } from "./time-slot";

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
  if (!timeSlots || timeSlots.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </h5>
      <div className="flex flex-wrap gap-2">
        {timeSlots.map((time) => (
          <TimeSlot
            key={time}
            time={time}
            isSelected={selectedTime === time}
            onSelect={onTimeSelect}
          />
        ))}
      </div>
    </div>
  );
}
