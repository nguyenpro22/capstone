"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useState } from "react";

interface MiniCalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  appointmentDates?: string[];
  className?: string;
}

export function MiniCalendar({
  value,
  onChange,
  appointmentDates = [],
  className,
}: MiniCalendarProps) {
  const [month, setMonth] = useState<Date>(value);

  // Create a Set of dates with appointments for faster lookup
  const appointmentDatesSet = new Set(appointmentDates);

  return (
    <DayPicker
      mode="single"
      selected={value}
      onSelect={(date) => date && onChange(date)}
      month={month}
      onMonthChange={setMonth}
      className={cn("p-0", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-2",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-1",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/50",
          "[&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        DayContent: ({ date, ...props }) => {
          const dateString = date.toISOString().split("T")[0];
          const hasAppointment = appointmentDatesSet.has(dateString);

          return (
            <div className="relative h-8 w-8 p-0 font-normal aria-selected:opacity-100">
              <div
                {...props}
                className="flex h-full w-full items-center justify-center"
              >
                {date.getDate()}
              </div>
              {hasAppointment && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
              )}
            </div>
          );
        },
      }}
    />
  );
}
