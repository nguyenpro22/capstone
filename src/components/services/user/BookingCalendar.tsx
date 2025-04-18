// components/BookingCalendar.tsx
import React from "react";
import {
  format,
  parseISO,
  startOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import type { Booking } from "@/features/booking/types";

interface Props {
  t: any;
  selectedDate: Date | undefined;
  setSelectedDate: (d: Date | undefined) => void;
  calendarBookings: Booking[];
  handleDayClick: (day: {
    date: Date;
    bookings: Booking[];
    count: number;
  }) => void;
  loading: boolean;
}

export const BookingCalendar: React.FC<Props> = ({
  t,
  selectedDate,
  setSelectedDate,
  calendarBookings,
  handleDayClick,
  loading,
}) => {
  const days = React.useMemo(() => {
    if (!selectedDate) return [];
    const start = startOfMonth(selectedDate);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    return eachDayOfInterval({ start, end }).map((date) => {
      const bookings = calendarBookings.filter(
        (b) => b.date && isSameDay(parseISO(b.date), date)
      );
      return { date, bookings, count: bookings.length };
    });
  }, [selectedDate, calendarBookings]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[260px] justify-start text-left font-normal bg-white dark:bg-indigo-950/60 dark:border-indigo-800/30 dark:text-indigo-200"
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
              {selectedDate ? (
                format(selectedDate, "MMMM yyyy", { locale: vi })
              ) : (
                <span>Chọn tháng</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 dark:bg-indigo-950 dark:border-indigo-800/30"
            align="center"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className="dark:bg-indigo-950"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`h-32 p-1 ${
              isSameDay(day.date, new Date())
                ? "bg-purple-500/10 dark:bg-purple-500/20 rounded-lg"
                : ""
            }`}
            onClick={() => handleDayClick(day)}
          >
            <div className="h-full border border-purple-100 dark:border-indigo-800/30 rounded-lg p-2 hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer transition-all">
              <div className="flex justify-between items-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                    isSameDay(day.date, new Date())
                      ? "bg-purple-600 text-white dark:bg-purple-500"
                      : "text-gray-700 dark:text-indigo-200"
                  }`}
                >
                  {format(day.date, "d")}
                </div>
                {day.count > 0 && (
                  <Badge className="bg-purple-600 dark:bg-purple-500 text-white">
                    {day.count}
                  </Badge>
                )}
              </div>

              <div className="mt-2 space-y-1">
                {day.bookings.slice(0, 2).map((booking) => (
                  <div
                    key={booking.id}
                    className={`text-xs p-1 rounded truncate bg-indigo-600 text-white`}
                  >
                    {booking.start && booking.start.substring(0, 5)}{" "}
                    {booking.serviceName.substring(0, 10)}...
                  </div>
                ))}

                {day.count > 2 && (
                  <div className="text-xs text-gray-500 dark:text-indigo-300/70 text-center">
                    +{day.count - 2} {t("moreBookings")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
