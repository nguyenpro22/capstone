"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, endOfWeek, isToday } from "date-fns";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { DoctorWorkingSchedule } from "@/features/doctor/types";
import { OrderStatus } from "@/features/booking/types";

interface WeekViewProps {
  date: Date;
  appointmentsByDate: Record<string, DoctorWorkingSchedule[]>;
  onAppointmentClick: (appointment: DoctorWorkingSchedule) => void;
}

export function WeekView({
  date,
  appointmentsByDate,
  onAppointmentClick,
}: WeekViewProps) {
  const t = useTranslations("doctor");
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  // Generate week days
  useEffect(() => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start from Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });

    const days = [];
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    setWeekDays(days);
  }, [date]);

  // Time slots from 8 AM to 6 PM
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8);

  // Get status color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-50 border-l-2 border-yellow-300";
      case OrderStatus.IN_PROGRESS:
        return "bg-blue-50 border-l-2 border-blue-300";
      case OrderStatus.COMPLETED:
        return "bg-green-50 border-l-2 border-green-300";
      case OrderStatus.UNCOMPLETED:
        return "bg-red-50 border-l-2 border-red-300";
      default:
        return "bg-gray-50 border-l-2 border-gray-300";
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 text-center text-xs text-muted-foreground">
            {t("calendar.time")}
          </div>
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className={cn(
                "p-2 text-center",
                isToday(day) ? "bg-accent/30" : ""
              )}
            >
              <div className="text-xs text-muted-foreground">
                {format(day, "EEE")}
              </div>
              <div className={cn("text-sm", isToday(day) ? "font-medium" : "")}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div>
          {timeSlots.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b">
              <div className="p-2 text-center text-xs text-muted-foreground border-r">
                {format(new Date(2000, 1, 1, hour), "h a")}
              </div>

              {weekDays.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const appointments = appointmentsByDate[dateStr] || [];

                // Filter appointments for this hour
                const hourAppointments = appointments.filter((appointment) => {
                  const startHour = Number.parseInt(
                    appointment.startTime.split(":")[0]
                  );
                  return startHour === hour;
                });

                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "p-1 min-h-[60px] border-r",
                      isToday(day) ? "bg-accent/10" : ""
                    )}
                  >
                    {hourAppointments.map((appointment) => (
                      <button
                        key={appointment.workingScheduleId}
                        onClick={() => onAppointmentClick(appointment)}
                        className={cn(
                          "w-full text-left text-xs p-1.5 rounded mb-1 block",
                          getStatusColor(appointment.status)
                        )}
                      >
                        <div className="font-medium truncate">
                          {appointment.customerName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(
                            new Date(`2000-01-01T${appointment.startTime}`),
                            "h:mm"
                          )}{" "}
                          -
                          {format(
                            new Date(`2000-01-01T${appointment.endTime}`),
                            "h:mm"
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
